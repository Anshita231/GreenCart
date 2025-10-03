import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true; // send cookie in api requests
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user,setUser] = useState(false)
    const [isSeller,setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] =  useState(false)
    const [products, setProducts] =  useState([])
    const [cartItems, setCartItems] =  useState({})
    const [searchQuery, setSearchQuery] =  useState({})
    
    //fetch seller status
    const fetchseller = async()=>{
        try {
            //we will make the api call here
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true);
            }
            else{
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    }

    //fetch user status
    const fetchUser = async()=>{
        try {
            //we will make the api call here
            const {data} = await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems)
            } 
        } catch (error) {
            setUser(null)
        }
    }

    //fetch all products
    const fetchProducts = async ()=>{
        // setProducts(dummyProducts)
        try {
            const {data} = await axios.get('/api/product/list');
            if(data.success){
                setProducts(data.products)
            }
            else{
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message);
        }
    } 

    //add product to cart
    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId]+=1;
        }
        else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart")
    }

    //update card item quantity
    const updateCartItem = (itemId , quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity
        setCartItems(cartData)
        toast.success("Cart Updated")
    }

    //remove product from cart
    const removeFromCart = (itemId) =>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -=1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            } 
        }
        toast.success("Removed From Cart")
        setCartItems(cartData)
    }

    const getCartCount = ()=>{
        let totalcount = 0
        for(const item in cartItems){
            totalcount+=cartItems[item];
        }
        return totalcount;
    }

    const getCartAmount = ()=>{
        let totalamount = 0;
        for(const item in cartItems){
            let itemInfo = products.find((product)=>product._id === item);
            if(cartItems[item] > 0){
                totalamount+=itemInfo.offerPrice * cartItems[item]
            }
        }
        return Math.floor(totalamount*100)/100;
    }

    useEffect(()=>{
        fetchUser()
        fetchseller()
        fetchProducts()
    },[])

    //update database cart items
    useEffect(()=>{
        const updateCart = async ()=>{
            try {
                const {data} = await axios.post('/api/cart/update',{cartItems})
                if(!data.success){
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        if(user){
            updateCart()
        }
    },[cartItems])
    //exports all the functions written here
    const value = {navigate,user,setUser,setIsSeller,isSeller, showUserLogin,
        setShowUserLogin, products, currency, addToCart, updateCartItem, 
        removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, 
        getCartCount, axios, fetchProducts,setCartItems}
    return <AppContext.Provider value = {value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}