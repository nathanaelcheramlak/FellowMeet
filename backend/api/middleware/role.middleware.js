// It should be used with auth middleware
const roleMiddleware = (role) => async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized!' });
        }

        if (user.role !== role && user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        next();
    } catch (error) {
        console.log('error in admin auth middleware: ', error);
        return res.status(500).json({ success: false, message: 'Internal server error!', error });
    }
};

export default roleMiddleware;