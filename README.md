## **FreeCodeCamp**- Information Security and Quality Assurance

[![Run on Repl.it](https://repl.it/@MichaelTandy/Anonymous-Message-Board)](https://repl.it/@MichaelTandy/Anonymous-Message-Board)

[![screenshot](https://user-images.githubusercontent.com/57681651/98569152-d6977680-22a9-11eb-8346-7ae5ce55af45.JPG)](https://repl.it/@MichaelTandy/Anonymous-Message-Board)

# Project Anonymous Message Board

## User Stories

- Users can add new boards, threads on boards and replies to threads.

- Users can set passwords to delete comments.

## Packages Used

This project is a reddit clone using _Node.js, express, mongoose_ and _mongodb_ on the backend, and _jQuery_ and _Material Design Bootstrap_ on the frontend.

The _shortid_ package is used to generate random ids for db entries.

For security purposes _helmet.js_ does the following:

- allows site to be only loaded in an iFrame on its own pages.

- No DNS prefetching.

- allows site to only send the referrer to its own pages.

The project contains functional tests using _Chai/Mocha_.

SET NODE_ENV to `test` without quotes when ready to write tests and DB to your databases connection string (in .env)

## Run In Repl.it

- Click the Run button at the top of the screen.
- Copy the url in the top right hand corner and paste into a new browser window. *For security purposes this app will not run in the Repl.it iframe*.
- Repl.it is now running the app on a live server, meaning that anyone can access this app with the url https://Anonymous-Message-Board.michaeltandy.repl.co and are able to access the Anonymous Message Board.
- The application will automatically timeout and stop running after 30 minutes-1 hour of inactivity, so don't worry if you close your browser and leave the app running as it will turn itself off.

