'use client'

import { useState, useEffect } from 'react'
import { Home, Eye, EyeOff, Mail, Key, Lock } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 'code' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.email) {
      setError('لطفا ایمیل خود را وارد کنید')
      return
    }
    setSuccess('کد تأیید به ایمیل شما ارسال شد')
    setStep('code')
    setTimer(60)
    setCanResend(false)
  }

  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.code) {
      setError('لطفا کد تأیید را وارد کنید')
      return
    }
    setSuccess('کد تأیید شد')
    setStep('password')
  }

  const handleResendCode = () => {
    setSuccess('کد جدید به ایمیل شما ارسال شد')
    setTimer(60)
    setCanResend(false)
    setFormData(prev => ({ ...prev, code: '' }))
    setError('')
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.password || !formData.confirmPassword) {
      setError('لطفا هر دو رمز عبور را وارد کنید')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبورها یکسان نیستند')
      return
    }
    setSuccess('رمز عبور با موفقیت تغییر کرد')
    console.log('Password changed:', formData)
  }

  const primaryButtonClasses = 'w-full bg-gradient-to-r from-[#2A4B7C] to-[#00C49A] text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-base'
  const secondaryButtonClasses = 'w-full bg-white/30 border border-border/40 text-foreground font-medium py-2.5 rounded-lg hover:bg-white/40 transition-all duration-300 cursor-pointer text-base'

  const renderStepIndicator = () => (
    <div className="flex gap-2 mb-6">
      <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step === 'email' || step === 'code' || step === 'password' ? 'bg-accent' : 'bg-border/40'}`} />
      <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step === 'code' || step === 'password' ? 'bg-accent' : 'bg-border/40'}`} />
      <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step === 'password' ? 'bg-accent' : 'bg-border/40'}`} />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col overflow-hidden">
      {/* Home Button */}
      <Link href="/" className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl hover:-translate-y-1" title="بازگشت به صفحه اصلی">
        <Home className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
      </Link>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Form Section */}
        <div className="w-full max-w-md animate-fade-in" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
          {/* Logo Container */}
          <a href="/" className="text-center mb-5 group inline-block w-full">
            <div className="flex items-center justify-center mb-3">
              <img src="/images/logo.png" alt="صدورآنلاین لوگو" className="h-14 w-14 sm:h-16 sm:w-16 hover:scale-110 transition-transform duration-300" />
            </div>
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#2A4B7C] to-[#00C49A] bg-clip-text text-transparent">صدورآنلاین</p>
          </a>

          {/* Header */}
          <header className="mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">بازیابی رمز عبور</h1>
            <p className="text-center text-foreground/60 text-sm sm:text-base">
              {step === 'email' && 'ایمیل خود را وارد کنید'}
              {step === 'code' && 'کد تأیید ارسال شده را وارد کنید'}
              {step === 'password' && 'رمز عبور جدید خود را تعیین کنید'}
            </p>
          </header>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              <div className="input-wrapper">
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">ایمیل</label>
                <div className="relative flex items-center bg-white/50 backdrop-blur-sm border border-border/40 rounded-lg focus-within:border-accent focus-within:shadow-lg transition-all duration-300">
                  <div className="absolute right-3 text-primary/60">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent px-4 py-2.5 pr-10 outline-none text-base text-foreground placeholder-foreground/40 font-medium"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm font-medium text-center">{success}</p>}

              <button type="submit" className={primaryButtonClasses}>
                ارسال کد
              </button>
            </form>
          )}

          {/* Step 2: Code */}
          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-3.5">
              <div className="input-wrapper">
                <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">کد تأیید</label>
                <div className="relative flex items-center bg-white/50 backdrop-blur-sm border border-border/40 rounded-lg focus-within:border-accent focus-within:shadow-lg transition-all duration-300">
                  <div className="absolute right-3 text-primary/60">
                    <Key className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent px-4 py-2.5 pr-10 outline-none text-base text-foreground placeholder-foreground/40 font-medium"
                    placeholder="کد 6 رقمی را وارد کنید"
                  />
                </div>
              </div>

              <div className="text-center">
                <p className={`text-sm font-medium ${timer > 0 ? 'text-accent' : 'text-foreground/60'}`}>
                  {timer > 0 ? `زمان باقی: ${timer} ثانیه` : 'کد منقضی شده است'}
                </p>
              </div>

              {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm font-medium text-center">{success}</p>}

              <div className="flex gap-2">
                <button type="submit" className={primaryButtonClasses}>
                  تأیید کد
                </button>
                <button type="button" onClick={() => { setStep('email'); setFormData({ ...formData, code: '' }); setError(''); setTimer(0); }} className={secondaryButtonClasses}>
                  بازگشت
                </button>
              </div>

              {canResend && (
                <button type="button" onClick={handleResendCode} className={primaryButtonClasses}>
                  ارسال مجدد کد
                </button>
              )}
            </form>
          )}

          {/* Step 3: Password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div className="input-wrapper">
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">رمز عبور جدید</label>
                <div className="relative flex items-center bg-white/50 backdrop-blur-sm border border-border/40 rounded-lg focus-within:border-accent focus-within:shadow-lg transition-all duration-300">
                  <div className="absolute right-3 text-primary/60">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent px-4 py-2.5 pr-10 outline-none text-base text-foreground placeholder-foreground/40 font-medium"
                    placeholder="رمز عبور جدید"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 text-primary/60 hover:text-primary transition-colors duration-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="input-wrapper">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">تأیید رمز عبور</label>
                <div className="relative flex items-center bg-white/50 backdrop-blur-sm border border-border/40 rounded-lg focus-within:border-accent focus-within:shadow-lg transition-all duration-300">
                  <div className="absolute right-3 text-primary/60">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent px-4 py-2.5 pr-10 outline-none text-base text-foreground placeholder-foreground/40 font-medium"
                    placeholder="تأیید رمز عبور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 text-primary/60 hover:text-primary transition-colors duration-300 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm font-medium text-center">{success}</p>}

              <div className="flex gap-2">
                <button type="submit" className={primaryButtonClasses}>
                  تغییر رمز عبور
                </button>
                <button type="button" onClick={() => { setStep('code'); setFormData({ ...formData, password: '', confirmPassword: '' }); setError(''); }} className={secondaryButtonClasses}>
                  بازگشت
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <footer className="mt-4 pt-4 border-t border-border/40 text-center">
            <p className="text-foreground/70 text-sm">
              حسابی دارید؟{' '}
              <Link href="/signin" className="text-accent hover:text-accent/80 font-bold transition-colors duration-300">
                ورود به پنل
              </Link>
            </p>
          </footer>
        </div>
      </main>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}