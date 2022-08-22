const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:[true, 'email provided has been used for another account'],
        trim:true
    },
        username: {
        type:String,
        required:true,
        unique:[true, 'please provide a unique username'],
        minlength:[8, 'minimum username length is 8'],
        maxlength:[15, 'maximum username length is 15']
    },
    password:{
        type:String,
        required:true,
        minlength:[6, 'minimum password length is 6'],
    },
    tokens:[{
        token:{
        type:String,
        required:true
        }
    }],
},{
  timestamps:true
})

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()
  delete userObject.password

  return userObject
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id:user._id.toString() }, 'Pent api secret key')

  user.tokens = user.tokens.concat({ token })
  await user.save()  

  return token
}

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({email});

  if(user){
    const auth = await bcrpyt.compare(password, user.password)
    if(auth){

      return user
    }
    throw Error('Incorrect password');
  } else {
    throw Error('Incorrect email provided');
  }
}

// hash password before saving
userSchema.pre('save', async function(next){
  const user = this

  if(user.isModified('password')){
    const salt = await bcrpyt.genSalt();
    user.password = await bcrpyt.hash(user.password, salt);
    next()
  }
   next()
})

const User = mongoose.model('user', userSchema)
module.exports = User;