import React, { useEffect , useState } from 'react' ;


import axios from "axios" ; 
import BookCard from '../BookCard/BookCard';
const RecentlyAdded = () => {
    const[Data , setData] = useState() ;
    useEffect(() => {
        const fetch = async () => {
        const response =  await axios.get(
            "http://localhost:5173/api/v1/get-recent-books"
        );
        setData(response.data.data);
      };
      fetch();
    } , []);

  return (
    <div className='mt-8 px-4'>
        <h4 className='text-3xl text-yellow-100'>Recently added books</h4>
        <div className='my-4 grid grid-cols-1 sm:grid-col-3 md:grid-cols-4 gap-4'>
            {Data && Data.map((item , i) => (<div key={i}>
                <BookCard data= {items} /> {" "}
            </div>
        ))}
        </div>
    </div>
  );
};

export default RecentlyAdded