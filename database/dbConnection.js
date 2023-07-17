import mongoose from "mongoose";

export function dbConnection(){
    mongoose.connect(process.env.DB_CONNECTION).then(()=>{
        console.log('Mongo connected successfully');

    }).catch((err)=>{
        console.log(`Error is ${err}`)
    })
}