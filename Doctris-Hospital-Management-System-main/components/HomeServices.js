import React from 'react'
import { FaArrowRight } from "react-icons/fa6";

const HomeServices = ({ icon, name, desc }) => {
  return (
    <div className='card p-8 group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-blue-200 flex flex-col items-start text-left'>
      <div className='bg-blue-50 text-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300'>
        {icon}
      </div>
      <h3 className='font-bold text-xl text-slate-900 mb-3 group-hover:text-blue-600 transition-colors'>{name}</h3>
      <p className='text-[15px] text-slate-500 leading-relaxed mb-6'>{desc}</p>
      <div className='mt-auto flex items-center gap-2 text-sm font-bold text-blue-600 cursor-pointer group/link'>
        <span className="border-b-2 border-transparent group-hover/link:border-blue-600 transition-all">Learn more</span>
        <FaArrowRight className='text-xs transition-transform group-hover/link:translate-x-1' />
      </div>
    </div>
  )
}

export default HomeServices