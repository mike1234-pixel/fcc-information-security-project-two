'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const shortid = require('shortid');
const MONGODB_CONNECTION_STRING = process.env.MONGOURI;


mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then((con) => {
    console.log("DB connection successful.");
  }).catch((err) => console.log(err));
mongoose.set('debug', true);

module.exports = function (app) {

// select: false options stops a field showign up in results

  const repliesSchema = new mongoose.Schema({
      _id: String,
      text: String,
      delete_password: {
        type: String,
      },
      created_on: Date,
      reported: {
        type: Boolean,
      },
  })

  const threadsSchema = new mongoose.Schema({
    _id: String,
    text: String,
    delete_password: {
      type: String,
    },
    created_on: Date,
    bumped_on: Date,
    reported: {
      type: Boolean,
    },
    replies: [repliesSchema],
  })

  const Thread = mongoose.model(`threads`, threadsSchema)

  const boardSchema = new mongoose.Schema({
    boardName: {
      type: String,
      required: true
    },
    threads: [threadsSchema],
  });

  const Board = mongoose.model(`boards`, boardSchema);

  // ROUTE: /api/threads/:board
  
  // POST: CREATE THREAD
  app.route('/api/threads/:board')
    .post(function(req, res) {

      var board = req.body.board;
      var text = req.body.text;
      var deletePassword = req.body.delete_password;

      const newThread = {
          _id: shortid.generate(),
          text: text,
          delete_password: deletePassword,
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false,
          replies: [],
        }

      Board.findOneAndUpdate({ boardName: board }, {upsert: true}, function(err, response){
        if (err) {
          console.log(err);
        } else if (response === null) {
          // create new board and add thread
          const newBoard = new Board({
            boardName: board,
            threads: []
          }) 
          newBoard.save((err, savedBoard) => {
            if (err) {
              console.log(err)
            } else {
              console.log("board created and thread added")
              Board.findOneAndUpdate({boardName:savedBoard.boardName}, {$push: {threads: newThread}}, (err, result) => {
                  console.log(result);
                  res.redirect(`/b/${savedBoard.boardName}/`)
              })
            }
          })
         } else if (res !== null) {
           // find existing board and add thread
           console.log("board exists")
           Board.findOneAndUpdate({ boardName: board}, {$push: {threads: newThread}}, (err, result) => {
             if (err) {
               console.log(err)
             } else {
             console.log("thread added to existing board")
             res.redirect(`/b/${board}/`)
             }
           })
         }   
      })
    })

  // GET: LIST RECENT THREADS
  app.route('/api/threads/:board')
    .get(function(req, res) {

      var board = req.params.board;

      Board.findOne({boardName: board}, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log(result);
          if (result === null) {
            res.send('page not found')
          } else {
          var threads  = result.threads;
          // sort threads by bumped_on date
          var sortedThreads = threads.sort((a, b) => new Date(a.bumped_on) - new Date(b.bumped_on));
          // slice the top 10
          var slicedThreads = sortedThreads.slice(0, 9);
          // for each thread.replies slice 3
          slicedThreads.forEach((thread) => {
            thread.replies = thread.replies.slice(0, 3);
          })
          // send the resulting threads array back
          res.json(slicedThreads);
        }
        }
      })
    })

// DELETE: DELETE A THREAD
  app.route('/api/threads/:board')
    .delete(function(req, res) {
      var board = req.body.board;
      var threadId = req.body.thread_id;
      var deletePassword = req.body.delete_password;

      Board.findOne({ boardName: board }, (err, board)=> {
        if (err) {
          console.log(err)
        } else { // mongoose id() method can find subdocs by id
          const thread = board.threads.id(threadId);
          if (thread === null) {
            res.send('thread does not exist');
          } else {
          if (thread.delete_password === deletePassword) {
            // delete thread// removing subdocument
            board.threads.pull(threadId);
            board.save();
            res.send('success')
          } else {
            res.send('incorrect password');
          }
        }
        }
      })
    })

    // PUT: REPORT A THREAD
  app.route('/api/threads/:board')
    .put(function(req, res) {
      var board = req.body.board;
      var threadId = req.body.thread_id;

      Board.findOne({boardName: board}, (err, board) => {
        if (err) {
          console.log(err)
        } else {
          const thread = board.threads.id(threadId);
          if (thread === null) {
            res.send('thread does not exist');
          } else {
            // change thread's reported value to true
            thread.reported = true;
            board.save();
            res.send('success');
          }
        }
      })
    })

  // ROUTE: /api/replies/:board
    
  // POST: CREATE REPLY ON THREAD  
  app.route('/api/replies/:board')
    .post(function(req, res) {
      var board = req.body.board;
      var text = req.body.text;
      var deletePassword = req.body.delete_password;
      var threadId = req.body.thread_id;
      var commentDate = new Date();

      var reply = {
        _id: shortid.generate(),
        text: text,
        delete_password: deletePassword,
        created_on: commentDate,
        reported: false,
      }

      // find by board by board naeme given, then use mongoose id method to search through threads for thread with matching id, then push the reply object into the array and save the whole document. 
      // update the bumped_on date to the comment date as well.
      Board.findOne({ boardName: board }, (err, board) => {
        if (err) {
          console.log(err)
        }  else {
          const thread = board.threads.id(threadId);
          thread.bumped_on = commentDate;
          thread.replies.push(reply);
          return board.save(); 
        } 
      })
      res.redirect(`/b/${board}/${threadId}`);  
    })

  // GET: THREAD AND REPLIES BY THREAD ID
  app.route('/api/replies/:board')
    .get(function(req, res) {

      var threadQuery = req.query.thread_id;
      var board = req.params.board;
      console.log(threadQuery, board)

      Board.findOne({ boardName: board }, (err, board) => {
        if (err) {
          console.log(err)
        } else {
          
          if (board === null) {
            res.send("board does not exist")
          } else {
            const thread = board.threads.id(threadQuery);
            res.json(thread); 
          }     
        } 
      })
    })

      // DELETE: DELETE REPLY ON THREAD  
  app.route('/api/replies/:board')
    .delete(function(req, res) {
      var board = req.body.board;
      var threadId = req.body.thread_id;
      var replyId = req.body.reply_id;
      var deletePassword = req.body.delete_password;

      console.log(board, threadId, replyId, deletePassword)
      console.log(req.body)

    Board.findOne({boardName: board}, (err, board)=> {
      if (err) {
        console.log(err)
      } else {
        const thread = board.threads.id(threadId);
        const reply = thread.replies.id(replyId);
        console.log(reply);
        if (reply === null) {
          res.send('reply does not exist') 
        } else {
        if (reply.delete_password === deletePassword) {
          thread.replies.pull(replyId);
          board.save();
          res.send('success');
        } else {
          res.send('incorrect password')
        }
      }
      }
    })
    }) 

    // PUT: REPORT A REPLY
  app.route('/api/replies/:board')
    .put(function(req, res) {
      var board = req.body.board;
      var threadId = req.body.thread_id;
      var replyId = req.body.reply_id;

      Board.findOne({boardName: board}, (err, board)=> {
      if (err) {
        console.log(err)
      } else {
        const thread = board.threads.id(threadId);
        const reply = thread.replies.id(replyId);
        console.log(reply);
        if (reply === null) {
          res.send('reply does not exist') 
        } else {
          reply.reported = true;
          board.save();
          res.send('success');
        }
      }
    })
  })  
};


// ways to improve the backend...
// take into account all possibilities for error, sending the user an error message if a resource is not... go through all inputs on the frontend and test them. program needs to continue running regardless of user interaction.
// write functional tests for /api/replies/:board requests
// put the models in their own folder