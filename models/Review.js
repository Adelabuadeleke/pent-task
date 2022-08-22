const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    address:{
        type:String,
        required:[true, 'please provide the address you want to review']
    },
    reviwer_username:{
        type:String,
        required:true,
    },
    environment:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    landlords:{
        type:Number,
        required: true,
        min:1,
        max:5
    },
    amenities:{
        type:Number,
        required: true,
        min:1,
        max:5
    },
    review_comment:{
        type:String,
        required:[true, 'please provide a brief comment']
    },
    helpful_count:{
        type:Number,
        default: 0
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
    }

})

const Review = mongoose.model('review', reviewSchema);
module.exports = Review;