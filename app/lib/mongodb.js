import mongoose from 'mongoose'

const connectmongodb = async (message) =>
{
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connected to database"+" "+message);
    } catch (error) {
        console.log(error);
    }
}

export default connectmongodb