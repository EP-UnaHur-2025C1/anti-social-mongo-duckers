const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nickName: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [2, 'Nombre debe tener al menos 2 caracteres'],
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

module.exports = mongoose.model('User', userSchema)