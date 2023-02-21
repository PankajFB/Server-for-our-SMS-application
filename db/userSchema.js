const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title:{
        type:String, 
        required:true
    },
    blog:{
        type:String, 
        required:true
    }
})

const Blog =new mongoose.model('Blog', userSchema);

module.exports = Blog;