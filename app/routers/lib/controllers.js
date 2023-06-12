const { Transaction } = require('../../models');

const controllers = {};

async function getMembers() {
    const query = [
        {
            $unwind: '$membersAddedAt'
        },
        {
            $group: {
                _id: '$_id',
                totalMembersCount: {$sum: {$cond: [{ $and: [ { $lte: [new Date(), '$membersAddedAt.expiryDate'] }] }, 1, 0]} },
                totalMonthlyMembersCount: {$sum: {$cond: [{ $and: [ { $lte: [new Date(), '$membersAddedAt.expiryDate'] }, { $eq: ['$membershipType', 'Monthly'] }] }, 1, 0]}},
                totalAnnualMembershipCount: {$sum:  {$cond: [{ $and: [ { $lte: [new Date(), '$membersAddedAt.expiryDate'] }, { $eq: ['$membershipType', 'Yearly'] }] }, 1, 0]} },
                    
            }
        },
        {
            $group: {
                _id: '',
                totalMembersCount: { $sum: '$totalMembersCount'},
                totalMonthlyMembersCount: {$sum: '$totalMonthlyMembersCount' },
                totalAnnualMembersCount: { $sum: '$totalAnnualMembersCount'}
              }
        }
    ];
    return Transaction.aggregate(query);
}
async function getMemberShip() {
    const query = [
        {
            $unwind: '$memberShip'
        },
        {
            $group: {
                _id: '$_id',
                totalMembershipCount: {$sum: {$cond: [{ $and: [ { $lte: [new Date(), '$memberShip.expiryDate'] }] }, '$memberShip.remainMembership', 0]} },
                totalMonthlyMembershipCount: {$sum: {$cond: [{ $and: [ { $lte: [new Date(), '$memberShip.expiryDate'] }, { $eq: ['$membershipType', 'Monthly'] }] }, '$memberShip.remainMembership', 0]}},
                totalAnnualMembershipCount: {$sum:  {$cond: [{ $and: [ { $lte: [new Date(), '$memberShip.expiryDate'] }, { $eq: ['$membershipType', 'Yearly'] }] }, '$memberShip.remainMembership', 0]} },
                    
            }
        },
        {
            $group: {
                _id: '',
                totalMemberstotalMembershipCountCount: { $sum: '$totalMembershipCount'},
                totalMonthlyMembershipCount: {$sum: '$totalMonthlyMembershipCount' },
                totalAnnualMembershipCount: { $sum: '$totalAnnualMembershipCount'}
              }
        }
    ];
    return Transaction.aggregate(query);
}

controllers.dashboard = async (req, res) => {
  
    const oResponse = {};
    // const response = await Transaction.aggregate(query).exec(); 
    const [ aMemberShip, aMember] = await Promise.all([
        //
        getMemberShip(),
        getMembers(),

    ]);
    console.log(aMember);
    for (const oData of aMember) {
        oResponse.totalMembersCount = oData.totalMembersCount;
        oResponse.totalMonthlyMembersCount = oData.totalMonthlyMembersCount;
        oResponse.totalAnnualMembersCount = oData.totalAnnualMembersCount;
    }

    for (const oData of aMemberShip) {
        oResponse.totalMembershipCount = oData.totalMembershipCount;
        oResponse.totalMonthlyMembershipCount = oData.totalMonthlyMembershipCount;
        oResponse.totalAnnualMembershipCount = oData.totalAnnualMembershipCount;
    }
    return res.json(oResponse);
};


module.exports = controllers;
