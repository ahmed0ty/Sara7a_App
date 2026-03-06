import userRouter from './Modules/User/user.controller.js'
import messageRouter from './Modules/Messages/messages.controller.js'
import authRouter from './Modules/Auth/auth.controller.js'
import connectDB from './DB/connection.js'
import cors from "cors"
import morgan from "morgan"
import path from 'node:path'
import { attachRoutingWithLogger } from './Utils/logger.js'
import { corsOptions } from './Utils/cors.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'


const bootstrap = async (app,express)=>{
app.use(cors(corsOptions()))
  app.use(express.json())


const limiter = rateLimit({
  windowMs:60 * 1000 , 
  limit:3,
  message:{
    statusCode:429,
    message:"too many request from this IP , please try again"
  },
  legacyHeaders:false ,

})

app.use(limiter)
app.use(helmet())

attachRoutingWithLogger(app,"/api/auth",authRouter,"auth.log")
attachRoutingWithLogger(app,"/api/user",userRouter,"users.log")




  await connectDB()


app.get('/',(req,res)=>{
    return res.status(200).json({mesaage:"welcome to sara7a application"})
})

  app.use('/uploads',express.static(path.resolve("./src/uploads")))

  app.use('/api/user',userRouter)
  app.use('/api/messages',messageRouter)
  app.use('/api/auth',authRouter)



  app.all('/*dummy',(req,res,next)=>{
 
    return next(new Error("not found handler!!",{cause:404}))

    
  })


 
  app.use((err, req, res, next) => {
  const status = err.cause || 500;

  return res.status(status).json({
    message: "Something went wrong",
    error: err.message,
    stack: err.stack,
  });
});


}

export default bootstrap