// import schema and model from mongoose instead of Types, since we're creating a model
const { Schema, model } = require('mongoose');
// import reactionschema
const Reaction = require('./Reaction');
// import date-fns library to format timestamps
const { format } = require('date-fns');

// same as reaction schema 
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        // create array of reactions 
        reactions: [Reaction],
    },
    {
        toJSON: {
            // virtuals are converted with JSON
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// add virtual to count reactions
thoughtSchema
   .virtual('reactionCount')
   .get(function () {
    // return number of reactions
    return this.reactions.length;
   });


// add getter function to format the timestamps
   thoughtSchema.path('createdAt').get(function (timestamp) {
    return format(timestamp, "do MMMM, yyyy 'at' h:mmaa");
});

// create thought instance as thought model and using the thoughtschema
const Thought = model('thought', thoughtSchema);

// export thought model
module.exports = Thought;