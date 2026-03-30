import React from 'react'

const HomeServices2 = ({ icon, name, desc,link }) => {
  
  return (
    <div className='grid grid-rows gap-4 '>
      <div className=' bg-[#396cf00d] rounded-xl text-[#396cf0] w-fit p-4 text-3xl mx-auto'>{icon}</div>
      <div><h1 className='font-semibold text-[18px]'>{name}</h1></div>
      <div className='text-[14px] text-[#8492A6]'><p>{desc}</p></div>
      <div><a href="" className='text-[#396cf0] text-[14px]'>{link}</a></div>
    </div>
  )
}

export default HomeServices2