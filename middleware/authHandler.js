const jwt = require('jsonwebtoken');

const authHandler = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            error: 'No authentication provided, Access denied'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // pass to the next request
    } catch (error) {
        next(error);
    }
}

module.exports = authHandler;