const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    name: { type: String },
    image: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    gender: { type: Number },
    dob: { type: String },
    role: { type: Number },
    status: { type: Number },
    address: { 
        province: { type: String },
        district: { type: String },
        ward: { type: String },
        description: { type: String }
    }
})

module.exports = mongoose.models.user || mongoose.model('user', userSchema);