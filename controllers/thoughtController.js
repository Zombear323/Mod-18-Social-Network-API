const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            // find all thoughts
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get single thought
    async getSingleThought(req, res) {
        try {
            // get thought with thoughtId
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            // if id invalid, display error message
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create new thought
    async createThought(req, res) {
        try {
            // create thought with thoughtText, username and userId 
            const thought = await Thought.create(req.body);
            // update user with new thought 
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                // add thought to set of thoughts to the user
                { $addToSet: { thoughts: thought._id }},
                // new thought true
                { new: true }
            );

            // error if user doesn't exist, will still create the thought tho
            if (!user) {
                return res.status(404).json({ message: 'Thought created, but no user with ID'});
            }

            res.json('Created the thought! 🎉');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // update thought
    async updateThought(req, res) {
        try {
            // find thought and update
            const thought = await Thought.findOneAndUpdate(
                // id of thought
                { _id: req.params.thoughtId },
                // set new body for thought and update
                { $set: req.body },
                // use validators to update thought to fit the requirements to update thought
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete thought
    async deleteThought(req, res) {
        try {
            // find and remove the thought
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            // update user to remove thought from thought array
            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                // pull thought from thought array
                { $pull: { thoughts: req.params.thoughtId }},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Thought created but no user with this ID' });
            }

            res.json({ message: 'Thought successfully deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // add reaction
    async addReaction(req, res) {
        try {
            // update thought to add reaction
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                // add reaction to reactions object in thought object
                { $addToSet: { reactions: req.body }},
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete reaction to thought
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                // pull reaction from reactions array based on id
                { $pull: { reactions: { reactionId: req.params.reactionId }}},
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

