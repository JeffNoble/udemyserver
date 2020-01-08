const jwt = require('jsonwebtoken');
const config = require('config')

module.exports = function(req, res, next) {
    // get token from header
    const token = req.header('x-auth-token');

    //check if token is present
    if(!token) {
        return res.status(401).json({ msg: 'No Token, No access'});
    }

    // verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));

        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({ msg: 'token is not valid'});
    }
};