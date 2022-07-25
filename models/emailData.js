import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    secretToken: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    host: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.models.emailDatas || mongoose.model('emailDatas', userSchema);