/* Node.js backend to bypass missing CORS headers
 * in the Supermetrics assignment API
 *
 * Author: Joonas Hujanen
 */

const config = require('./config.json')
const fetch = require('node-fetch')
const fs = require('fs')
const http = require('http')
const moment = require('moment')

/* Don't do anything before index.html is successfully loaded */
fs.readFile('./index.html', (err, html) => {
    if (err) {
        console.log('Unable to load index.html')
        return
    }

    /* Set up a http server listening to port set in config.
     * The server contains very rudimentary routing to serve
     * index.html, main.js and to register and fetch the post
     * data from the assignment API
     */
    http.createServer((req, res) => {
        if (req.url == '/') {
            res.write(html)
            res.end()
        }

        if (req.url.indexOf('main.js') != -1) {
            fs.readFile('./main.js', (err, js) => {
                if (err) {
                    console.log('Unable to load main.js')
                    return
                }

                res.setHeader('Content-Type', 'application/javascript')
                res.write(js)
                res.end()
            })
        }

        if (req.url.indexOf('getPostData') != -1) {
            register((result) => {
                const response = {
                    monthlyData: getMonthlyData(result),
                    postsByWeek: totalPostsByWeek(result),
                }
                res.write(JSON.stringify(response))
                res.end()
            })
        }
    }).listen(config.port)
})

/* Register a short-lived token on the Supermetrics API.
 * Parameters are set in config.json. If registration
 * succeeds, proceed to fetch post data recursively
 */
function register(callback)
{
    fetch(config.registrationEndpoint, {
        method: 'POST',
        body: JSON.stringify(config.registrationPayload),
        headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
        if (response.ok) {
            return response.json()
        }

        return Promise.resolve(null)
    }).then((result) => {
        if (result == null) {
            throw 'Error: unable to register api token'
            return
        }

        new Promise((resolve, reject) => {
            getPosts(
                config.postsEndpoint,
                result.data.sl_token,
                config.startingPage,
                config.startingPage + 1,
                [],
                resolve,
                reject
            )
        }).then((response) => {
            callback(response)
        })
    }).catch((ex) => {
        console.log(ex)
    })
}

//Recursively fetch post data. If a response page repeats, we're done
function getPosts(url, apiToken, currentPage, nextPage, posts, resolve, reject)
{
    fetch(url + "?sl_token=" + apiToken + "&page=" + nextPage)
    .then((response) => {
        if (response.ok) {
            return response.json()
        }

        return Promise.resolve([])
    }).then((result) => {
        if (currentPage == result.data.page) {
            resolve(posts)
            return
        }

        posts = posts.concat(result.data.posts)
        getPosts(url, apiToken, result.data.page, result.data.page + 1, posts, resolve, reject)
    }).catch((ex) => {
        console.log(ex)
    })
}

/* Get all the post data analysis that's based on month.
 * Contains avg. length of post per month, the id of the
 * longest post per month and avg post per user per month
 */
function getMonthlyData(posts)
{
    return avgLengths = config.months.map((month, index) => {
        const postsOfMonth = getPostsOfMonth(posts, index)

        let users = []

        posts.forEach((post) => {
            if (users.indexOf(post.from_id) == -1) {
                users.push(post.from_id)
            }
        })

        if (postsOfMonth.length > 0) {
            return {
                month: month,
                length: postsOfMonth.reduce((sum, post) => {
                    return sum + post.message.length
                }, 0) / postsOfMonth.length,
                longestPostId: postsOfMonth.sort((a, b) => {
                    return b.message.length - a.message.length
                })[0].id,
                postsPerUser: postsOfMonth.length / users.length   
            }
        }
    }).filter((row) => {
        return row != null
    })
}

/* Calculate total amount of posts per week */
function totalPostsByWeek(posts)
{
    let weeklyTotals = []

    //52 weeks in a year. Set week numbers to human readable format in map
    const weeks = Array(52).fill(0).map((week, i) => {
        return parseInt(i) + 1
    })

    for (let week of weeks) {
        weeklyTotals.push({
            week: week,
            totalPosts: getPostsOfWeek(posts, week).length
        })
    }

    return weeklyTotals.filter((row) => row != null && row.totalPosts > 0)
}

function getPostsOfMonth(posts, month)
{
    return posts.filter((post) => {
        return moment(post.created_time).month() == month
    })
}

function getPostsOfWeek(posts, week)
{
    return posts.filter((post) => {
        return moment(post.created_time).week() == week
    })
}
