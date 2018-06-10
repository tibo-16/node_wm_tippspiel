var env = process.env.NODE_ENV || 'development';
console.log('env', env);

if (env === 'development' || env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/WMTest";
} else {
    var config = require('./config.json');
    process.env.MONGODB_URI = config["MONGODB_URI"];
}
