const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');


dotenv.config({path : './config.env'})
const DB=process.env.DATABASE
console.log(DB,'es')
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{console.log('mushaobs')});