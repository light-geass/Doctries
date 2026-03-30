import React from 'react'
import { MdKeyboardArrowRight, MdOutlineMail, IoCallOutline, GrLocation } from "react-icons/md";
import { FiFacebook, FiTwitter } from "react-icons/fi";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className='bg-slate-900 text-slate-400'>
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
                    
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <img src="/logo-icon.png" alt="Doctris" className="h-5 w-5 object-contain brightness-0 invert" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Doctris</span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Advancing healthcare through technology. Get instant AI scan analysis and expert consultations from the comfort of your home.
                        </p>
                        <div className="flex gap-4">
                            {[FiFacebook, FaInstagram, FiTwitter, FaLinkedinIn].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-white font-bold text-lg mb-8'>Quick Links</h3>
                        <ul className='space-y-4 text-sm'>
                            {[
                                { name: 'About Us', href: '/about' },
                                { name: 'Doctors', href: '/doctors' },
                                { name: 'AI Scan', href: '/scan-upload' },
                                { name: 'Results', href: '/results' },
                                { name: 'Support', href: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <MdKeyboardArrowRight className="text-slate-600 group-hover:text-blue-400" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className='text-white font-bold text-lg mb-8'>Specialties</h3>
                        <ul className='space-y-4 text-sm'>
                            {['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'Radiology'].map((svc) => (
                                <li key={svc} className="flex items-center gap-2 hover:text-blue-400 transition-colors group cursor-pointer">
                                    <MdKeyboardArrowRight className="text-slate-600 group-hover:text-blue-400" />
                                    {svc}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className='text-white font-bold text-lg mb-8'>Get in Touch</h3>
                        <ul className='space-y-5 text-sm'>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-500">
                                    <MdOutlineMail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Us</p>
                                    <p className="text-slate-300 font-medium">contact@doctris.com</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-500">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Call Us</p>
                                    <p className="text-slate-300 font-medium">+1 525 344 6885</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium'>
                    <p>© 2025 Doctris AI. All rights reserved.</p>
                    <div className='flex gap-8'>
                        <a href="#" className="hover:text-blue-400">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400">Terms of Service</a>
                        <a href="#" className="hover:text-blue-400">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer