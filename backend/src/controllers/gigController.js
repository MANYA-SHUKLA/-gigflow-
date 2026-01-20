const Gig = require('../models/Gig');

// @desc    Get all gigs (with search/filter)
// @route   GET /api/gigs
// @access  Public
exports.getGigs = async (req, res) => {
    try {
        const { search, status } = req.query;
        
        let query = {};
        
        // Only show open gigs by default
        if (!status) {
            query.status = 'open';
        } else {
            query.status = status;
        }
        
        // Search functionality - use regex for case-insensitive search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const gigs = await Gig.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gigs.length,
            data: gigs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
exports.getGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id)
            .populate('ownerId', 'name email');

        if (!gig) {
            return res.status(404).json({
                success: false,
                error: 'Gig not found'
            });
        }

        res.status(200).json({
            success: true,
            data: gig
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
exports.createGig = async (req, res) => {
    try {
        req.body.ownerId = req.user._id;
        
        const gig = await Gig.create(req.body);

        res.status(201).json({
            success: true,
            data: gig
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private
exports.updateGig = async (req, res) => {
    try {
        let gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                error: 'Gig not found'
            });
        }

        // Make sure user is gig owner
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized'
            });
        }

        gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: gig
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private
exports.deleteGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                error: 'Gig not found'
            });
        }

        // Make sure user is gig owner
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized'
            });
        }

        await gig.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get user's own gigs
// @route   GET /api/gigs/user/my-gigs
// @access  Private
exports.getMyGigs = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = { ownerId: req.user._id };
        
        // Filter by status if provided
        if (status && (status === 'open' || status === 'assigned')) {
            query.status = status;
        }

        const gigs = await Gig.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gigs.length,
            data: gigs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};