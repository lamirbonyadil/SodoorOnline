'use client'

import { useState } from 'react'
import { Home, Eye, EyeOff, User, Mail, Phone, Lock, Hash, Building } from 'lucide-react'
import Link from 'next/link'

// ===============================================
// ✅ FIX: Move InputWithIcon outside SignupPage
// ===============================================

// کامپوننت کمکی برای ورودی‌های استاندارد با آیکون
const InputWithIcon = ({ id, name, type = 'text', value, onChange, placeholder, required = false, icon: Icon, isPassword = false, showPasswordState, toggleShowPassword }) => {
    const inputClasses = "w-full bg-transparent pr-10 pl-4 py-2.5 text-base outline-none text-foreground placeholder-foreground/40 font-medium";
    const wrapperClasses = "relative flex items-center bg-white/50 backdrop-blur-sm border border-border/40 rounded-lg focus-within:border-[#00C49A] focus-within:shadow-lg transition-all duration-300";

    return (
      <div className={wrapperClasses}>
        <Icon className="absolute right-3 w-4 h-4 text-[#2A4B7C]/70" />
        <input
          type={isPassword ? (showPasswordState ? 'text' : 'password') : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClasses}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute left-2 text-primary/60 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            {showPasswordState ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        )}
      </div>
    )
  }

