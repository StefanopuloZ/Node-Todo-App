const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

let hashedPassword = '$2a$10$S.OkyT4HPhxnvQHp1nLpcOIsry4goCakJt7fvNpj98XpPmT8tx4O.';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// let data = {
//     id: 10
// }

// let token = jwt.sign(data, '123abc');

// let decoded = jwt.verify(token, '123abc');

// console.log(decoded);
// jwt.verify

// let message = 'I am user number 3';

// let hash = SHA256(message).toString();

// // console.log('Message: ', message);
// // console.log('Hash:', hash);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some secret for salt').toString()
// };

// // data.id = 5;
// // token.hash = SHA256(JSON.stringify(data)).toString();

// let resultHash = SHA256(JSON.stringify(data) + 'some secret for salt').toString();

// if (token.hash === resultHash) {
//     console.log('Data was not changed.');
// } else {
//     console.log('Data was changed. Do not trust!');
// };
