const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    budget: {
        type: Number,
        required: [true, 'Please add a budget'],
        min: [1, 'Budget must be at least 1']
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'assigned'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search functionality
gigSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Gig', gigSchema);