import HomeSectionHeader from '@/components/HomeSectionHeader'
import HomeDoctorsList from '@/components/HomeDoctorsList'
import Link from 'next/link'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa6'

const trustHighlights = [
  {
    title: 'AI-Supported Diagnostics',
    description: 'Faster scan interpretations with human-verified recommendations for safer decisions.',
  },
  {
    title: 'Specialist-Led Care Team',
    description: 'Experienced doctors across key departments working in one connected workflow.',
  },
  {
    title: 'Always-On Support',
    description: 'Appointments, follow-ups, and urgent guidance in one modern patient experience.',
  },
]

const About = () => {
  return (
    <div className='mb-20'>
      <section className='px-6 md:px-10 lg:px-20 pt-14 pb-16'>
        <div className='mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-500' style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
              About Doctris
            </div>
            <h1 className='mt-5 text-4xl md:text-5xl font-extrabold tracking-tight' style={{ color: 'var(--text)' }}>
              Better Care, <span className='bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'>Better Outcomes</span>
            </h1>
            <p className='mx-auto mt-4 max-w-2xl text-sm md:text-base leading-7' style={{ color: 'var(--text-muted)' }}>
              We combine medical expertise with AI-powered tools to make diagnosis, appointments, and treatment support more reliable and more accessible.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-[1.05fr_1.2fr] gap-8 lg:gap-10 items-stretch perspective-1000'>
            <div className='rounded-[26px] p-3 shadow-lg tilt-3d' style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <img
                src='/about-2.png'
                alt='Medical team in consultation'
                className='h-full w-full rounded-[20px] object-cover'
              />
            </div>

            <div className='rounded-[26px] p-6 md:p-8 shadow-lg' style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className='text-2xl md:text-3xl font-extrabold tracking-tight' style={{ color: 'var(--text)' }}>
                Good Services And Better Health By Our Specialists
              </h2>
              <p className='mt-4 text-sm md:text-base leading-7' style={{ color: 'var(--text-muted)' }}>
                Doctris helps patients move from uncertainty to clarity with structured clinical pathways,
                quick specialist access, and AI-driven medical support at each important touchpoint.
              </p>
              <p className='mt-3 text-sm md:text-base leading-7' style={{ color: 'var(--text-muted)' }}>
                From early scan interpretation to long-term treatment guidance, our platform is designed
                to keep care simple, transparent, and centered around patient confidence.
              </p>

              <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {trustHighlights.map((item) => (
                  <div
                    key={item.title}
                    className='rounded-2xl p-4 tilt-3d group transition-colors'
                    style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <h3 className='text-sm font-bold group-hover:text-blue-600' style={{ color: 'var(--text)' }}>{item.title}</h3>
                    <p className='mt-1 text-xs leading-6' style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                  </div>
                ))}
              </div>

              <div className='mt-7'>
                <Link
                  href='/appointment'
                  className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(14,165,233,0.35)] transition hover:translate-y-[-1px]'
                >
                  Book Appointment
                  <FaArrowRight className='text-xs' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 md:px-10 lg:px-20'>
        <div className='mx-auto max-w-6xl rounded-[26px] p-6 md:p-10 shadow-lg' style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <HomeSectionHeader
            tag='Our Doctors'
            title='Meet Our Expert Team'
            description='Specialists with patient-first care, advanced diagnostics, and coordinated treatment planning.'
          />
          <HomeDoctorsList />
        </div>
      </section>
    </div>
  )
}

export default About