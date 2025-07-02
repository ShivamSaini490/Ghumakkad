const mongoose = require('mongoose');

const connectDb = async() => {
  await mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log('Connected To Database');
  })
  .catch((err) =>{
    console.log('Connection Err : ', err);
  })
}

module.exports = connectDb;