# SupermetricsAssignment
Coding assignment for Supermetrics

TO RUN THIS CODE:

- Install node.js. This assignment was done using node.js version 9.8.0
- Install npm packages by running the command 'npm install'
- Start the node server by running 'node index.js'
- Navigate to localhost:8080 using your browser

Note that it takes a few moments to fetch and render the results on screen

SOME OBSERVATIONS:
- If you're changing your name in config.json's registrationPayload,
  please keep in mind that the API validation fails if you use a space
  between your first and last name. A bug perhaps?
- The API is missing CORS headers and is the reason why the entire node.js
  part exists

THE ASSIGNMENT:

Supermetrics Assignment: Fetch and manipulate JSON data from Supermetrics REST API

 

This task may take up between 2-4 hours.

 

Please do not use any existing framework. You may use external standalone libraries if they are required.

 

    Register a short-lived token on the Supermetrics API

 

    Fetch the posts of a fictional user on a fictional social platform and process their posts. You will have 1000 posts over a six month period.

 

    Show stats on the following:

    Average character length / post in any given month
    Longest post by character length in any given month
    Total posts split by week
    Average number of posts per user in any given month

 

    Design the above to be generic, extendable and easy to maintain by other staff members.

 

    Return the assignment in any of the following ways:

    Use the custom link in the bottom of this emailOR
    Place on a github/bitbucket/gitlab repo that we can access, you can use a public repo
    Zip or Tar the files into an archive and send it along to us by email
    Place in a Dropbox that we can access.



Use the following endpoint to register a token:

 

POST: http://api.supermetrics.com/assignment/register

 

PARAMS:

    client_id : ju16a6m81mhid5ue1z3v2g0uh
    email : your@email.address
    name : Your Name

 

RETURNS

 

    sl_token : This token string should be used in the subsequent query. Please note that this token will only last 1 hour from when the REGISTER call happens. You will need to register and fetch a new token as you need it.
    client_id : returned for informational purposes only
    email : returned for informational purposes only

 

Use the following endpoint to fetch posts :

 

GET: http://api.supermetrics.com/assignment/posts

 

PARAMS:

    sl_token : Token from the register call
    page : integer page number of posts (1-10)

 

RETURNS

    page : What page was requested or retrieved
    posts : 100 posts per page
