const Badge = require('../models/badge');

async function getAll(_req, res) {
    try {
        const badges = await Badge.find().sort({'criteria.count': 1});
        res.status(200).json({
            success: true,
            count: badges.length,
            data: badges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving badges',
            error: error.message
        });
    }
}

async function getById(req, res) {
    try {
        const badge = await Badge.findById(req.params.id);

        if (!badge) {
            return res.status(404).json({
                error: 'Badge not found'
            });
        }

        res.status(200).json({
            badge,
            message: 'Badge successfully found'
        });
    } catch (error) {
        console.error('Error retrieving badge:', error);
        res.status(500).json({
            error: error.message
        });
    }
}

async function create(req, res) {
    try {
        const { name, description, icon, criteria } = req.body;

        if (!name || !description || !criteria || !criteria.type || !criteria.count) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields!'
            });
        }
        
        const existingBadge = await Badge.findOne({ name });
        if (existingBadge) {
            return res.status(400).json({
                success: false,
                message: 'Badge with this name already exists'
            });
        }
        const badge = new Badge({
            name,
            description,
            icon,
            criteria: {
                type: criteria.type,
                count: criteria.count
            }
        });
        const savedBadge = await badge.save();

        res.status(201).json({
            success: true,
            message: 'Badge created successfully',
            data: savedBadge
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating badge',
            error: error.message
        });
    }
}

async function updateBadge(req, res) {
    try {
        const { id } = req.params;
        const { name, description, icon, criteria } = req.body;

        const existingBadge = await Badge.findById(id);
        if (!existingBadge) {
            return res.status(404).json({
                success: false,
                message: 'Badge not found'
            });
        }
        if (name && name !== existingBadge.name) {
            const nameConflict = await Badge.findOne({ name, _id: { $ne: id } });
            if (nameConflict) {
                return res.status(400).json({
                    success: false,
                    message: 'Badge with this name already exists'
                });
            }
        }
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (icon !== undefined) updateData.icon = icon; // Allow setting to empty
        if (criteria) {
            updateData.criteria = {
                type: criteria.type || existingBadge.criteria.type,
                count: criteria.count !== undefined ? criteria.count : existingBadge.criteria.count
            };
        }
        const updateBadge = await Badge.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            message: 'Badge updated successfully',
            data: updatedBadge
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating badge',
            error: error.message
        });
    }
}
async function deleteBadge(req, res) {
    try {
        const { id } = req.params;

        const badge = await Badge.findById(id);
        if (!badge) {
            return res.status(404).json({
                success: false,
                message: 'Badge not found'
            });
        }
        await Badge.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Badge deleted successfully',
            data: badge
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting badge',
            error: error.message
        });
    }
}

async function getByCriteria(req, res) {
    try {
        const { type } = req.params;

        const validTypes = ['visits', 'bookmarks', 'signup'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: `Invalid criteria type. Must be one of: ${validTypes.join(', ')}`
            });
        }
        const badges = await Badge.find({ 'criteria.type': type }).sort({ 'criteria.count': 1 });

        res.status(200).json({
            success: true,
            count: badges.length,
            data: badges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching badges by criteria',
            error: error.message
        });
    }
}

// // Check if user qualifies for badges (helper function)
// async function checkUserBadgeEligibility(req, res) {
//     try {
//         const { userStats } = req.body; // Expecting { visits: number, bookmarks: number, signup: boolean }
        
//         if (!userStats) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'User stats required'
//             });
//         }

//         const allBadges = await Badge.find();
//         const eligibleBadges = [];

//         for (const badge of allBadges) {
//             let qualifies = false;

//             switch (badge.criteria.type) {
//                 case 'visits':
//                     qualifies = userStats.visits >= badge.criteria.count;
//                     break;
//                 case 'bookmarks':
//                     qualifies = userStats.bookmarks >= badge.criteria.count;
//                     break;
//                 case 'signup':
//                     qualifies = userStats.signup === true && badge.criteria.count <= 1;
//                     break;
//             }

//             if (qualifies) {
//                 eligibleBadges.push(badge);
//             }
//         }

//         res.status(200).json({
//             success: true,
//             message: `User qualifies for ${eligibleBadges.length} badge(s)`,
//             data: eligibleBadges
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error checking badge eligibility',
//             error: error.message
//         });
//     }
// }

const BadgesController = {
    getAll: getAll,
    getById: getById,
    create: create,
    updateBadge: updateBadge,
    deleteBadge: deleteBadge,
    getByCriteria: getByCriteria
    // checkUserBadgeEligibility: checkUserBadgeEligibility
};

module.exports = BadgesController;