import React from 'react'

const HomeSectionHeader = ({tag, title, description}) => {
  return (
    <div className='text-center py-12 md:py-16 fade-in'>
        {tag && (
            <div className='w-fit text-[11px] font-bold uppercase tracking-widest my-3 mx-auto bg-blue-50 px-3 py-1 text-blue-600 rounded-lg border border-blue-100'>
                {tag}
            </div>
        )}
        <h2 className='text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2'>{title}</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mt-6 mb-8 rounded-full"></div>
        {description && (
            <p className='max-w-xl mx-auto text-slate-500 text-base leading-relaxed'>{description}</p>
        )}
    </div>
  )
}

export default HomeSectionHeader