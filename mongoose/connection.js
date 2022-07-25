import mongoose from 'mongoose';
import { dbConnectionString } from "../components/global.js"

//creating a database
mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connection Successful");
}).catch((error) => {
    console.log(error);
})