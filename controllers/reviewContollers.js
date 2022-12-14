const Review = require('../models/Review');

// post a review
module.exports.post_review = async(req, res) => {
    const { address, environment, landlords,amenities, review_comment } = req.body;
    try{
        const review = await Review.create({ reviwer_username:req.user.username,owner:req.user._id,address, environment, landlords,amenities, review_comment});
        review.save();
        return res.status(201).json(review);
    } catch(err) {
        console.log(err)
        res.status(500).json({message:'an error ocurred'});
    }
}
// edit review
module.exports.edit_review = async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['environment', 'landlord', 'amenities', 'review_coment', 'address'];
    const isValidOperation = updates.every((updates) => {
        return allowedUpdates.includes(updates)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        // console.log(updates)
        const review = await Review.findOne({ _id: req.params.id });
        const review_owner = String(review.owner);
        const current_user = String(req.user._id);
        // console.log(`${review_owner} = ${current_user}`);
        if(review_owner === current_user) {
            updates.forEach((update) => {
            review[update] = req.body[update]
            })
            await review.save()
            return res.status(200).json({message: 'succesfully updated user details!✔'})
        } else  {
            return res.status(401).json({message:`you can't edit a review you didn't post`})

        }
       
    } catch (err){
        console.log(err);
        return res.status(500).json({message: 'An error occurred'});
    }
}

// get reviews
module.exports.get_review = async(req, res) => {
    try {
        const reviews = await Review.find({});
        if(!reviews) {
            return res.status(404).send('no reviews foun')
        } else {
            return res.status(200).json(reviews);
        }
    } catch(err){
        console.log(err);
        return res.status(500).json({message: 'An error occurred'});
    }
}

// get reviews
module.exports.get_review_most_helful = async(req, res) => {
    try {
        const reviews = await Review.find({}).sort('-helpful_count');
        if(!reviews) {
            return res.status(404).send('no reviews foun')
        } else {
            return res.status(200).json(reviews);
        }
    } catch(err){
        console.log(err);
        return res.status(500).json({message: 'An error occurred'});
    }
}

// delete review
module.exports.delete_review = async(req, res) => {
     try{
      const review = await Review.findOneAndDelete({ _id:req.params.id})
  
      if(!review) {
        return res.status(404).send('no revifound')
      }
  
      res.json({review, message: "Review deleted sucessfully!"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'An error occurred'});
    }
}

// is helepful
module.exports.find_helpful = async(req, res) => {
    const _id = req.params.id
    try {
        const review = await Review.findOneAndUpdate({_id}, {$inc:{helpful_count:1}});
        return res.status(200).json({message: 'we are glad you found this helpful' , review});
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: 'An error occurred'});
    }
}