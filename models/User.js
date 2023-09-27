const { Schema, model } = require('mongoose');

// same as thought model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                // add valdator function for email
                validator: function (value) {
                    return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value);
                },
            },
        },
        // add thoughts schema to the user model
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        // add selfreference with friends array to add other users as friends
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// add another virtual to count friends in friends array
userSchema
   .virtual('friendCount')
   .get(function () {
    return this.friends.length;
   });

// create user instance as 'user' with userschema
const User = model('user', userSchema);

// export user model
module.exports = User;