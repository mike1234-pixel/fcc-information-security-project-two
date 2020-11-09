## **FreeCodeCamp**- Information Security and Quality Assurance

[![Run on Repl.it](https://repl.it/@MichaelTandy/Anonymous-Message-Board)](https://repl.it/@MichaelTandy/Anonymous-Message-Board)

![screenshot](https://user-images.githubusercontent.com/57681651/98569152-d6977680-22a9-11eb-8346-7ae5ce55af45.JPG)

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
