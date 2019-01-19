const ObjectID = require('mongoose');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

let id = '5c4316d7ebcbb310189403e4';

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by Id', todo);
// }).catch((err) => {
//     console.log(err);
// });

User.findById(id).then((user) => {
    // if (true) {
    //     return console.log('ID not valid');
    // }
    if (!user) {
        return console.log('User not found');
    };
    console.log('User', user);
}, (err) => {
    console.log(err);
});

