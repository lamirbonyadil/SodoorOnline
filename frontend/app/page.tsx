'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const getAnimationStyle = (delay: number = 0) => ({
    animation: `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
  })

  const primaryButtonClasses = 'relative overflow-hidden rounded-lg font-medium transition-all duration-300 ease-out active:scale-95 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
  const secondaryButtonClasses = 'relative overflow-hidden rounded-lg font-medium transition-all duration-300 ease-out active:scale-95 border border-border text-foreground hover:bg-secondary/50 hover:border-primary/50 cursor-pointer'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg transition-all duration-500">
        <nav className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer flex-shrink-0 hover:opacity-90 transition-opacity duration-300">
              <img src="/images/logo.png" alt="صدورآنلاین لوگو" className="h-8 w-8 sm:h-10 sm:w-10 hover:scale-105 transition-transform duration-300" />
              <p className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-300">صدورآنلاین</p>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden gap-6 sm:gap-8 md:flex">
              {[
                { href: '#features', label: 'ویژگی‌ها' },
                { href: '#pricing', label: 'طرح‌ها' },
                { href: '#faq', label: 'پرسش‌های متداول' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-xs sm:text-sm font-medium relative transition-colors duration-300 hover:text-primary group cursor-pointer"
                >
                  {link.label}
                  <span className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent w-0 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden gap-2 sm:gap-3 md:flex">
              <a
                href="/signin"
                className={`px-4 sm:px-5 py-2 text-sm ${secondaryButtonClasses}`}
              >
                ورود
              </a>
              <a
                href="/signup"
                className={`px-5 sm:px-6 py-2 text-sm ${primaryButtonClasses}`}
              >
                ثبت‌نام رایگان
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary hover:shadow-md rounded-lg transition-all duration-300 cursor-pointer flex-shrink-0"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 border-t border-border/40 pt-3 sm:pt-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-300">
              {[
                { href: '#features', label: 'ویژگی‌ها' },
                { href: '#pricing', label: 'طرح‌ها' },
                { href: '#faq', label: 'پرسش‌های متداول' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="block text-xs sm:text-sm font-medium hover:text-primary transition-colors duration-300 hover:translate-x-2 transform cursor-pointer px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <a
                  href="/signin"
                  className={`flex-1 px-3 sm:px-4 py-2 text-center text-xs sm:text-sm ${secondaryButtonClasses}`}
                >
                  ورود
                </a>
                <a
                  href="/signup"
                  className={`flex-1 px-3 sm:px-4 py-2 text-center text-xs sm:text-sm ${primaryButtonClasses}`}
                >
                  ثبت‌نام رایگان
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-12 sm:py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background"></div>
          </div>

          <div className="grid gap-8 sm:gap-10 lg:gap-12 md:grid-cols-2 items-center relative z-10">
            <div className="order-2 md:order-1" style={mounted ? getAnimationStyle(0) : { opacity: 0 }}>
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-balance bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent hover:to-foreground transition-all duration-500">
                صدور گواهینامه‌های آنلاین.
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">حرفه‌ای، سریع و خودکار.</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed hover:text-foreground/80 transition-colors duration-300">
                سامانه‌ای هوشمند برای موسسات آموزشی جهت صدور، مدیریت و اعتبارسنجی گواهینامه‌های
                دیجیتال. در وقت و هزینه خود صرفه‌جویی کنید و به دانشجویان خود یک تجربه مدرن هدیه
                دهید.
              </p>
              <a
                href="/signup"
                className={`inline-block px-5 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-base font-medium shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ${primaryButtonClasses}`}
              >
                شروع کنید و اولین گواهی را بسازید
              </a>
            </div>
            <div className="order-1 md:order-2 relative" style={mounted ? getAnimationStyle(0.1) : { opacity: 0 }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pic_1-MgRij6GqjmjMDR2XXxwudpyiRmRRLZ.jpg"
                alt="Certification illustration"
                className="h-48 sm:h-64 lg:h-80 w-full object-cover rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ transform: mounted ? `translateY(${scrollY * 0.1}px)` : 'none' }}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 lg:py-24 border-t border-border/40">
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold mb-8 sm:mb-12 lg:mb-16 text-center text-balance" style={mounted ? getAnimationStyle(0) : { opacity: 0 }}>
            چرا <span className="text-primary">صدورآنلاین؟</span>
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '✨',
                title: 'صدور خودکار و آنی',
                desc: 'فقط با یک کلیک و آپلود لیست دانشجویان، گواهینامه‌ها را به صورت آنی صادر کنید.',
              },
              {
                icon: '🔗',
                title: 'لینک ثبت‌نام اختصاصی',
                desc: 'برای هر دوره یک لینک منحصر به فرد ایجاد کرده و به راحتی با دانشجویان به اشتراک بگذارید.',
              },
              {
                icon: '🛡️',
                title: 'قابل استعلام و معتبر',
                desc: 'هر گواهینامه دارای کد منحصر به فرد برای اعتبارسنجی آنلاین است و اعتماد را جلب می‌کند.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-5 sm:p-6 lg:p-8 group relative overflow-hidden"
                style={mounted ? getAnimationStyle(idx * 0.15) : { opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-transparent group-hover:from-primary/5 group-hover:via-accent/5 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-3 sm:mb-4 text-3xl sm:text-4xl">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-12 sm:py-16 lg:py-24 border-t border-border/40">
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold mb-8 sm:mb-12 lg:mb-16 text-center text-balance" style={mounted ? getAnimationStyle(0) : { opacity: 0 }}>
            طرح اشتراک <span className="text-primary">متناسب با نیاز شما</span>
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'طرح برنزی',
                price: '۱۵۹,۰۰۰',
                period: 'تومان/ماهانه',
                features: [
                  { text: 'تا ۲۰۰ گواهی در ماه', included: true },
                  { text: '۳ قالب استاندارد', included: true },
                  { text: 'پشتیبانی از طریق تیکت', included: true },
                  { text: 'حذف لوگوی صدورآنلاین', included: false },
                ],
              },
              {
                name: 'طرح نقره‌ای',
                price: '۲۹۹,۰۰۰',
                period: 'تومان/ماهانه',
                popular: true,
                features: [
                  { text: 'تا ۱۰۰۰ گواهی در ماه', included: true },
                  { text: '۱۰ قالب متنوع', included: true },
                  { text: 'پشتیبانی ایمیل و تیکت', included: true },
                  { text: 'حذف لوگوی صدورآنلاین', included: true },
                ],
              },
              {
                name: 'طرح طلایی',
                price: '۴۹۹,۰۰۰',
                period: 'تومان/ماهانه',
                features: [
                  { text: 'گواهی نامحدود', included: true },
                  { text: 'قالب‌های سفارشی', included: true },
                  { text: 'پشتیبانی تلفنی و ایمیل', included: true },
                  { text: 'حذف لوگوی صدورآنلاین', included: true },
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border border-border/50 bg-card/40 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 p-5 sm:p-6 lg:p-8 relative transition-all duration-500 group ${
                  plan.popular ? 'border-primary/50 ring-1 ring-primary/20 md:scale-100 lg:scale-[1.02]' : ''
                }`}
                style={mounted ? getAnimationStyle(idx * 0.15) : { opacity: 0 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 right-3 sm:right-4 bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg animate-bounce">
                    محبوب‌ترین ⭐
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">{plan.name}</h3>
                <div className="mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{plan.price}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground mr-2">{plan.period}</span>
                </div>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li
                      key={fidx}
                      className={`flex gap-2 sm:gap-3 text-xs sm:text-sm transition-all duration-300 ${
                        feature.included ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground/60'
                      }`}
                    >
                      <span className={`flex-shrink-0 font-bold ${
                        feature.included ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {feature.included ? '✓' : '—'}
                      </span>
                      {feature.text}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`block w-full rounded-lg px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    plan.popular
                      ? primaryButtonClasses
                      : secondaryButtonClasses
                  }`}
                >
                  انتخاب طرح
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 sm:py-16 lg:py-24 border-t border-border/40">
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold mb-8 sm:mb-12 lg:mb-16 text-center text-balance" style={mounted ? getAnimationStyle(0) : { opacity: 0 }}>
            پرسش‌های <span className="text-primary">متداول</span>
          </h2>
          <div className="mx-auto max-w-2xl space-y-2 sm:space-y-3">
            {[
              {
                q: 'آیا می‌توانم لوگوی موسسه خودم را روی گواهینامه قرار دهم؟',
                a: 'بله، در طرح‌های نقره‌ای و طلایی، شما می‌توانید لوگوی خود را آپلود کرده و از آن در گواهینامه‌ها استفاده کنید.',
              },
              {
                q: 'فرآیند اعتبارسنجی گواهینامه چگونه است؟',
                a: 'هر گواهینامه یک کد QR و یک لینک منحصر به فرد دارد. هر شخصی با اسکن کردن کد یا باز کردن لینک، به یک صفحه عمومی هدایت می‌شود که صحت گواهینامه را تایید می‌کند.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-lg transition-all duration-300 overflow-hidden group"
                style={mounted ? getAnimationStyle(idx * 0.15) : { opacity: 0 }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 hover:bg-accent/5 transition-all duration-300 group-hover:bg-primary/5 cursor-pointer"
                >
                  <span className="font-semibold text-right flex-1 text-xs sm:text-sm lg:text-base group-hover:text-primary transition-colors duration-300">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-primary transition-all duration-500 ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div
                    className="border-t border-border/40 bg-secondary/30 px-4 sm:px-6 py-4 sm:py-5 animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{
                      animation: 'fadeInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    }}
                  >
                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/40 backdrop-blur-lg py-8 sm:py-12 mt-16 sm:mt-24">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground group hover:text-foreground transition-colors duration-300">© ۱۴۰۴ - تمام حقوق برای سامانه صدورآنلاین محفوظ است.</p>
        </div>
      </footer>
    </div>
  )
}
