const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const mongoose = require('mongoose');

// @desc    Get bids for a gig (owner only)
// @route   GET /api/bids/:gigId
// @access  Private
exports.getBidsByGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId);

        if (!gig) {
            return res.status(404).json({
                success: false,
                error: 'Gig not found'
            });
        }

        // Check if user is the gig owner
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to view these bids'
            });
        }

        const bids = await Bid.find({ gigId: req.params.gigId })
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bids.length,
            data: bids
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create a bid
// @route   POST /api/bids
// @access  Private
exports.createBid = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { gigId, message, price } = req.body;

        // Check if gig exists and is open
        const gig = await Gig.findById(gigId).session(session);
        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                error: 'Gig not found'
            });
        }

        if (gig.status !== 'open') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                error: 'This gig is no longer accepting bids'
            });
        }

        // Check if user is not the gig owner
        if (gig.ownerId.toString() === req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                error: 'You cannot bid on your own gig'
            });
        }

        // Check if user has already bid on this gig
        const existingBid = await Bid.findOne({
            gigId,
            freelancerId: req.user._id
        }).session(session);

        if (existingBid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                error: 'You have already bid on this gig'
            });
        }

        // Create bid
        const bid = await Bid.create([{
            gigId,
            freelancerId: req.user._id,
            message,
            price
        }], { session });

        await session.commitTransaction();
        session.endSession();

        // Populate bid with freelancer and gig info for notification
        const populatedBid = await Bid.findById(bid[0]._id)
            .populate('freelancerId', 'name email')
            .populate({
                path: 'gigId',
                select: 'title ownerId',
                populate: {
                    path: 'ownerId',
                    select: '_id'
                }
            });

        // Send real-time notification to gig owner via Socket.io
        const io = req.app.get('io');
        if (io && populatedBid && populatedBid.gigId) {
            const ownerId = populatedBid.gigId.ownerId?._id || populatedBid.gigId.ownerId;
            if (ownerId) {
                io.to(`user-${ownerId}`).emit('notification', {
                    type: 'new_bid',
                    message: `New bid received on "${populatedBid.gigId.title}" from ${populatedBid.freelancerId.name}`,
                    gigId: populatedBid.gigId._id.toString(),
                    bidId: populatedBid._id.toString(),
                    freelancerName: populatedBid.freelancerId.name,
                    bidAmount: populatedBid.price,
                    timestamp: new Date(),
                });
                console.log(`✅ Sent 'new_bid' notification to gig owner ${ownerId} for gig "${populatedBid.gigId.title}"`);
            }
        }

        res.status(201).json({
            success: true,
            data: populatedBid || bid[0]
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Hire freelancer (with transactional integrity and atomic operations)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private
exports.hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bidId = req.params.bidId;

    // First, verify the bid exists and get gig info (without transaction lock yet)
    const bid = await Bid.findById(bidId)
      .populate('gigId')
      .populate('freelancerId');

    if (!bid) {
      return res.status(404).json({
        success: false,
        error: 'Bid not found'
      });
    }

    // Check if user is the gig owner
    if (bid.gigId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to hire for this gig'
      });
    }

    // ATOMIC OPERATION: Try to update gig status from 'open' to 'assigned' atomically
    // This prevents race conditions - only one transaction can succeed
    const gigUpdateResult = await Gig.findOneAndUpdate(
      {
        _id: bid.gigId._id,
        status: 'open' // Only update if still open (atomic check)
      },
      {
        $set: { status: 'assigned' }
      },
      {
        session,
        new: true,
        runValidators: true
      }
    );

    // If gigUpdateResult is null, it means the gig was already assigned (race condition detected)
    if (!gigUpdateResult) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        error: 'This gig has already been assigned to another freelancer. Please refresh the page.'
      });
    }

    // ATOMIC OPERATION: Update bid status to 'hired' only if still pending
    const bidUpdateResult = await Bid.findOneAndUpdate(
      {
        _id: bidId,
        status: 'pending' // Only update if still pending (atomic check)
      },
      {
        $set: { status: 'hired' }
      },
      {
        session,
        new: true,
        runValidators: true
      }
    );

    // If bidUpdateResult is null, bid was already processed (race condition)
    if (!bidUpdateResult) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        error: 'This bid has already been processed. Please refresh the page.'
      });
    }

    // Reject all other pending bids for this gig atomically
    const rejectResult = await Bid.updateMany(
      {
        gigId: bid.gigId._id,
        _id: { $ne: bidId },
        status: 'pending' // Only reject pending bids
      },
      {
        $set: { status: 'rejected' }
      },
      { session }
    );

    console.log(`✅ Hiring Logic Executed:
      - Gig ${bid.gigId._id}: status changed from "open" to "assigned"
      - Bid ${bidId}: status changed from "pending" to "hired"
      - ${rejectResult.modifiedCount} other bids automatically rejected`);

    // Commit transaction - all operations succeed or all fail
    await session.commitTransaction();
    session.endSession();

    // Reload bid and gig with populated fields for response and notifications
    const updatedBid = await Bid.findById(bidId)
      .populate('gigId')
      .populate('freelancerId');
    
    const updatedGig = await Gig.findById(bid.gigId._id);

    // Send real-time notification to hired freelancer via Socket.io
    const io = req.app.get('io');
    if (io && updatedBid && updatedBid.freelancerId) {
      io.to(`user-${updatedBid.freelancerId._id}`).emit('notification', {
        type: 'hired',
        message: `You have been hired for "${updatedGig.title}"!`,
        gigId: updatedGig._id.toString(),
        bidId: updatedBid._id.toString(),
        timestamp: new Date(),
      });
      console.log(`✅ Sent 'hired' notification to user ${updatedBid.freelancerId._id} for gig "${updatedGig.title}"`);
    }

    // Send notifications to rejected freelancers
    if (io) {
      const rejectedBids = await Bid.find({
        gigId: updatedGig._id,
        _id: { $ne: bidId },
        status: 'rejected'
      }).populate('freelancerId');

      rejectedBids.forEach(rejectedBid => {
        if (rejectedBid.freelancerId) {
          io.to(`user-${rejectedBid.freelancerId._id}`).emit('notification', {
            type: 'rejected',
            message: `Your bid for "${updatedGig.title}" was not selected.`,
            gigId: updatedGig._id.toString(),
            timestamp: new Date(),
          });
          console.log(`✅ Sent 'rejected' notification to user ${rejectedBid.freelancerId._id} for gig "${updatedGig.title}"`);
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bid: updatedBid,
        gig: updatedGig
      },
      message: 'Freelancer hired successfully'
    });

  } catch (error) {
    // Always abort transaction on error
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error in hireFreelancer:', error);
    
    // Handle race conditions and transaction conflicts
    if (error.code === 11000 || error.message.includes('duplicate')) {
      return res.status(409).json({
        success: false,
        error: 'This gig has already been assigned to another freelancer. Please refresh the page.'
      });
    }

    // Handle WriteConflict errors (MongoDB transaction conflicts)
    if (error.code === 112 || error.message.includes('WriteConflict')) {
      return res.status(409).json({
        success: false,
        error: 'Another hiring operation is in progress. Please try again in a moment.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while hiring the freelancer'
    });
  }
};

// @desc    Get user's bids
// @route   GET /api/bids/user/my-bids
// @access  Private
exports.getUserBids = async (req, res) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user._id })
            .populate({
                path: 'gigId',
                populate: {
                    path: 'ownerId',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bids.length,
            data: bids
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};