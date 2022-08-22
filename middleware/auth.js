const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const bcrypt = require('bcrpyt');


// Authentication
const auth = async (req, res, next) => {
  try{
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    // if(token == null) return res.status(401)
    // console.log(authHeader)
    const token = await req.header('Authorization').replace('Bearer ', '') 
    // console.log(token)
    const decoded = await jwt.verify(token, 'Pent api secret key')
    const user = await User.findOne({_id:decoded._id, 'tokens.token':token })
    if(!user){
      throw new Error()
    }
    req.token = token
    req.user = user
  
    next()
  } catch(err) {
    res.status(401).send({error:'Please authenticate.'})
    console.log('Authentication error', err) 
  }
  
}

module.exports = { auth };