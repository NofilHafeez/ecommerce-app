import React from 'react'
import { CiCirclePlus } from "react-icons/ci";

const ProductCard = () => {
  return (
    <div>
        <div className='w-72 h-96 flex flex-col gap-2'>
                                       <div className='bg-blue-400 w-full h-72'>
                                           <img 
                                               src="https://i.pinimg.com/736x/10/24/62/102462d008986c61821000f99a2ad634.jpg" 
                                               className="w-full h-full object-cover object-top" 
                                               alt="Black Jacket" 
                                           />
                                       </div>
                                       <div className='w-full'>
                                           <h1 className='text-md mb-2'>Black Jacket With Trouser. With Inner Shirt.</h1>
                                           <div className='w-full flex justify-between'>
                                           <h2 className='font-bold'>$100</h2>
                                           <a href="" className='text-2xl'><CiCirclePlus /></a>
                                           </div>
                                       </div>
                                   </div>
    </div>
  )
}

export default ProductCard