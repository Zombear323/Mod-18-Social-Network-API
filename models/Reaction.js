// use mongoose for schema and Types
const { Schema, Types } = require('mongoose');
// import date-fns library to format timestamps
const { format } = require('date-fns');

// create reaction schema
const reactionSchema = new Schema(
    {
        // reaction id with new objectId
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        // reactiontext
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        // which user created reaction
        username: {
            type: String,
            required: true,
        },
        // date of creation of reaction
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        // getters to JSON
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

// format timestamp in "do MMMM, yyyy 'at' h:mmaa" format
reactionSchema.path('createdAt').get(function (timestamp) {
    return format(timestamp, "do MMMM, yyyy 'at' h:mmaa");
});

module.exports = reactionSchema;