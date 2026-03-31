import React from 'react'
import HomeSectionHeader from './HomeSectionHeader'
import HomeDoctorsList from './HomeDoctorsList'

const HomeDoctors = () => {
  return (
    <div className="py-20 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)' }}>
        <HomeSectionHeader 
          title="Meet Our Experts" 
          tag="Certified Specialists"
          description="Our team consists of high-qualified professionals dedicated to providing effective medical assistance and personalized treatment."
        />
        
        <HomeDoctorsList />

        <div className="container mx-auto px-6 lg:px-24 mt-40">
          <div className='relative card overflow-hidden bg-blue-600 min-h-[300px] flex flex-col justify-end p-10 md:p-16'>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500 -skew-x-12 translate-x-1/4 opacity-20"></div>
              
              <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white'>
                <div className="fade-in">
                  <p className='font-black text-5xl md:text-6xl mb-2'>99%</p> 
                  <h3 className='font-bold text-lg uppercase tracking-wider mb-1'>Positive feedback</h3>
                  <p className='text-blue-100 text-sm'>From our patients</p>
                </div>
                <div className="fade-in" style={{ animationDelay: '0.1s' }}>
                  <p className='font-black text-5xl md:text-6xl mb-2'>15+</p>
                  <h3 className='font-bold text-lg uppercase tracking-wider mb-1'>Expert Clinics</h3>
                  <p className='text-blue-100 text-sm'>Across the country</p>
                </div>
                <div className="fade-in" style={{ animationDelay: '0.2s' }}>
                  <p className='font-black text-5xl md:text-6xl mb-2'>24/7</p>
                  <h3 className='font-bold text-lg uppercase tracking-wider mb-1'>Support Center</h3>
                  <p className='text-blue-100 text-sm'>Always here for you</p>
                </div>
              </div>
          </div>
        </div>
    </div>
  )
}

export default HomeDoctors