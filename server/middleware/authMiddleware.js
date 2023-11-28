const jwt = require('jsonwebtoken');


module.exports.admin_middleware = async (req, res, next) => {
    const { pos_token } = req.cookies;

    // const posToken = req.headers['authorization'];

    if (!pos_token) {
        return res.status(409).json({ error: 'Please login first' })
    } else {
        try {
            const deCodeToken = await jwt.verify(pos_token, process.env.SECRET)
            req.adminId = deCodeToken.id;
            req.adminName = deCodeToken.name;
            req.role = deCodeToken.role;
            next();
        } catch (error) {
            return res.status(409).json({ error: 'Please login' })
        }
    }

}