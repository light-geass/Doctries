'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import insforge from '@/utils/insforge'

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailFromQuery)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    const { data, error } = await insforge.auth.verifyEmail({
      email,
      otp,
    })

    if (error) {
      setMessage({ text: error.message || 'Verification failed', type: 'error' })
      setLoading(false)
      return
    }

    setMessage({ text: 'Email verified successfully! Redirecting to login...', type: 'success' })
    setTimeout(() => router.push('/login'), 2000)
    setLoading(false)
  }

  const handleResend = async () => {
    if (!email) {
      setMessage({ text: 'Please enter your email address', type: 'error' })
      return
    }
    setResending(true)
    setMessage({ text: '', type: '' })

    const { data, error } = await insforge.auth.resendVerificationEmail({ email })

    if (error) {
      setMessage({ text: error.message || 'Failed to resend code', type: 'error' })
    } else {
      setMessage({ text: 'Verification code resent! Check your email.', type: 'success' })
    }
    setResending(false)
  }

  return (
    <div className='py-35 bg-[#f2f3f4] min-h-screen flex flex-col justify-center'>
      <div className='flex text-2xl justify-center items-center gap-2 font-semibold mb-5'>
        <img alt='' src='/logo-icon.png' className='h-5' />
        <h1>Doctris</h1>
      </div>

      <div className='border-1 border-[#ebf0fd] bg-white w-1/4 mx-auto px-7 py-10 grid grid-cols-1 gap-8 rounded-md shadow-md'>
        <div className='text-center'>
          <h1 className='font-semibold text-2xl mb-2'>Verify Your Email</h1>
          <p className='text-sm text-gray-500'>
            We sent a 6-digit verification code to your email address.
          </p>
        </div>

        {message.text && (
          <div
            className={`text-sm p-2 rounded-md text-center ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleVerify} className='grid grid-cols-1 gap-5'>
          <input
            type='email'
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            required
            className='border border-[#e9ecef] px-3 py-2 text-sm rounded-md shadow-sm'
          />
          <input
            type='text'
            value={otp}
            placeholder='Enter 6-digit code'
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            className='border border-[#e9ecef] px-3 py-2 text-sm rounded-md shadow-sm text-center tracking-widest text-lg'
          />

          <button
            type='submit'
            className='bg-blue-500 text-white p-2 text-sm rounded hover:bg-blue-600'
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className='text-center'>
          <button
            onClick={handleResend}
            disabled={resending}
            className='text-sm text-blue-600 hover:underline cursor-pointer'
          >
            {resending ? 'Resending...' : "Didn't receive the code? Resend"}
          </button>
        </div>

        <div className='flex gap-2 mx-auto'>
          <Link href='/login'>
            <h1 className='text-[13px] text-blue-600 cursor-pointer hover:underline'>Back to Sign in</h1>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f2f3f4]">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  )
}
