const mongoose = require('mongoose');

const Schema = mongoose.Schema
const specialSchema = new Schema({
    name : String,
    duration : String,
    instructor : String    
})

module.exports = mongoose.model('special', specialSchema, 'special-events')