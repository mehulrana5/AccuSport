const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const fetchUser=(req,res,next)=>{
    const token=req.header('auth-token') 
    if(!token){ 
        res.status(401).send({error:"not authenticated token"})
    }
    try {
        const data =jwt.verify(token,jwtSecret);
        req.user_id=data.id
        req.token=token;
        next(); 
    } catch (error) {
        res.status(401).send({error:"not authenticated token"})
    }
}

module.exports = fetchUser;
