import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import HomeSectionHeader from './HomeSectionHeader';
import HomeServices from './HomeServices';
import { MdRemoveRedEye } from "react-icons/md";
import { FaHeadSideVirus } from "react-icons/fa6";
import { PiStethoscopeBold } from "react-icons/pi";
import { BsCapsule } from "react-icons/bs";
import { RiMicroscopeFill } from "react-icons/ri";
import { TbActivityHeartbeat } from "react-icons/tb";
import { BsPersonFill } from "react-icons/bs";
import { FaCircleNodes } from "react-icons/fa6";
import Link from 'next/link';

const HomeAbout = () => {

  const services = [
    { icon: <MdRemoveRedEye />, name: "Eye Care", desc: "Specialized diagnostics and treatments for vision health using AI-enhanced imaging." },
    { icon: <FaHeadSideVirus />, name: "Psychotherapy", desc: "Compassionate mental health support with integrated progress tracking tools." },
    { icon: <PiStethoscopeBold />, name: "Primary Care", desc: "Comprehensive check-ups and preventative care for you and your family." },
    { icon: <BsCapsule />, name: "Dental Care", desc: "Modern dentistry using the latest technology for a pain-free experience." },
    { icon: <RiMicroscopeFill />, name: "Orthopedic", desc: "Advanced bone and joint care with personalized recovery programs." },
    { icon: <TbActivityHeartbeat />, name: "Cardiology", desc: "Heart health monitoring and preventative screenings for cardiovascular wellness." },
    { icon: <BsPersonFill />, name: "Gynecology", desc: "Specialized care for women's health across all stages of life." },
    { icon: <FaCircleNodes />, name: "Neurology", desc: "Comprehensive brain and nervous system diagnostics and treatments." }
  ];


  return (
    <div className='px-6 md:px-12 lg:px-24 py-20 overflow-hidden transition-colors duration-300' style={{ backgroundColor: 'var(--bg)' }}>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32'>
        <div className="fade-in perspective-1000">
          <div className="relative tilt-3d">
            <div className="absolute -inset-4 rounded-3xl -z-10 blur-2xl animate-pulse" style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)' }}></div>
            <img src="/about-2.png" alt="Treatment" className="rounded-3xl shadow-2xl relative border-4" style={{ borderColor: 'var(--surface)' }} />
            <div className="glass-3d absolute -bottom-10 -right-10 p-8 rounded-3xl shadow-2xl animate-float">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold transform -rotate-6 shadow-lg shadow-blue-200">A</div>
                <div>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Innovation</p>
                  <p className="text-lg font-black tracking-tight" style={{ color: 'var(--text)' }}>AI Integrated Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-6 fade-in' style={{ animationDelay: '0.2s' }}>
          <div className="inline-block w-fit px-3 py-1 rounded-lg text-xs font-bold text-blue-600 uppercase tracking-wider" style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
            Excellence in Care
          </div>
          <h2 className='font-extrabold text-3xl md:text-5xl tracking-tight leading-tight' style={{ color: 'var(--text)' }}>Revolutionizing Healthcare Through <span className="gradient-text">Innovation</span></h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Our mission is to provide world-class medical services enhanced by cutting-edge artificial intelligence. We blend compassionate human expertise with technological precision to ensure the best outcomes for every patient.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Instant AI-powered scan analysis in seconds</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Direct access to top-rated medical specialists</p>
            </div>
          </div>
          <div className="pt-4">
            <Link href="/about">
              <button className="btn-primary py-3 px-8 text-base">
                Learn our story <FaArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div id="services">
        <HomeSectionHeader 
          tag="Departments" 
          title="Specialized Medical Services" 
          description="We provide a wide range of medical departments equipped with state-of-the-art facilities and powered by intelligent diagnostic systems." 
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {services.map((service, index) => (
            <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <HomeServices name={service.name} desc={service.desc} icon={service.icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeAbout