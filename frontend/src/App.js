import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './utils/AuthContext';
import { CartProvider } from './common/cart/CartContext'; // Import CartContext
import { DeadlineProvider } from "./common/DeadlineContext/DeadlineContext";


import SingleProduct from './common/Products/SingleProduct'
import About from "./common/About";
import HomePage from './common/Home/HomePage';
import Login from "./common/Auth/Login";
import Sign from "./common/Auth/Sign";
import Banner from "./common/Home/banner";
import All from "./common/Products/AllProList";
import FilterPro from "./common/Products/AllProducts";
import CartView from "./common/cart/CartView";
import Summa from "./common/Home/summa";
import Checkout from "./common/Payment/Checkout";
import Feed from "./common/Feedback/feedback";
import Profile from "./common/Auth/Profile";


import Try from "./common/Try-on/Tryon";


function App() {
  return (
    <AuthProvider>
    <DeadlineProvider>
      <CartProvider>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/sign" element={<Sign />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<ProtectedRoute Component={About} />} />
              <Route path="/ban" element={<Banner />} />
              <Route path="/all-pro/:categoryId" element={<FilterPro />} />
              <Route path="/cart" element={<CartView />} />
              <Route path="/summa" element={<Summa />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/all" element={<All />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/product/:productId" element={<SingleProduct />} />
            
              <Route path="/try" element={<Try />} />


              <Route path="*" element={<NotFound />} />

            </Routes>
          </Router>
        </div>
      </CartProvider>
    </DeadlineProvider>
  </AuthProvider>
  );
}

// Default Route Component
const DefaultRoute = () => {
  const { authenticated } = useContext(AuthContext);
  return authenticated ? <Navigate to="/home" /> : <Navigate to="/" />;
};

// ProtectedRoute component to check authentication before rendering the component
const ProtectedRoute = ({ Component }) => {
  const { authenticated } = useContext(AuthContext);

  return authenticated ? <Component /> : <Navigate to="/" />;
};


// NotFound Component for 404 error handling
const NotFound = () => <div style={{ textAlign: 'center', marginTop: '20px' }}>404 - Page Not Found</div>;


export default App;
