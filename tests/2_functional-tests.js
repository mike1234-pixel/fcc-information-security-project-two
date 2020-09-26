var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Test Suite 1', function() {

  // generate random string
  function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
  }

  suite('API ROUTING FOR /api/threads/:board', function() {
  
  var randomBoard = makeid(5);
  var threadId;
  var deletePassword;

    suite('POST', function() {
      test('Post request to /api/threads/:board creates new board where one does not exist, creates a new thread on that board, and redirects the user to board.html', function(done) {
        chai.request(server)
          .post('/api/threads/:board').type('form').send({board: randomBoard, text: makeid(20), delete_password: makeid(5)})
          .end(function(err, res){
            assert.equal(res.status, 200);
            expect(res).to.redirect;
            
          // make a get request here to retrieve the entry and ensure it was created
          chai.request(server)
          .get(`/api/threads/${randomBoard}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array of objects')
            done();
          })
          })     
      }) 
    });

    // retrive thread id and delete password values here for use in the delete test.
    suite('GET', function() {
      test('get request to /api/threads/:board returns array of threads', function(done) {
          chai.request(server)
          .get(`/api/threads/${randomBoard}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array of objects')
            console.log(`RES.BODY ${JSON.stringify(res.body[0]._id)}`)
            // retrieving values for next test
            threadId = res.body[0]._id; 
            deletePassword = res.body[0].delete_password;
            done();
          })
      })
    });
    
    // new thread was created in the first test so there will always be a thread to delete at this point in the tests, response text will always be 'success'
    suite('DELETE', function() {
      test('delete request to /api/threads/:board the thread matching the specified thread id is deleted', function(done) {
        chai.request(server)
          .delete(`/api/threads/:board`).type('form').send({
            board: randomBoard,
            thread_id: threadId,
            delete_password: deletePassword,
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
            done();
          })
      })
    });
    
    suite('PUT', function() {
      // create new thread, retrive values, then make the put request, then make a get request to check the 'reported' value is true
      test(`put request to /api/threads/:board changes the value of that thread's 'reported' property to true`, function(done) {
        var randomBoard = makeid(5);
        var text = makeid(5);
        var deletePassword = makeid(5)
        var threadId;

        chai.request(server)
          .post('/api/threads/:board').type('form').send({
            board: randomBoard,
            text: text,
            delete_password: deletePassword
          }).end(function(err, res) {
            assert.equal(res.status, 200);
            chai.request(server)
              .get(`/api/threads/${randomBoard}`)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                threadId = res.body[0]._id; 

                chai.request(server)
                .put('/api/threads/:board').type('form').send({
                board: randomBoard,
                thread_id: threadId,
              }).end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.text, 'success');

                chai.request(server)
                  .get(`/api/threads/${randomBoard}`)
                  .end(function (err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body[0].reported, true);
                    done();
                  })                
              })  
            })
          })
        })
      });
    

  });
  

});