import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        displayName: {
            type: String,
            required: true,
            trim: true
        },
        avartarUrl: {
            type: String, //link CND image
        },
        avartarId: {
            type: String, //cloudinary public id to delete image
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'uploader'],
            default: 'user'
        },
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);