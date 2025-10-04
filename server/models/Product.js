import mongoose from "mongoose";


//structure of our product data
const productSchema = new mongoose.Schema({
    name:{type:String, required:true, unique:true},
    description:{type:Array, required:true},
    price:{type:Number, required:true},
    offerPrice:{type:Number, required:true}, 
    image:{type:[String], required:true}, 
    inStock:{type:Boolean, required:true, default:true},
    category:{type:String,required:true}
},{timestamps: true})

const Product = mongoose.models.product ||mongoose.model('product',productSchema);

export default Product;
