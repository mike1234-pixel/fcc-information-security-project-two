## **FreeCodeCamp**- Information Security and Quality Assurance

# Project Anonymous Message Board

[![message-board-screenshot](https://user-images.githubusercontent.com/57681651/98818150-0d44cc80-2423-11eb-86d9-df102473db35.JPG)](https://anonymous-message-board-app.herokuapp.com)

## User Stories

- Users can add new boards, threads to boards and replies to threads.

- Users can set passwords to delete comments.

- User can report comments.

## Packages Used

This project is a reddit clone using _Node.js, express, mongoose_ and _mongodb_ on the backend, and _jQuery_ and _Material Design Bootstrap_ on the frontend.

The _shortid_ package is used to generate random ids for db entries.

For security purposes _helmet.js_ does the following:

- allows site to be only loaded in an iFrame on its own pages.

- No DNS prefetching.

- allows site to only send the referrer to its own pages.

The project contains functional tests using _Chai/Mocha_.

[See the message board!](https://anonymous-message-board-app.herokuapp.com)

