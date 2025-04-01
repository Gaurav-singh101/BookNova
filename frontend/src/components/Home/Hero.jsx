import React from 'react'

const hero = () => {
  return (
    <div className='h-[75vh] flex'>
        <div className='w-full lg:w-3/6 flex flex-col items-center  lg:items-start justify-center'>
        <h1 className='text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left'>
          Discover Your Next Great Read</h1>
          <p className='mt-4 text-xl text-zinc-300 text-center lg:text-left'>
            Uncover Captivating stories , enriching knowledge , and endless
            inspiration in our curated collection of books
          </p>
          <div className='mt-8'>
            <button className='text-yellow-100 text:xl lg:text-2xl font-semibold border border-yellow-100 px-10 py-3 hover:bg-zinc-800 rounded-full'>Discover Books</button>
          </div>
        </div>
        <div className='w-full lg:w-3/8 h-auto lg:h-[100%] flex items-center justify-center'>
              <img src="./hero.png" alt="Hero" />
        </div>
        
    </div>
  )
}

export default hero  ;