// It should be used with auth middleware
const roleMiddleware = async (role, req, res, next) => {
    try {
        const user = req.user;
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