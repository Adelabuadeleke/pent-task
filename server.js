const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet')
const server = require('http').Server(app);

const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const port = process.env.PORT || 4000;

// express config, middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// minor security
app.use(helmet());

// cors configs
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  next();
});

// Route
app.use(userRoutes);
app.use(reviewRoutes);

// Database and Server connections!
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true, 
  useUnifiedTopology:true, 
})
.then(response =>{
  server.listen(port, ()=>{
    console.log('server is running:listening on port 🚀 ' + port);
  })
  console.log('All connections sucessful!🚀')
}).catch((err)=>{
  console.log('Database connection failed: unable to establish connections 😢')
  console.log(err)
})

module.exports = server
