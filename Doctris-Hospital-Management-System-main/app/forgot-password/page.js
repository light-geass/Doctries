'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import insforge from '@/utils/insforge'

const ForgotPasswordPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [resetToken, setResetToken] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const { data, error: err } = await insforge.auth.sendResetPasswordEmail({ email })
      if (err) {
        setError(err.message || 'Failed to send reset code')
      } else {
        setMessage('Reset code sent to your email!')
        setCodeSent(true)
      }
    } catch (err) {
      setError('Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      // Step 1: Exchange code for token
      const { data: tokenData, error: tokenErr } = await insforge.auth.exchangeResetPasswordToken({
        email,
        code,
      })
      if (tokenErr) {
        setError(tokenErr.message || 'Invalid code')
        setLoading(false)
        return
      }

      // Step 2: Reset password with token
      const { data, error: resetErr } = await insforge.auth.resetPassword({
        newPassword,
        otp: tokenData.token,
      })
      if (resetErr) {
        setError(resetErr.message || 'Failed to reset password')
      } else {
        setMessage('Password reset successfully! Redirecting to login...')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (err) {
      setError('Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-[#f2f3f4]'>
      <div className='border border-[#ebf0fd] bg-white w-1/4 px-7 py-10 rounded-md shadow-md'>
        <h1 className='text-center text-2xl font-semibold mb-6'>Forgot Password</h1>

        {message && (
          <div className='bg-green-50 text-green-700 border border-green-200 rounded p-2 text-center text-sm mb-3'>
            {message}
          </div>
        )}
        {error && (
          <div className='bg-red-50 text-red-700 border border-red-200 rounded p-2 text-center text-sm mb-3'>
            {error}
          </div>
        )}

        {!codeSent ? (
          <form onSubmit={handleSendCode} className='grid gap-5'>
            <input
              type='email'
              placeholder='Enter your registered email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='border border-[#e9ecef] px-3 py-2 text-sm rounded-md shadow-sm'
            />
            <button
              type='submit'
              disabled={loading}
              className='bg-blue-500 text-white text-sm p-2 rounded hover:bg-blue-600'
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className='grid gap-5'>
            <input
              type='text'
              placeholder='Enter 6-digit code'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
              className='border border-[#e9ecef] px-3 py-2 text-sm rounded-md shadow-sm text-center tracking-widest'
            />
            <input
              type='password'
              placeholder='Enter new password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className='border border-[#e9ecef] px-3 py-2 text-sm rounded-md shadow-sm'
            />
            <button
              type='submit'
              disabled={loading}
              className='bg-green-500 text-white text-sm p-2 rounded hover:bg-green-600'
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
