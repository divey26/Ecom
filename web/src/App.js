import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './com/Auth/login'
import AllCustomers from './com/Auth/AllCustomers'

import CategoryPage from './com/Category/Category';
import ProductPage from './com/Products';
import StartPage from './com/StartPage'
import Shorts from './com/Shorts/Shorts'
import Timer from './com/Timer/Timer'
import HomeLayoutPage from './com/HomePage/HomeLayout'
import Orders from './com/Orders/ViewOrders'

//simport List from '../src/com/ProductList'


import SellerProfile from "./com/seller/seller";
import Sellersign from "./com/seller/sellerSignup";
import SellerProductPage from './com/seller/SellerProductList';
import SellProductPage from './com/seller/SellerProducts';



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dash" element={<StartPage/>} />
        <Route path="/category" element={<CategoryPage/>} />
        <Route path="/shorts" element={<Shorts/>} />
        <Route path="/timer" element={<Timer/>} />
        <Route path="/add-product" element={<ProductPage/>} />
        <Route path="/add" element={<HomeLayoutPage/>} />
        <Route path="/order" element={<Orders/>} />

        <Route path="/allcus" element={<AllCustomers/>} />

{/*        <Route path="/list" element={<List/>} />   */}

        <Route path="/seller" element={<SellerProfile/>} />
        <Route path="/selpro" element={<SellerProductPage/>} />
        <Route path="/sign" element={<Sellersign />} />
        <Route path="/addsellpro" element={<SellProductPage/>} />

      

        </Routes>
      </Router>
    </div>
  );
}

export default App;
