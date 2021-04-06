const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: []
    ,
    comments: [ // comments is comming from the Comment model
      {
        type: Schema.Types.ObjectId, // the data is stored as an object
        ref: 'Comment' // defined here to map to comment model
      }
    ]
  },
  {
    toJSON: { // allow virtuals to be used
      virtuals: true,
      getters: true // coming from utils
    },
    id: false
  }
);

// virtual - get total count of comments and replies on retrieval
// PizzaSchema.virtual('commentCount').get(function() {
//   return this.comments.length;
// });

// virtual - get total count of comments and replies on retrieval
// includes all replies as well.
/*
Here we're using the .reduce() method
to tally up the total of every comment 
with its replies. In its basic form, 
.reduce() takes two parameters, an
accumulator and a currentValue. Here,
the accumulator is total, and the currentValue 
is comment. As .reduce() walks through the
array, it passes the accumulating total and th
e current value of comment into the function, with 
the return of the function revising the total for
the next iteration through the array.

Like .map(), the array prototype method
.reduce() executes a function on each element 
in an array. However, unlike .map(), it uses 
the result of each function execution for each 
successive computation as it goes through the array.
This makes it a perfect candidate for getting a sum
of multiple values.

*/

PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});


  // create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

