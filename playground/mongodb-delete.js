const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }
        console.log('Connected to mongodb server');
        const db = client.db('TodoApp');

        // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((res) => {
        //     console.log(res.result);
        // });

        // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((res) => {
        //     console.log(res);
        // });

        db.collection('Users').findOneAndDelete({_id: new ObjectID("5c40d94c978de533580c9cc3")}).then((res) => {
            console.log(res);
        });

        db.collection('Users').deleteMany({name: "Ivan"}).then((res) => {
            console.log(res.result);
        });

        client.close();
});