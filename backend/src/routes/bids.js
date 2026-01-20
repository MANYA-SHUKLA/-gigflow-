const express = require('express');
const {
    getBidsByGig,
    createBid,
    hireFreelancer,
    getUserBids
} = require('../controllers/bidController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/user/my-bids', protect, getUserBids);
router.get('/:gigId', protect, getBidsByGig);
router.post('/', protect, createBid);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;