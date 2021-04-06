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

// vitual - get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});



  // create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

