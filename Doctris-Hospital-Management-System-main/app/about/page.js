import HomeAbout2 from '@/components/HomeAbout2'
import HomeSectionHeader from '@/components/HomeSectionHeader'
import HomeDoctorsList from '@/components/HomeDoctorsList'
import React from 'react'

const About = () => {
  return (
    <div className='mb-20'>
      <div>
        <HomeSectionHeader title="About us" description="Great doctor if you need your family member to get effective immediate assistance, emergency treatment or a simple consultation." />
        <div className='px-50 pt-10 pb-20'>
          <div className='grid grid-cols-[3fr_4fr] gap-15'>
            <div>
              <img src="/about-2.png" alt="" />
            </div>
            <div className='pt-20 flex flex-col gap-5'>
              <div className='bg-[#EBF0FD] w-fit text-[12px] text-[#396cf0] font-semibold px-3 rounded-xl'><p>About doctris</p></div>
              <h1 className='font-semibold text-[24px] w-2/3'>Good Services And Better Health By Our Specialists</h1>
              <p className='text-[14px]'>Great doctor if you need your family member to get effective immediate assistance, examination, emergency treatment or a simple consultation. Thank you.</p>
              <p className='text-[14px]'>The most well-known dummy text is the 'Lorem Ipsum', which is said to have originated in the 16th century. Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words.</p>
              <div>
                <button className="mt-2 bg-[#EBF0FD] flex text-[#396cf0] px-5 py-2 rounded-md shadow-lg cursor-pointer">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
        <HomeAbout2 />
      </div>

      <div className=''>
        <HomeSectionHeader className="bg-red-200" title="Doctors" description="Great doctor if you need your family member to get effective immediate assistance, emergency treatment or a simple consultation." />
        <HomeDoctorsList />
      </div>


    </div>
  )
}
export default About