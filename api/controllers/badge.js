const Badge = require('../models/badge');

async function getAll(_req, res) {
    try {
        const badges = await Badge.find().sort({'criteria.count': 1});
        res.status(200).json({
            success: true,
            count: badges.length,
            badge: badges
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
        res.status(500).json({
            error: error.message
        });
    }
}

async function create(req, res) {
    try {
        const { name, description, 'criteria.type': type, 'criteria.count': count } = req.body;
        const iconFile = req.file;

        if (!name || !description || !type || !count) {
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
            icon: iconFile?.filename || '',
            criteria: {
                type,
                count: Number(count)
            }
        });
        const savedBadge = await badge.save();

        res.status(201).json({
            success: true,
            message: 'Badge created successfully',
            badge: savedBadge
        });
    } catch (error) {
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
        const { name, description, 'criteria.type': type, 'criteria.count': count } = req.body;
        const iconFile = req.file;

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
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;
        if (iconFile !== undefined) updatedFields.icon = iconFile.filename;
        if (type || count !== undefined) {
            updatedFields.criteria = {
                type: type || existingBadge.criteria.type,
                count: count !== undefined ? Number(count) : existingBadge.criteria.count
            };
        }
        const updatedBadge = await Badge.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            message: 'Badge updated successfully',
            badge: updatedBadge
        });
    } catch (error) {
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
            badge: badge
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
            badge: badges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching badges by criteria',
            error: error.message
        });
    }
}
const BadgesController = {
    getAll: getAll,
    getById: getById,
    create: create,
    updateBadge: updateBadge,
    deleteBadge: deleteBadge,
    getByCriteria: getByCriteria
};

module.exports = BadgesController;