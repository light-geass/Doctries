import HomeSectionHeader from '@/components/HomeSectionHeader'
import HomeServices2 from '@/components/HomeServices2'
import React from 'react'
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";


const Contact = () => {
  return (
    <div>
      <HomeSectionHeader title="Contact Us" description="Great doctor if you need your family member to get effective immediate assistance, emergency treatment or a simple consultation." />
      <div className='px-70 grid grid-cols-3 gap-6 text-center mb-20'>
        <HomeServices2 icon={<FaPhone />} name="Phone" desc="Great doctor if you need your family member to get effective assistance" link="+152 534-468-854" />
        <HomeServices2 icon={<MdEmail />} name="Email" desc="Great doctor if you need your family member to get effective assistance" link="contact@example.com" />
        <HomeServices2 icon={<FaLocationDot />} name="Location" desc="Great doctor if you need your family member to get effective assistance" link="View on Google map" />

      </div>
      <div className='px-70 grid grid-cols-[2fr_3fr] gap-10 mb-20' >
        <div className=''>
          <img src="/about-2.png" alt="" />
        </div>
        <div className='shadow-md rounded-sm p-5 h-fit'>
          <form action="" className='grid gap-3'>
            <h1 className='text-[17px] font-semibold'>Get in touch!</h1>
            <div className='grid grid-cols-2 gap-3'>
              <div className='grid gap-1'>
                <label htmlFor="" className='text-[14px]'>Your Name*</label>
                <input type="text" placeholder='Name:' className='border-1 border-[#ebf0fd] text-[13px] px-2 py-1 outline-none rounded-sm' />
              </div>
              <div className='grid gap-1'>
                <label htmlFor="" className='text-[14px]'>Your Email*</label>
                <input type="email" placeholder='Email:' className='border-1 border-[#ebf0fd] text-[13px] px-2 py-1 outline-none rounded-sm' />
              </div>
            </div>
            <div className='grid gap-1'>
              <label htmlFor="" className='text-[14px]'>Subject:</label>
              <input type="text" placeholder='Your Subject:' className='border-1 border-[#ebf0fd] text-[13px] px-2 py-1 outline-none rounded-sm' />
            </div>
            <div className='grid gap-1'>
              <label htmlFor="" className='text-[14px]'>Comments *</label>
              <textarea name="" id="" placeholder='Your Message:' className='border-1 border-[#ebf0fd] text-[13px] px-2 py-1 h-30 outline-none rounded-sm'></textarea>
            </div>
            <div className='bg-[#396cf0] px-4 py-2 text-white w-fit rounded-sm text-[14px]'>
              <button>
                Send Message
              </button>
            </div>
          </form>
        </div>


      </div>
      <div className='w-full'>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d55431.05581015953!2d-95.461302!3d29.735948000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald%20D.%20Hines%20Waterwall%20Park!5e0!3m2!1sen!2sin!4v1758907364439!5m2!1sen!2sin"
          className='w-full h-[450px] border-0'
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default Contact