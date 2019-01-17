// const {MongoClient} = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// let obj = new ObjectID();
// console.log(obj);


// let user = {name: 'Stefan', age: 25};
// let {name, age} = user;
// console.log(name, age);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }
        console.log('Connected to mongodb server');
        const db = client.db('TodoApp');

        // db.collection('Todos').insertOne({
        //     text: 'Something to do',
        //     completed: false
        // }, (err, result) => {
        //     if (err) {
        //         return console.log('Unable to insert todo', err);
        //     };
        //     console.log(JSON.stringify(result.ops, undefined, 2));
        // });

        // db.collection('Users').insertOne({
        //     name: 'Ivan',
        //     age: 32,
        //     location: 'Belgrade'
        // }, (err, result) => {
        //     if (err) {
        //         return console.log('Unable to insert users', err);
        //     };
        //     console.log(JSON.stringify(result.ops, undefined, 2));
        //     console.log(result.ops[0]._id.getTimestamp());
        // });

        client.close();
});