const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

describe('POST /todos', () => {
  beforeEach(populateTodos);

  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[todos.length - 1].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not create a new todo', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  beforeEach(populateTodos);

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        //console.log(res.body.todos);
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  beforeEach(populateTodos);

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo is not found', (done) => {
    let testId = new ObjectID();
    request(app)
      .get(`/todos/${testId.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid IDs', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  beforeEach(populateTodos);

  it('should delete one todo', (done) => {
    let testId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${testId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(todos[0].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        };

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          Todo.findById(testId).then((todo) => {
            expect(todo).toBeFalsy();
            done();
          }).catch((err) => done(err));
        }).catch((err) => done(err));
      });
  });

  it('should return 404 and text: "Not a valid ID" if id is not valid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .expect((res) => {
        expect(res.text).toBe('Not a valid ID');
      })
      .end(done);
  });

  it('should return 404 if id is not found', (done) => {
    let testId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${testId}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  beforeEach(populateTodos);

  it('should update the todo', (done) => {
    let testId = todos[0]._id.toHexString();

    request(app)
      .patch(`/todos/${testId}`)
      .send({
        completed: true,
        text: 'test text'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe('test text');
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is completed', (done) => {
    let testId = todos[0]._id.toHexString();

    request(app)
      .patch(`/todos/${testId}`)
      .send({
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });

  it('should return 404 if id is invalid', (done) => {
    request(app)
      .patch(`/todos/123`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is not found', (done) => {
    let testId = new ObjectID().toHexString();

    request(app)
      .patch(`/todos/${testId}`)
      .expect(404)
      .end(done);
  });

});

describe('GET users/me', () => {
  beforeEach(populateUsers);

  it('should return user if authenticated', (done) => {

    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenitacated', (done) => {

    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST users/', () => {
  beforeEach(populateUsers);
  let email = 'newuser@example.com';

  it('should create a user', (done) => {
    request(app)
      .post('/users')
      .send({
        email,
        password: '123testpass!'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
        expect(res.header['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        };

        User.findOne({ email }).then((user) => {
          expect(user.email).toBe(email);
          expect(user.password.length).toBeGreaterThan(30);
          expect(user.tokens[0]).toHaveProperty('access');
          done();
        }).catch(err => done(err));
      });
  });



  it('should return validation error if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'example',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '123abcpass!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  beforeEach(populateUsers);

  it('should login user and return auth token', (done) => {
    let email = users[0].email;

    request(app)
      .post('/users/login')
      .send({
        email,
        password: users[0].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        };

        User.findOne({ email }).then((user) => {
          expect(user.tokens[1].token).toBe(res.header['x-auth']);
          expect(user.tokens[1].access).toBe('auth');
          done();
        }).catch((err) => done(err));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'invalid password!'
      })
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        };

        User.findOne({ email: users[1].email }).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('DELETE /users/me/token', () => {
  beforeEach(populateUsers);

  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        done(err);
      };

      User.findOne({email: users[0].email}).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((err) => done(err));
    });
  });
});


















// describe('POST /users', () => {
//   let email = 'test@email.com';

//   it('should create a new user', (done) => {
//     request(app)
//       .post('/users')
//       .send({ email })
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         User.find().then((users) => {
//           expect(users.length).toBe(4);
//           expect(users[3].email).toBe(email);
//           done();
//         }).catch((err) => done(err));
//       });
//   });

//   it('should not create a new user', (done) => {
//     request(app)
//       .post('/users')
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         User.find().then((users) => {
//           expect(users.length).toBe(3);
//           done();
//         }).catch((err) => done(err));
//       });
//   });
// });

// describe('GET /users', () => {
//   it('should get all users', (done) => {
//     request(app)
//       .get('/users')
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.users.length).toBe(3);
//       })
//       .end(done);
//   });
// });


