const mongoose = require('mongoose');

const Schema = mongoose.Schema
const eventsSchema = new Schema({
    name : String,
    duration : String,
    instructor : String  
 }) 
 
 module.exports = mongoose.model('event', eventsSchema, 'events')