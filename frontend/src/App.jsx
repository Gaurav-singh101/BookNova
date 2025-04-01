import React from 'react';
import Home from './pages/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router , Routes , Route } from "react-router-dom" ;
import AllBooks from './pages/AllBooks';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';



const App = () => {
  return (
    <div>
      <Router>
       <Navbar/>
       <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route  path="/All-books" element={<AllBooks/>} />
        <Route  path="/Cart" element={<Cart/>} />
        <Route  path="/Profile" element={<Profile/>} />
        <Route  path="/SignUp" element={<SignUp/>} />
        <Route  path="/LogIn" element={<LogIn/>} />
       </Routes>
       <Footer/>
      </Router>
    </div>
  )
};

export default App; 