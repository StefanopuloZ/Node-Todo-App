const ObjectID = require('mongoose');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.deleteMany({}).then((result) => {
//     console.log(result);
// });

Todo.findByIdAndDelete('5c4f0a695619bd31e8587f13').then((todo) => {
    console.log(todo);
});

Todo.deleteOne({_id: '5c4f0a695619bd31e8587f14'}).then((todo) => {
    console.log(todo);
});