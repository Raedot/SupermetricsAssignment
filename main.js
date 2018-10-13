fetch('http://localhost:8080/getPostData', {
    credentials: 'same-origin'
}).then((response) => {
    if (response.ok) {
        return response.json()
    }

    return Promise.resolve(null)
}).then((result) => {
    if (result == null) {
        alert('Unable to fetch data. Please try again')
        return
    }

    setMonthlyTableContents(result.monthlyData)
    setWeeklyTableContents(result.postsByWeek)
})

function setMonthlyTableContents(rows)
{
    const monthlyDataTableBody = document.querySelector('#per-month-data tbody')

    let template = `
        ${rows.map(row => 
            `<tr>
                <td>${row.month}</td>
                <td>${row.length}</td>
                <td>${row.longestPostId}</td>
                <td>${row.postsPerUser}</td>
            </tr>`
        ).join('')}
    `

    monthlyDataTableBody.innerHTML = template
}

function setWeeklyTableContents(rows)
{
    const weeklyDataTableBody = document.querySelector('#weekly-data tbody')

    let template = `
        ${rows.map((row) => {
            return `<tr>
                <td>${row.week}</td>
                <td>${row.totalPosts}</td>
            <tr>`
        }).join('')}
    `

    weeklyDataTableBody.innerHTML = template
}
