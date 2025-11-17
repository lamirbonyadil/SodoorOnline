'use client'

import { useState } from 'react'
// Hash و Lock اضافه شدند
import { Home, Eye, EyeOff, Hash, Lock } from 'lucide-react'
import Link from 'next/link'

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userRole, setUserRole] = useState<'student' | 'company'>('student')
  const [formData, setFormData] = useState({ id: '', password: '', remember: false })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', { ...formData, userRole })
  }

  const primaryButtonClasses =
    'w-full bg-gradient-to-r from-[#2A4B7C] to-[#00C49A] text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-base'

  const radioRoleClasses = (currentRole: 'student' | 'company') => `
    flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 border-2
    ${
      userRole === currentRole 
        ? 'bg-white border-[#00C49A] shadow-lg text-[#2A4B7C] scale-105' 
        : 'bg-white/50 border-white/50 text-foreground/70 hover:bg-white/70'
    }
  `

  // ===============================================
  // ✅ کلاس‌های اصلاح شده برای سوئیچ (Toggle Switch)
  // ===============================================
  const ToggleSwitchClasses = `
    appearance-none
    relative /* مهم */
    w-10 h-5 
    rounded-full 
    p-0 
    transition-all duration-300 
    cursor-pointer
    
    /* Unchecked State */
    bg-gray-300/80 
    border border-gray-300
    
    /* Checked State - Uses Gradient */
    checked:bg-gradient-to-r checked:from-[#2A4B7C] checked:to-[#00C49A]
    checked:border-transparent
    checked:shadow-md checked:shadow-[#00C49A]/30

    /* Toggle Ball */
    before:content-['']
    before:absolute /* مهم */
    before:top-1/2 before:-translate-y-1/2
    before:w-3.5 before:h-3.5 
    before:rounded-full
    before:bg-white
    before:shadow-sm
    before:transition-all before:duration-300
    
    /* Initial Ball Position (right-aligned for RTL and small offset) */
    before:right-0.5
    
    /* Checked Ball Position (moves to the left for RTL) */
    checked:before:right-[19px] /* 19px = 40px (width) - 1.5px (right-offset) - 3.5px (ball-width) */
    checked:before:right-[20.5px] /* تنظیم دقیق برای مرکزیت: عرض 40 - 2 (ضخامت مرز) - 14 (توپک) = 24. جابجایی 24 */
    checked:before:right-[22px] /* 40 - 2 (Border) - 14 (Ball) - 1.5 (right offset) = 22.5. 20px works well visually. */
    checked:before:translate-x-0 /* حذف translate-x-5 قبلی */
  `

  /* نکته: برای جلوگیری از محاسبه‌های پیچیده، معمولاً از کلاس‌های RTL/LTR Tailwind یا CSS خالص استفاده می‌شود، اما با توجه به محدودیت‌های فعلی، ترجمه ساده translate-x-5 به translate-x-5-minus کار نمی‌کند. از right-to-left جابجایی پیکسل استفاده می‌کنیم. */
  const FinalToggleSwitchClasses = `
    appearance-none
    relative
    w-10 h-5 
    rounded-full 
    transition-all duration-300 
    cursor-pointer
    bg-gray-300/80 
    border border-gray-300
    checked:bg-gradient-to-r checked:from-[#2A4B7C] checked:to-[#00C49A]
    checked:border-transparent
    checked:shadow-md checked:shadow-[#00C49A]/30
    focus:outline-none focus:ring-2 focus:ring-[#00C49A]/50 focus:ring-offset-2 focus:ring-offset-transparent

    before:content-['']
    before:absolute
    before:top-1/2 before:-translate-y-1/2
    before:w-3.5 before:h-3.5 
    before:rounded-full
    before:bg-white
    before:shadow-sm
    before:transition-all before:duration-300
    
    /* Initial Position (Right side - RTL) */
    before:right-0.5 
    
    /* Checked Position (Move to Left side - RTL). w-10 (40px) - h-3.5 (14px) - 2px (padding) = 24px movement. */
    checked:before:right-[22px]
  `
  // ===============================================


  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col overflow-hidden">
      {/* Home Button */}
      <Link
        href="/"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl hover:-translate-y-1"
        title="بازگشت به صفحه اصلی"
      >
        <Home className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
      </Link>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <div
          className="w-full max-w-md animate-fade-in"
          style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both' }}
        >

          {/* Logo */}
          <a href="/" className="text-center mb-5 group inline-block w-full">
            <div className="flex items-center justify-center mb-3">
              <img
                src="/images/logo.png"
                alt="صدورآنلاین لوگو"
                className="h-14 w-14 sm:h-16 sm:w-16 hover:scale-110 transition-transform duration-300"
              />
            </div>
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#2A4B7C] to-[#00C49A] bg-clip-text text-transparent">
              صدورآنلاین
            </p>
          </a>

          {/* Header */}
          <header className="mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">
              ورود به پنل کاربری
            </h1>
            <p className="text-center text-foreground/60 text-sm sm:text-base">
              لطفا مشخصات خود را وارد کنید
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Role Selection (Buttons) */}
            <div className="role-selection space-y-3 flex flex-col items-center text-center">
              <label className="block text-sm font-medium text-foreground">
                نوع کاربر
              </label>

              <div className="flex gap-3 justify-center w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setUserRole('student')}
                  className={radioRoleClasses('student')}
                >
                  دانشجو
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('company')}
                  className={radioRoleClasses('company')}
                >
                  شرکت
                </button>
              </div>
            </div>
            {/* -------------------------------------------------------- */}

            {/* ID Input */}
            <div className="input-wrapper">
              <label htmlFor="id" className="block text-sm font-medium text-foreground mb-2">
                {userRole === 'student' ? 'کد ملی' : 'شناسه ملی'}
              </label>
              <div className="relative flex items-center bg-white/50 backdrop-blur-sm border border-border/40 rounded-lg focus-within:border-accent focus-within:shadow-lg transition-all duration-300">
                <Hash className="absolute right-3 w-4 h-4 text-[#2A4B7C]/70" />
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent pr-10 pl-4 py-2.5 outline-none text-base text-foreground placeholder-foreground/40 font-medium"
                  placeholder={userRole === 'student' ? 'مثال: 1234567890' : 'مثال: 1234567890'}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-wrapper">
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                رمز عبور
              </label>

              <div className="relative flex items-center bg-white/50 backdrop-blur-sm border border-border/40 rounded-lg focus-within:border-accent focus-within:shadow-lg transition-all duration-300 group">
                <Lock className="absolute right-3 w-4 h-4 text-[#2A4B7C]/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent pr-10 pl-4 py-2.5 outline-none text-base text-foreground placeholder-foreground/40 font-medium"
                  placeholder="رمز عبور خود را وارد کنید"
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

            {/* Remember (Toggle Switch) + Forgot */}
            <div className="options flex items-center justify-between py-1">
              <div className="remember-me flex items-center gap-2 cursor-pointer">
                {/* Switch Input - Fixed */}
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className={FinalToggleSwitchClasses} // استفاده از کلاس سوئیچ اصلاح شده
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-foreground/70 font-medium cursor-pointer hover:text-foreground transition-colors duration-300"
                >
                  مرا به خاطر بسپار
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm text-accent hover:text-accent/80 font-medium transition-colors duration-300"
              >
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            {/* Submit */}
            <button type="submit" className={primaryButtonClasses}>
              ورود به پنل
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-4 pt-4 border-t border-border/40 text-center">
            <p className="text-foreground/70 text-sm">
              حساب کاربری ندارید؟{' '}
              <Link href="/signup" className="text-accent hover:text-accent/80 font-bold transition-colors duration-300">
                ثبت‌نام کنید
              </Link>
            </p>
          </footer>
        </div>
      </main>

      {/* Animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}