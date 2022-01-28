const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {

    if(!req.header('X-Auth-Token')){
        return res.status(401).send({message:'401 Unauthorized'});
    }

    const token = req.header('X-Auth-Token');

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if( err ){
            return res.status(400).send({message:'Token in wrong format'});
        }

        req.userPayload = payload;

        next();
    });

}