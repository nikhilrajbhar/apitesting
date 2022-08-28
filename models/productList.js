import mongoose from 'mongoose';
// const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
   
    productName: {
        type: String
    },
    category: {
        type: String
    },
    date: {
        type: Date
    },
    price: {
        type: Number
    },
    freshness: {
        type: String
    },
    comment:{
        type: String
    }

});

export default mongoose.models.productList || mongoose.model('productList', productSchema);