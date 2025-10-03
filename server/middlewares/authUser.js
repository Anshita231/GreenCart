import jwt from 'jsonwebtoken';

const authUser = async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false, message:'Not Authorized'});
    }
    try {
        //decode token to extract the ID
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            // req.body.userId = tokenDecode.id
            req.userId = tokenDecode.id;
        }
        else{
            return res.json({success:false, message:'Not Authorized'});
        }
        next(); //it will execute the controller function
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

export default authUser;
