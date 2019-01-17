const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }
        console.log('Connected to mongodb server');
        const db = client.db('TodoApp');

        // db.collection('Todos').find({
        //     _id: new ObjectID("5c40dcf95475c4295030b4dd")
        // }).toArray().then((docs) => {
        //     console.log('Todos');
        //     console.log(JSON.stringify(docs, undefined, 2));
        // }, (err) => {
        //     console.log('Unable to fetch Todos', err);
        // });

        // db.collection('Todos').find().count().then((count) => {
        //     console.log(`Todos: ${count}`);
        // }, (err) => {
        //     console.log('Unable to fetch Todos count', err);
        // });

        db.collection('Users').find({name: 'Ivan'}).toArray().then((docs) => {
            console.log('Found users for query: ');
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('Not able to query users', err);
        });

        // client.close();
});