export default function SignupPage() {
  const [role, setRole] = useState('person')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // Person fields
    personFullname: '',
    personNid: '',
    personPhone: '',
    personEmail: '',
    personPassword: '',
    personPasswordConfirm: '',
    // Company fields
    companyName: '',
    companyId: '',
    companyPhone: '',
    companyEmail: '',
    companyPassword: '',
    companyPasswordConfirm: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (role === 'person') {
      if (formData.personPassword !== formData.personPasswordConfirm) {
        setError('رمز عبور و تکرار آن مطابقت ندارند')
        return
      }
    } else {
      if (formData.companyPassword !== formData.companyPasswordConfirm) {
        setError('رمز عبور و تکرار آن مطابقت ندارند')
        return
      }
    }
    console.log('Signup submitted:', { role, formData })
  }

  const primaryButtonClasses = 'w-full bg-gradient-to-r from-[#2A4B7C] to-[#00C49A] text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-base'
  const roleButtonClasses = (active: boolean) => `flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
    active 
      ? 'bg-gradient-to-r from-[#2A4B7C] to-[#00C49A] text-white shadow-md' 
      : 'bg-white/50 text-primary hover:bg-white/70'
  }`

  return (
    <div className="lg:fixed lg:inset-0 bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col lg:overflow-hidden min-h-screen">
      {/* Home Button */}
      <Link href="/" className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl hover:-translate-y-1" title="بازگشت به صفحه اصلی">
        <Home className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
      </Link>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:overflow-hidden overflow-y-auto">
        <div className="w-full max-w-2xl animate-fade-in" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
          {/* Logo Container */}
          <a href="/" className="text-center mb-5 group inline-block w-full">
            <div className="flex items-center justify-center mb-3">
              <img src="/images/logo.png" alt="صدورآنلاین لوگو" className="h-14 w-14 sm:h-16 sm:w-16 hover:scale-110 transition-transform duration-300" />
            </div>
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#2A4B7C] to-[#00C49A] bg-clip-text text-transparent">صدورآنلاین</p>
          </a>

          {/* Header */}
          <header className="mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">ایجاد حساب کاربری</h1>
            <p className="text-center text-foreground/60 text-sm sm:text-base">نوع حساب خود را انتخاب کنید</p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Role Selector */}
            <div className="input-wrapper">
              <label className="block text-sm font-medium text-foreground mb-2.5">نوع حساب کاربری</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('person')}
                  className={roleButtonClasses(role === 'person')}
                >
                  دانشجو
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('company')}
                  className={roleButtonClasses(role === 'company')}
                >
                  شرکت/موسسه
                </button>
              </div>
            </div>

            {/* Person Fields */}
            {role === 'person' && (
              <div className="space-y-2.5" style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Fullname */}
                  <div>
                    <label htmlFor="personFullname" className="block text-sm font-medium text-foreground mb-2">نام و نام خانوادگی</label>
                    <InputWithIcon
                      id="personFullname"
                      name="personFullname"
                      value={formData.personFullname}
                      onChange={handleChange}
                      required
                      placeholder="نام"
                      icon={User}
                    />
                  </div>
                  {/* National ID */}
                  <div>
                    <label htmlFor="personNid" className="block text-sm font-medium text-foreground mb-2">کد ملی</label>
                    <InputWithIcon
                      id="personNid"
                      name="personNid"
                      value={formData.personNid}
                      onChange={handleChange}
                      required
                      placeholder="کد ملی"
                      icon={Hash}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone */}
                  <div>
                    <label htmlFor="personPhone" className="block text-sm font-medium text-foreground mb-2">شماره تلفن</label>
                    <InputWithIcon
                      id="personPhone"
                      name="personPhone"
                      type="tel"
                      value={formData.personPhone}
                      onChange={handleChange}
                      required
                      placeholder="تلفن"
                      icon={Phone}
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label htmlFor="personEmail" className="block text-sm font-medium text-foreground mb-2">ایمیل</label>
                    <InputWithIcon
                      id="personEmail"
                      name="personEmail"
                      type="email"
                      value={formData.personEmail}
                      onChange={handleChange}
                      placeholder="ایمیل"
                      icon={Mail}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label htmlFor="personPassword" className="block text-sm font-medium text-foreground mb-2">رمز عبور</label>
                    <InputWithIcon
                      id="personPassword"
                      name="personPassword"
                      value={formData.personPassword}
                      onChange={handleChange}
                      required
                      placeholder="رمز"
                      icon={Lock}
                      isPassword
                      showPasswordState={showPassword}
                      toggleShowPassword={() => setShowPassword(!showPassword)}
                    />
                  </div>
                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="personPasswordConfirm" className="block text-sm font-medium text-foreground mb-2">تکرار رمز</label>
                    <InputWithIcon
                      id="personPasswordConfirm"
                      name="personPasswordConfirm"
                      value={formData.personPasswordConfirm}
                      onChange={handleChange}
                      required
                      placeholder="تکرار"
                      icon={Lock}
                      isPassword
                      showPasswordState={showConfirmPassword}
                      toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Company Fields */}
            {role === 'company' && (
              <div className="space-y-2.5" style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Company Name */}
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">نام شرکت</label>
                    <InputWithIcon
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      placeholder="نام شرکت"
                      icon={Building}
                    />
                  </div>
                  {/* Company ID */}
                  <div>
                    <label htmlFor="companyId" className="block text-sm font-medium text-foreground mb-2">شناسه ملی</label>
                    <InputWithIcon
                      id="companyId"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleChange}
                      required
                      placeholder="شناسه ملی"
                      icon={Hash}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Company Phone */}
                  <div>
                    <label htmlFor="companyPhone" className="block text-sm font-medium text-foreground mb-2">شماره تلفن</label>
                    <InputWithIcon
                      id="companyPhone"
                      name="companyPhone"
                      type="tel"
                      value={formData.companyPhone}
                      onChange={handleChange}
                      required
                      placeholder="تلفن"
                      icon={Phone}
                    />
                  </div>
                  {/* Company Email */}
                  <div>
                    <label htmlFor="companyEmail" className="block text-sm font-medium text-foreground mb-2">ایمیل</label>
                    <InputWithIcon
                      id="companyEmail"
                      name="companyEmail"
                      type="email"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      placeholder="ایمیل"
                      icon={Mail}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Company Password */}
                  <div>
                    <label htmlFor="companyPassword" className="block text-sm font-medium text-foreground mb-2">رمز عبور</label>
                    <InputWithIcon
                      id="companyPassword"
                      name="companyPassword"
                      value={formData.companyPassword}
                      onChange={handleChange}
                      required
                      placeholder="رمز"
                      icon={Lock}
                      isPassword
                      showPasswordState={showPassword}
                      toggleShowPassword={() => setShowPassword(!showPassword)}
                    />
                  </div>
                  {/* Company Confirm Password */}
                  <div>
                    <label htmlFor="companyPasswordConfirm" className="block text-sm font-medium text-foreground mb-2">تکرار رمز</label>
                    <InputWithIcon
                      id="companyPasswordConfirm"
                      name="companyPasswordConfirm"
                      value={formData.companyPasswordConfirm}
                      onChange={handleChange}
                      required
                      placeholder="تکرار"
                      icon={Lock}
                      isPassword
                      showPasswordState={showConfirmPassword}
                      toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            {/* Submit Button */}
            <button type="submit" className={primaryButtonClasses}>
              ثبت نام
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-4 pt-4 border-t border-border/40 text-center">
            <p className="text-foreground/70 text-sm">
              حساب کاربری دارید؟{' '}
              <Link href="/signin" className="text-[#00C49A] hover:text-[#00C49A]/80 font-bold transition-colors duration-300">
                وارد شوید
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