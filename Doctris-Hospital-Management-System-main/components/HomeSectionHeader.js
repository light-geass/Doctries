import React from 'react'

const HomeSectionHeader = ({tag, title, description}) => {
  return (
    <div className='text-center py-12 md:py-16 fade-in'>
        {tag && (
            <div className='w-fit text-[11px] font-bold uppercase tracking-widest my-3 mx-auto px-3 py-1 text-blue-600 rounded-lg' style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
                {tag}
            </div>
        )}
        <h2 className='text-3xl md:text-4xl font-extrabold tracking-tight mt-2' style={{ color: 'var(--text)' }}>{title}</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mt-6 mb-8 rounded-full"></div>
        {description && (
            <p className='max-w-xl mx-auto text-base leading-relaxed' style={{ color: 'var(--text-muted)' }}>{description}</p>
        )}
    </div>
  )
}

export default HomeSectionHeader