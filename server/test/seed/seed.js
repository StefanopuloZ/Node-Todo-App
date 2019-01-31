const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

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


// const populateTodos = (done) => {
//     Todo.deleteMany({}).then(() => {
//         Todo.insertMany(todos).then(() => done());
//     });
// };

const populateTodos = () => {
    return Todo.deleteMany({})
        .then(() => {
            Todo.insertMany(todos);
        });
};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'userone@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'usertwo@example.com',
    password: 'userOnePass'
}];

const populateUsers = () => {
    return User.deleteMany({})
        .then(() => {
            let userOne = new User(users[0]).save();
            let userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        });
};

module.exports = { todos, populateTodos, users, populateUsers };

