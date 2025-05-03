import React, { useEffect } from 'react';
import Home from './pages/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { Routes , Route } from "react-router-dom" ;
import AllBooks from './pages/AllBooks';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import { authActions } from './store/auth';
import { useDispatch ,  useSelector } from 'react-redux';
import Favourite from './components/Profile/Favourite';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';



const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
  if(
    localStorage.getItem("id") &&
    localStorage.getItem("token") &&
    localStorage.getItem("role")
  ) {
    dispatch(authActions.login());
    dispatch(authActions.changeRole(localStorage.getItem("role")));
  }
}, []);
  return (
    <div>
       <Navbar/>
       <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route  path="/All-books" element={<AllBooks/>} />
        <Route  path="/Cart" element={<Cart/>} />
        <Route  path="/Profile" element={<Profile/>} >
          <Route index element={<Favourite/>}/>
          <Route path="orderHistory" element={<UserOrderHistory/>}/>
          <Route path="settings" element={<Settings/>}/>
        </Route>
        <Route  path="/SignUp" element={<SignUp/>} />
        <Route  path="/LogIn" element={<LogIn/>} />
        <Route  path="/view-book-details/:id" element={<ViewBookDetails />} />
       </Routes>
       <Footer/>
    </div>
  )
};

export default App; 