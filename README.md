## **FreeCodeCamp**- Information Security and Quality Assurance

[![Run on Repl.it](https://repl.it/@MichaelTandy/Anonymous-Message-Board)](https://repl.it/@MichaelTandy/Anonymous-Message-Board)

Project Anonymous Message Board

## User Stories

Users can add new boards, threads on boards and replies to threads.

Users can set passwords to delete comments.

## Packages Used

This project is a reddit clone using Node.js, express, mongoose and mongodb on the backend, and jQuery and Material Design Bootstrap on the frontend.

The shortid package is used to generate random ids for db entries.

For more information security purposes helmet.js does the following:

- allows site to be only loaded in an iFrame on its own pages.

- No DNS prefetching.

- allows site to only send the referrer its your own pages.

The project contains functional tests using Chai/Mocha.

SET NODE_ENV to `test` without quotes when ready to write tests and DB to your databases connection string (in .env)
