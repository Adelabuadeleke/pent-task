const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// handle errors
const handleErrors = (err) => {
  // duplicate email
  if (err.code === 11000 && err.message.includes('E11000 duplicate key error collection: pent-api.users index: email_1 dup key:')) {
    return 'email adress is already register'
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    return 'user validation failed'
  }

  // return errors;
}



// signup user
module.exports.signup = async(req, res) => {
const { email, username, password} = req.body;
  try {
    // create user
    const user = await User.create({ email, username, password })
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).json({ user, token, message: "you signed-up sucessfully!" })
  } catch(err) {
    console.log(err)
    const errors = handleErrors(err)
    res.status(400).json({ error: errors })
  }

}

// login user
module.exports.login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password)
        const token = await user.generateAuthToken()
        res.json({ user, token, message: "you logged in sucessfully!" })
    } catch (err) {
        console.log(err)
        res.status(401).json({error:'An error occured during login, please ensure details are correct'});
    }
}

// edit user(email address)
module.exports.edit_user = async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'username'];
    const isValidOperation = updates.every((updates) => {
        return allowedUpdates.includes(updates)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        // console.log(updates)
        const user = await User.findOne({ _id: req.params.id });

        updates.forEach((update) => {
        user[update] = req.body[update]
        })
        // console.log(user[updates]);
        // console.log(req.body[updates])
        await user.save()
        return res.status(200).json({message: 'succesfully updated user details!✔'})
    } catch (err){
        console.log(err);
        return res.status(500).json({message: 'An error occurred'});
    }
}

// get user profile
module.exports.get_profile = async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById({_id});
        return res.status(200).json(user);
    } catch (err){
        console.log(err);
        return res.status(500).json({message: 'An error occurred'});
    }
}

// change password
module.exports.password_patch = async (req, res) => {

  const updates = Object.keys(req.body);
  const allowedUpdates = ['password'];
  const isValidOperation = updates.every((updates) => {
    return allowedUpdates.includes(updates)
  })

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' })
  }

  try {
    console.log(updates)
    const user = await User.findOne({ _id: req.params.id });

    updates.forEach((update) => user[update] = req.body[update])
    await user.save()
    res.json({message:'succesfully changed your  pin!✔'});

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: "Failed",
      message: err.message
    });
  }
} 

// logout current device
module.exports.logout_post = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      console.log(req.user)
      return token.token !== req.token
    })
    await req.user.save()
    return res.json({message:'Logged out sucesfully'})
  } catch (e) {
    res.status(400).json({err:'an err error occured'})
  }
}

// logout on all devices
module.exports.logoutall_post = async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
      return res.json({message:'Logged out from all devices sucesfully'})
  } catch (e) {
    res.status(500).json({message:'an error occured'})
  }
}
