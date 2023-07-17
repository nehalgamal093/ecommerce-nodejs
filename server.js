import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config()
import  {dbConnection}  from './database/dbConnection.js';
import categoryRouter from './src/modules/category/category.router.js';

const app = express();
const port = 3000;

app.use(express.json())
app.use('/api/v1/categories',categoryRouter)
app.all('*',(req,res)=> res.json({message:`can't find this route: ${req.originalUrl}`}))
app.get('/',(req,res)=>{
    res.send('Hello world')
})

dbConnection();
app.listen(port,()=>{
    console.log('Connected successfully')
})