import Prayer from "../models/prayer.model.js";

export const createPrayer = async (req, res) => {
    const userId = req.user.id;
    try {
        const { title, is_anonymous, body, tags = [], images = [] } = req.body;
        const author = await User.findById(userId);
        if (!author) {
            return res.status(404).json({ success: false, message: 'Author not found' });
        }

        const newPrayer = {
            user_id: userId,
            is_anonymous,
            title,
            body,
            tags,
            images
        };

        const prayer = await Prayer.create(newPrayer);
        return res.status(201).json({ success: true, message: 'Prayer created successfully', prayer });
    } catch (error) {
        console.log('Error in createPrayer', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const editPrayer = async (req, res) => {
    try {
        const { title, is_anonymous, body, tags = [], is_open } = req.body;
        const { id } = req.params;

        const prayer = await Prayer.findById(id);
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer not found' });
        }

        if (title) prayer.title = title;
        if (body) prayer.body = body;
        if (tags) prayer.tags = tags;
        if (is_open) prayer.is_open = is_open;
        if (is_anonymous) prayer.is_anonymous = is_anonymous;

        const updatedPrayer = await prayer.save();
        return res.status(200).json({ success: true, message: 'Prayer updated successfully', prayer: updatedPrayer });
    } catch (error) {
        console.log('Error in editPrayer', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const deletePrayer = async (req, res) => {
    try {
        const { id } = req.params;
        const prayer = await Prayer.findById(id);   
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer not found' });
        }

        if (prayer.user_id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this prayer' });
        }

        await prayer.remove();
        return res.status(200).json({ success: true, message: 'Prayer deleted successfully' });
    } catch (error) {
        console.log('Error in deletePrayer', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const getPrayerById = async (req, res) => {
    try {
        const { id } = req.params.id;

        const prayer = await Prayer.findById(id);
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer not found' });
        }

        return res.status(200).json({ success: true, message: 'Prayer retrieved successfully', prayer });
    } catch (error) {
        console.log('Error in getPrayerById', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const getPrayers = async (req, res) => {
    try {
        const { page, limit, sortBy, sortOrder, search } = req.query;
        const filters = {
            ... (req.query.title && {title: req.query.title}),
            ... (req.query.is_anonymous && {is_anonymous: req.query.is_anonymous}),
            ... (req.query.body && {body: req.query.body}),
            ... (req.query.tags && {tags: req.query.tags}),
        };

        // Pagination
        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100); // Limit to 1 - 100
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        const sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1; 
        }

        // Search
        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: 'i' } },
                { body: { $regex: search, $options: 'i' } },
            ];
        }

        const [prayers, prayerCount] = await Promise.all([
            Prayer.find(filters)
                .skip(skip)
                .limit(pageSize)
                .sort(sort)
                .lean(),
            Prayer.countDocuments(filters),
        ]);

        const totalPages = Math.ceil(prayerCount / pageSize);
        
        return res.status(200).json({
            success: true,
            prayers,
            pagination: {
                totalPages,
                currentPage: pageNumber,
                pageSize,
            }
        });
    } catch (error) {
        console.log('Error in getPrayers', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const likePrayer = async (req, res) => {
    try {
        const { id } = req.params;
        const prayer = await Prayer.findById(id);
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer not found' });
        }
        
        prayer.prayer_count += 1;
        const updatedPrayer = await prayer.save();

        return res.status(200).json({ success: true, message: 'Prayer liked successfully', prayer: updatedPrayer });
    } catch (error) {
        console.log('Error in likePrayer', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const deleteLikePrayer = async (req, res) => {
    try {
        const { id } = req.params;

        const prayer = await Prayer.findById(id);
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer not found' });
        }

        prayer.prayer_count = Math.max(0, prayer.prayer_count - 1);
        const updatedPrayer = await prayer.save();

        return res.status(200).json({ success: true, message: 'Prayer unliked successfully', prayer: updatedPrayer });
    } catch (error) {
        console.log('Error in deleteLikePrayer', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}