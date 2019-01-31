let env = process.env.NODE_ENV || 'development';
console.log('env *************', env);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
} else {
    process.env.MONGODB_URI = 'mongodb://admin:123456a@ds113454.mlab.com:13454/todoapp';
};