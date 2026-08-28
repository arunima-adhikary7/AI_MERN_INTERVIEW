

const isAuth=async(req,res,next)=>{
    try
    {
      let {token}=req.headers;
      if(!token)
      {
        return res.status(401).json({message:"User does not have token"});
      }
      const verifyToken=jwt.verify(token,process.env.JWT_SECRET);
      if(!verifyToken)
      {
        return res.status(401).json({message:"User is not authorized"});
      }
      req.userId=verifyToken.userId;
      next();

    }
    catch(err)
    {
      return res.status(500).json({message:"Is auth error "+err.message});
    }

}


export default isAuth;