import Announcement from '../models/announcement.model.js';

export const createAnnouncement = async (req, res) => {
    const userId = req.user.id;
    try {
        const { title, body, tags = [], images = [] } = req.body;
        const author = await User.findById(userId);
        if (!author) {
            return res.status(404).json({ success: false, message: 'Author not found' });
        }

        const newAnnouncement = {
            author: userId,
            title,
            body,
            tags,
            images
        };

        const announcement = await Announcement.create(newAnnouncement);
        return res.status(201).json({ success: true, message: 'Announcement created successfully', announcement });
    } catch (error) {
        console.log('Error in createAnnouncement', error);
        res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const editAnnouncement = async (req, res) => {
    try {
        const { title, body, tags = [], images = [] } = req.body;
        const { id } = req.params.id;

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        if (title) announcement.title = title;
        if (body) announcement.body = body;
        if (tags) announcement.tags = tags;
        if (images) announcement.images = images;

        const updatedAnnouncement = await announcement.save();
        return res.status(200).json({ success: true, message: 'Announcement updated successfully', announcement: updatedAnnouncement });
    } catch (error) {
        console.log('Error in editAnnouncement', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params.id;

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        await announcement.remove();
        return res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
    } catch (error) {
        console.log('Error in deleteAnnouncement', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const likeAnnouncement = async (req, res) => {
    try {
        const { id } = req.params.id;
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' }); 
        }
        announcement.like_count += 1;
        const updatedAnnouncement = announcement.save();
        return res.status(200).json({ success: true, message: 'Announcement liked successfully', announcement: updatedAnnouncement });
    } catch (error) {
        console.log('Error in likeAnnouncement', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
        
    }
}

export const deleteLikeAnnouncement = async (req, res) => {
    try {
        const { id } = req.params.id;
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        announcement.like_count = Math.max(0, announcement.like_count - 1);
        const updatedAnnouncement = await announcement.save();

        return res.status(200).json({ success: true, message: 'Announcement unliked successfully', announcement: updatedAnnouncement });
    } catch (error) {
        console.log('Error in deleteLikeAnnouncement', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params.id;
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        return res.status(200).json({ success: true, message: 'Announcement fetched successfully', announcement });
    } catch (error) {
        console.log('Error in getAnnouncementById', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}

export const getAnnouncements = async (req, res) => {
    try {
        const { page, limit, sortBy, sortOrder, search } = req.query;
        const filters = {
            ... (tags && {tags: req.query.tags}),
            ... (author && {author: req.query.author}),
        }

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
                { tags: { $regex: search, $options: 'i' } },
            ]
        }

        const [announcements, announcementCount] = await Promise.all([
            Announcement.find(filters)
                .skip(skip)
                .limit(pageSize)
                .sort(sort)
                .lean(),
            Announcement.countDocuments(filters),
        ]);
        const totalPages = Math.ceil(announcementCount / pageSize);
        return res.status(200).json({
            success: true,
            announcements,
            pagination: {
                totalPages,
                currentPage: pageNumber,
                totalCount: announcementCount,
                itemsPerPage: pageSize,
            }
        });

    } catch (error) {
        console.log('Error in getAnnouncements', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}