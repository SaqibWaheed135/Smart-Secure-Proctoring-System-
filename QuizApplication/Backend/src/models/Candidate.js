
const mongoose = require('mongoose');


const candidateSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    surName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    systemId:{
        type: String,
        required: true
    },
    rollNumber:{
        type: String,
        required: true
    },

    
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;