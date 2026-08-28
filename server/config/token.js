import jwt from 'jsonwebtoken'
const token=async(userId)=>{
    try
    {
    const token=jwt.sign({userId},process.env.JWTSECRET,{expiresIn:'7d'})
    return token
    }
    catch(err)
    {
        console.log(err);
    }
}
export default token;
