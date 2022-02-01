const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.header('X-Auth-Token');

    if(!token || token === 'null'){
        return res.status(401).send({message:'Please login to play'});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if( err ){
            return res.status(400).send({ 'message' : err.message});
        }

        req.userPayload = payload;

        next();
    });

}