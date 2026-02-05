import jwt from 'jsonwebtoken';

const userAuth = async(req, res, next)=>{
    
    try {
        let beareHeader= req.headers['authorization'];
        console.log(beareHeader);
        
        if(typeof beareHeader!= 'undefined'){
              const token = beareHeader.split(" ")[1];
             const user = jwt.verify(token, process.env.JWT_SECRET);
            console.log(token);
            req.token = user;
            next();
            

        }else{
             res.status(401).json({message: "Token Not Set"})
        }

    }
    catch (error) {
        res.status(403).json({message: 'Invalid or Expired Token'})

    }
}

export default userAuth;