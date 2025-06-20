
const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    const token=req.headers.token
    if(!token){
        return res.json({msg:"Access Denied"}).status(400)
    }
    jwt.verify(token,'qwert',(err,decode)=>{
        if(err){
            res.json("Invalid token")
        }else{
            return next()
        }
    })
}

module.exports=verifyToken


































// const jwt = require('jsonwebtoken');



// app.post('/login', (req, res) => {
   

//     if (/* Authentication successful */) {
      
//         const token = jwt.sign(
//             { 
//                 userId: user._id, 
//                 role: user.role,   
//                 name: user.name, 
                
//             },
//             process.env.JWT_SECRET || 'qwert', 
//             { expiresIn: '1h' } 
//         );

//         res.json({ token, role: user.role, msg:"login successfully" });
//     } else {
//         res.status(401).json({ msg: "Invalid credentials" }); 
//     }
// });



// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1]; 

//     if (!token) {
//         return res.status(401).json({ msg: "Access Denied: No token provided" }); }

//     jwt.verify(token, process.env.JWT_SECRET || 'qwert', (err, decoded) => { 
//         if (err) {
//             return res.status(403).json({ msg: "Access Denied: Invalid token" }); 
//         }

//         req.user = decoded; 
//         next(); 
//     });
// };


// app.get('/api/protected', verifyToken, (req, res) => {
//     res.json({msg:"this is protected route",user:req.user})
// })

// module.exports = verifyToken;