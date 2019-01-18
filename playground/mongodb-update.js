const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');
    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c40f2785bec35f017bb95c6')
    // }, {
    //         $set: {
    //             completed: false
    //         }
    //     }, {
    //         returnOriginal: false
    //     }).then((res) => {
    //         console.log(res);
    //     });

    db.collection('Users').findOneAndUpdate(
        { name: 'Marko' },
        { $set: { name: 'Ivana' } },
        { returnOriginal: false }
    ).then((res) => {
        console.log(res);
    });

    db.collection('Users').findOneAndUpdate(
        { name: 'Stefan' }, {
            $inc: { age: 1 }
        }, {
            returnOriginal: false
        }).then((res) => {
            console.log(res);
        })

    // client.close();
});