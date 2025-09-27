import dotenv from "dotenv"

dotenv.config({
    path: './.env'
});


import connectDB from "./config/db" 
import app from "./app";







const PORT = process.env.PORT || 8000;



connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed", err)
})