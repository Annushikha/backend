const mongoose = require('mongoose');

const Transaction = new mongoose.Schema(
    {
        packageId: mongoose.Schema.Types.ObjectId,
        userId: mongoose.Schema.Types.ObjectId,
        membersAddedAt: { type: Array },
        memberShip:{ type: Array },
        membershipType: {type: String}
    }
);
module.exports = mongoose.model('transaction', Transaction);
