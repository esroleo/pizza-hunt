const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
// To connect the reply to the comments we need a custome type.

// Here we'll need a unique identifier instead of the
// default _id field that is created, so we'll add a 
// custom replyId field. Despite the custom field name,
// we're still going to have it generate the same type
// of ObjectId() value that the _id field typically does,
// but we'll have to import that type of data first.

const ReplySchema = new Schema(

    {
     // set custom id to avoid confusion with parent comment _id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: 'Please enter the reply text!',
            trim: true
        },
        writtenBy: {
            type: String,
            required: 'Who wrote the reply?',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    { // alows to user getters (which is what we have date format)
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
  );

const CommentSchema = new Schema(
    {
    writtenBy: {
        type: String,
        required: 'Please enter the comment text!',
        trim: true
    },
    commentBody: {
        type: String,
        required: 'Who wrote the reply?',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    // associates comments to reply as a parent of replies
    // Note that unlike our relationship between
    // pizza and comment data, replies will be nested 
    //   directly in a comment's document and not referred to.
    replies: [ReplySchema] //child of comment
    },
    {
        toJSON: {
          virtuals: true,
          getters: true
        },
        id: false
      }
    );

// virtual - get total count of reply counts
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

// create the comment model using the CommentSchema
const Comment = model('Comment', CommentSchema);

module.exports = Comment;