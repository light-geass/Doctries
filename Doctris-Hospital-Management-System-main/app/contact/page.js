import React from 'react'
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";


const Contact = () => {
  return (
    <div>
      <div className='px-70 py-16'>
        <div className='text-center mb-8'>
          <span className='inline-block text-[12px] font-black text-cyan-500 tracking-[0.2em] uppercase'>GET IN TOUCH</span>
          <h1 className='text-4xl font-black mt-3 tracking-tight' style={{ color: 'var(--text)' }}>
            We&apos;re here <span className='bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent'>to help</span>
          </h1>
          <p className='mt-4 max-w-2xl mx-auto font-medium' style={{ color: 'var(--text-muted)' }}>
            Need help with a scan, finding a doctor, or getting emergency support? Reach out anytime.
          </p>
        </div>
      </div>
      <div className='px-70 grid grid-cols-3 gap-6 text-center mb-20'>
        <div className='rounded-3xl p-8 shadow-xl group transition-all duration-300' style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className='flex justify-center mb-4'>
            <div className='p-4 rounded-2xl text-cyan-600 text-2xl group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-500' style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
              <FaPhone />
            </div>
          </div>
          <h3 className='text-[16px] font-black mb-2 uppercase tracking-wide' style={{ color: 'var(--text)' }}>Call Us Directly</h3>
          <p className='text-[14px] mb-3 font-medium' style={{ color: 'var(--text-muted)' }}>Available Mon–Sat, 9AM–6PM IST</p>
          <a href="tel:+152534468854" className='text-blue-600 font-black text-[14px] hover:underline transition-all'>+152 534-468-854</a>
        </div>
        <div className='rounded-3xl p-8 shadow-xl group transition-all duration-300' style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className='flex justify-center mb-4'>
            <div className='p-4 rounded-2xl text-blue-600 text-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500' style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
              <MdEmail />
            </div>
          </div>
          <h3 className='text-[16px] font-black mb-2 uppercase tracking-wide' style={{ color: 'var(--text)' }}>Drop a Message</h3>
          <p className='text-[14px] mb-3 font-medium' style={{ color: 'var(--text-muted)' }}>We respond within 24 hours</p>
          <a href="mailto:contact@example.com" className='text-blue-600 font-black text-[14px] hover:underline transition-all'>contact@example.com</a>
        </div>
        <div className='rounded-3xl p-8 shadow-xl group transition-all duration-300' style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className='flex justify-center mb-4'>
            <div className='p-4 rounded-2xl text-indigo-600 text-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500' style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
              <FaLocationDot />
            </div>
          </div>
          <h3 className='text-[16px] font-black mb-2 uppercase tracking-wide' style={{ color: 'var(--text)' }}>Find Our Office</h3>
          <p className='text-[14px] mb-3 font-medium' style={{ color: 'var(--text-muted)' }}>RAIT, Navi Mumbai</p>
          <a href="#map" className='text-blue-600 font-black text-[14px] hover:underline transition-all'>View on Google Maps →</a>
        </div>
      </div>
      <div className='px-70 grid grid-cols-[2fr_3fr] gap-10 mb-20' >
        <div className='rounded-[32px] overflow-hidden shadow-2xl' style={{ border: '1px solid var(--border)' }}>
          <img src="/about-2.png" alt="Contact" className='w-full h-full object-cover' />
        </div>
        <div className='rounded-[32px] p-10 h-fit shadow-2xl' style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <form className='grid gap-6'>
            <div>
              <h2 className='text-2xl font-black mb-1 tracking-tight' style={{ color: 'var(--text)' }}>Send a Message</h2>
              <p className='font-medium text-[14px]' style={{ color: 'var(--text-muted)' }}>Fill in the form and we&apos;ll get back to you shortly.</p>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <label htmlFor="name" className='text-[10px] font-black uppercase tracking-widest ml-1' style={{ color: 'var(--text-light)' }}>YOUR NAME</label>
                <input type="text" id="name" placeholder='Alok Mahadik' className='input-field rounded-xl' />
              </div>
              <div className='grid gap-2'>
                <label htmlFor="email" className='text-[10px] font-black uppercase tracking-widest ml-1' style={{ color: 'var(--text-light)' }}>YOUR EMAIL</label>
                <input type="email" id="email" placeholder='alok@example.com' className='input-field rounded-xl' />
              </div>
            </div>
            <div className='grid gap-2'>
              <label htmlFor="subject" className='text-[10px] font-black uppercase tracking-widest ml-1' style={{ color: 'var(--text-light)' }}>SUBJECT</label>
              <input type="text" id="subject" placeholder='How can we help?' className='input-field rounded-xl' />
            </div>
            <div className='grid gap-2'>
              <label htmlFor="message" className='text-[10px] font-black uppercase tracking-widest ml-1' style={{ color: 'var(--text-light)' }}>MESSAGE</label>
              <textarea id="message" placeholder='Describe your question or issue...' className='input-field h-32 rounded-xl resize-none'></textarea>
            </div>
            <button type="submit" className='bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-white font-black uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 duration-200 text-sm'>
              Send Message →
            </button>
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