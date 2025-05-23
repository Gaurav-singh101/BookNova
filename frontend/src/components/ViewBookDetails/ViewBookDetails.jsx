import React, { useEffect , useState } from 'react' ;
import axios from "axios" ; 
import Loader  from "../Loader/Loader";
import { Link , useNavigate, useParams  } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const[Data , setData] = useState() ;
  const isLoggedIn =  useSelector((state) => state.auth.isLoggedIn);
  const role =  useSelector((state) => state.auth.role);


  useEffect(() => {
      const fetch = async () => {
      const response =  await axios.get(
          `https://booknova-backend.onrender.com/api/v1/get-book-by-id/${id}`
      );
      setData(response.data.data);
    };
    fetch();
  } , []);

  const headers = {
    id: localStorage.getItem("id") ,
    authorization: `Bearer ${localStorage.getItem("token")}` ,
    bookid: id ,
  };

  const handleFavourite = async () => {
    const response = await axios.put("https://booknova-backend.onrender.com/api/v1/add-book-to-favourite" , {} ,
      {headers} 
    );
    alert(response.data.message);
  };

  const handleCart = async () => {
    const response = await axios.put("https://booknova-backend.onrender.com/api/v1/add-to-cart" , {} ,
      {headers} 
    );
    alert(response.data.message);
  };


  // const DeleteBook = async () => {
  //   const response = await axios.delete("http://localhost:1000/api/v1/delete-book" , {} ,
  //     {headers}
  //   );
  //   alert(response.data.message);
  //   navigate("/all-books");
  // };


  const DeleteBook = async () => {
  try {
    const response = await axios.delete("https://booknova-backend.onrender.com/api/v1/delete-book", {
      headers: {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: id, 
      },
    });
    alert(response.data.message);
    navigate("/all-books");
  } catch (err) {
    console.error(err);
    alert("Failed to delete book.");
  }
};




  return (
    <>
      {Data &&  (
        <div className=' px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8 items-start'>
          <div className="w-full  lg:w-3/6 ">
          {" "}
          <div className="flex flex-col lg:flex-row justify-around bg-zinc-800  py-12 rounded gap-0 lg:gap-8">
            {" "}
            <img src={Data.url} 
            alt="/" 
            className='h-[50vh] md:h-[60vh] lg:h-[70vh] rounded'
            />
              {isLoggedIn === true && role === "user" && (
                  <div className='flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0'>
                    <button className='bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 text-red-500 flex items-center justify-center' 
                    onClick={handleFavourite}>

                    <FaHeart /><spam className="ms-4 block lg:hidden">favourites</spam>
                    </button>
                    <button className='text-white rounded mt-8 md:mt-0 lg:rounded-full text-3xl p-3 lg:mt-8 bg-blue-600 flex items-center justify-center'
                    onClick={handleCart}>
                    <FaShoppingCart /><spam className="ms-4 block lg:hidden">Add to Cart</spam>
                    </button>
                  </div>
              )}
              {isLoggedIn === true && role === "admin" && (
                  <div className='flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0'>
                    <Link 
                    to={`/updateBook/${id}`}
                    className='bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 flex items-center justify-center'>
                    <FaEdit />
                    <span className="ms-4 block lg:hidden">Edit Book</span>
                    </Link>
                    <button className='text-red-500 rounded lg:rounded-full text-4xl lg:text-3xl p-3 mt-8 md:mt-0 lg:mt-8 bg-white flex items-center justify-center' 
                    onClick={DeleteBook}
                    >
                    <MdDelete />
                    <span className="ms-4 block lg:hidden">Delete Book</span>
                    </button>
                  </div>
              )}
          </div>
        </div>

        <div className='p-4 w-full  lg:w-3/6'>
          <h1 className='text:2xl lg:text-3xl text-zinc-300 font-semibold'>
            Book Name : {Data.title}
          </h1>
          <p className='text-zinc-400 mt-1'>Author : {Data.author}</p>                
          <p className='text-zinc-500 mt-4 text-xl'>Description : {Data.desc}</p>
          <p className='flex mt-4 items-center justify-start text-zinc-400'>
          <GrLanguage className="me-3" /> {Data.language}
          </p>
          <p className='mt-4 text-zinc-100 text-3xl font-semibold'>
            Price : ₹ {Data.price}{" "}
          </p>
        </div>
    </div> )}
          {!Data && <div className='h-screen bg-zinc-900 flex items-center justify-center'><Loader /></div> }
    </>
  );
};

export default ViewBookDetails
