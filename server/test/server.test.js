const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');

const todos = [
  { text: "First test todo" },
  { text: "Second test todo" },
  { text: "Third test todo" }
];

const users = [
  { email: "firsttest@email.com" },
  { email: "firsttest@email.com" },
  { email: "firsttest@email.com" }
]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos).then(() => {
      User.remove({}).then(() => {
        User.insertMany(users).then(() => done());
      });
    });
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

describe('POST /users', () => {
  let email = 'test@email.com';

  it('should create a new user', (done) => {
    request(app)
      .post('/users')
      .send({ email })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find().then((users) => {
          expect(users.length).toBe(4);
          expect(users[3].email).toBe(email);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not create a new user', (done) => {
    request(app)
      .post('/users')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find().then((users) => {
          expect(users.length).toBe(3);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /users', () => {
  it('should get all users', (done) => {
    request(app)
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body.users.length).toBe(3);
      })
      .end(done);
  });
});


