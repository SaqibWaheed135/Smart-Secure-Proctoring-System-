const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    instructorId: {
        type: String,
        required: true,
    },
    classroomName: {
        type: String,
        required: true,
    },
    classroomCode: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Classroom = mongoose.model('Classroom', classroomSchema);
module.exports = Classroom;
