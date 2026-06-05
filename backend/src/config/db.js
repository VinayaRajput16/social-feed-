import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default connectDb;