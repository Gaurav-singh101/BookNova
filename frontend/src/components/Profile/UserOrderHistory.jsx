import React, { useEffect, useState } from 'react'
import axios from "axios";
import Loader from "../Loader/Loader" ;

const UserOrderHistory = () => {
  const [OrderHistory , setOrderHistory] = useState();
  const headers = {
    id: localStorage.getItem("id") ,
    authorization: `Bearer ${localStorage.getItem("token")}` ,
  };

  useEffect(() => {
    const fetch = async() => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-order-history" , 
        {headers}
      );
      console.log(response);
    };
    fetch();
  } , []);

  return  
    <div>UserOrderHistory</div>

};

export default UserOrderHistory