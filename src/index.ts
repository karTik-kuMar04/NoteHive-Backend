import dotenv from "dotenv"
import connectDB from "./config/db" 
import app from "./app";

const PORT = process.env.PORT || 8000;


dotenv.config();

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at port: ${PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed", err)
})