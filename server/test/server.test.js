const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');

const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo",
    completed: true,
    completedAt: 123
  },
  {
    _id: new ObjectID(),
    text: "Second test todo"
  },
  {
    _id: new ObjectID(),
    text: "Third test todo"
  }
];

const users = [
  {
    _id: new ObjectID(),
    email: "first-test@email.com",
    password: '12345678'
  },
  {
    _id: new ObjectID(),
    email: "second-test@email.com",
    password: '12345678'
  },
  {
    _id: new ObjectID(),
    email: "third-test@email.com",
    password: '12345678'
  }
];

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos).then(() => done());
  });
});

describe('POST /todos', () => {
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

describe('GET /todos/:id', () => {
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


