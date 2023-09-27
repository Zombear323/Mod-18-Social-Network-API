const { User, Thought } = require('../models');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            // find users
            const users = await User.find()
            // exclude '__v'
            .select('-__v');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get single user
    async getSingleUser(req, res) {
        try {
            // find user based on id
            const user = await User.findOne({ _id: req.params.userId })
            // populate user object with thoughts object
              .populate('thoughts');

              if(!user) {
                return res.status(404).json({ message: 'No user with that ID' });
              }

              res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create new user
    async createUser(req, res) {
        try {
            // username and email address as req.body to create new user
            const dbUserData = await User.create(req.body);
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // update user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                // set updated values for user
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if(!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete user
    async deleteUser(req, res) {
        try {
            // find userId and delete user 
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            // delete associated thoughts with user
            await Thought.deleteMany({ _id: { $in: user.thoughts }});
            // display message that user and associated thoughts get deleted
            res.json({ message: 'User and associated thoughts deleted!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // add friend to the user
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                // add friends to friends array with userId since friends are also users
                { $addToSet: { friends: req.body.userId }},
                { runValidators: true, new: true }
            );
            
            if(!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // remove friend
    async removeFriend(req, res) {
        try {
            // find user with friendId and remove it
            const friend = await User.findOneAndRemove({ _id: req.params.friendId });

            if (!friend) {
                return res.status(404).json({ message: 'No friend with that id!'})
            }

            const user = await User.findOneAndUpdate(
                // remove freind from friend array
                { friends: req.params.friendId },
                { $pull: { friends: req.params.friendId }},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID '});
            }

            res.json({ message: 'Friend successfully removed!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};