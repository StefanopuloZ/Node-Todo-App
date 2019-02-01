let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect('mongodb://admin:123456a@ds113454.mlab.com:13454/todoapp',{ useNewUrlParser: true });

//mongodb://<dbuser>:<dbpassword>@ds113454.mlab.com:13454/todoapp
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