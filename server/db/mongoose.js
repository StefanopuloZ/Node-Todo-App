let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true });

module.exports = {
    mongoose
};









































// let newTodo = Todo({
//     text: 'Cook dinner'
// });

// newTodo.save().then((res) => {
//     console.log('Saved todo', res);
// }, (err) => {
//     console.log('Unable to save todo');
// });

// let otherTodo = Todo({
//     text: '  Edit this video   '
// });

// otherTodo.save().then((res) => {
//     console.log('Saved todo', res);
// }, (err) => {
//     console.log('Unable to save', err);
// });

// let newUser = User({
//     email: '   example@gmail.com'
// });

// newUser.save().then((res) => {
//     console.log('Saved user', res);
// }, (err) => {
//     console.log('Unable to save user', err);
// });