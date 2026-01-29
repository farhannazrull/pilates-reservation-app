"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { Loader2, Calendar, Clock, MapPin, CreditCard, ChevronRight, CheckCircle2, User, QrCode, Building, Globe, History, RefreshCcw, Sun, Moon, Mail, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import 'react-day-picker/dist/style.css';

import { useRouter } from 'next/navigation';

// --- Types ---
type Court = { id: string; name: string; };
type TimeSlot = { id: string; startTime: string; endTime: string; };
type AvailabilityResponse = {
  courts: Court[];
  timeSlots: TimeSlot[];
  bookedSlots: string[];
};

const translations = {
  en: {
    newReservation: "New Reservation",
    backToDashboard: "Back to Dashboard",
    stepDate: "Date",
    stepTime: "Time",
    stepRoom: "Studio",
    stepReview: "Review",
    support: "Support",
    viewHistory: "View History",
    resetSystem: "Reset System",
    selectDate: "Select Date",
    selectTime: "Select Time",
    selectRoom: "Select Room",
    checkout: "Checkout",
    changeDate: "Change Date",
    changeTime: "Change Time",
    changeRoom: "Change Room",
    totalAmount: "Total Amount",
    currency: "Currency",
    fullName: "Full Name",
    emailAddress: "Email Address",
    paymentMethod: "Payment Method",
    cardInfo: "Card Information",
    scanning: "Scanning...",
    simulateQR: "Simulate Scan QR",
    paid: "PAID",
    verifying: "Verifying...",
    simulateTransfer: "Simulate Bank Transfer",
    transferVerified: "Transfer Verified",
    confirmBooking: "Confirm Booking",
    bookingConfirmed: "Booking Confirmed",
    bookingSuccessMsg: "Your reservation for {date} has been successfully processed. A confirmation email has been sent to {email}.",
    reference: "Reference",
    amountPaid: "Amount Paid",
    bookAnother: "Book another session",
    bookingHistory: "Booking History",
    noBookings: "No bookings found.",
    close: "Close",
    nextStep: "Next Step",
    accName: "a.n. Mohammad Farhan Nazrul Ilhami",
    errors: {
      name: "Name cannot contain numbers",
      email: "Invalid email",
      card: "Incomplete card",
      cardFormat: "Invalid card format",
      expiry: "Invalid expiry",
      cvc: "Invalid CVC",
      numbersOnly: "Numbers only",
      digitsOnly: "Digits only"
    }
  },
  id: {
    newReservation: "Reservasi Baru",
    backToDashboard: "Kembali ke Dashboard",
    stepDate: "Tanggal",
    stepTime: "Waktu",
    stepRoom: "Studio",
    stepReview: "Review",
    support: "Dukungan",
    viewHistory: "Lihat Riwayat",
    resetSystem: "Reset Sistem",
    selectDate: "Pilih Tanggal",
    selectTime: "Pilih Waktu",
    selectRoom: "Pilih Ruangan",
    checkout: "Checkout",
    changeDate: "Ubah Tanggal",
    changeTime: "Ubah Waktu",
    changeRoom: "Ubah Ruangan",
    totalAmount: "Total Pembayaran",
    currency: "Mata Uang",
    fullName: "Nama Lengkap",
    emailAddress: "Alamat Email",
    paymentMethod: "Metode Pembayaran",
    cardInfo: "Informasi Kartu",
    scanning: "Memindai...",
    simulateQR: "Simulasi Scan QR",
    paid: "LUNAS",
    verifying: "Memverifikasi...",
    simulateTransfer: "Simulasi Transfer Bank",
    transferVerified: "Transfer Terverifikasi",
    confirmBooking: "Konfirmasi Pesanan",
    bookingConfirmed: "Pemesanan Berhasil",
    bookingSuccessMsg: "Reservasi Anda untuk tanggal {date} telah berhasil diproses. Email konfirmasi telah dikirim ke {email}.",
    reference: "Referensi",
    amountPaid: "Total Dibayar",
    bookAnother: "Pesan sesi lain",
    bookingHistory: "Riwayat Pesanan",
    noBookings: "Riwayat tidak ditemukan.",
    close: "Tutup",
    nextStep: "Lanjut",
    accName: "a.n. Mohammad Farhan Nazrul Ilhami",
    errors: {
      name: "Nama tidak boleh mengandung angka",
      email: "Email tidak valid",
      card: "Kartu tidak lengkap",
      cardFormat: "Format kartu tidak valid",
      expiry: "Masa berlaku tidak valid",
      cvc: "CVC tidak valid",
      numbersOnly: "Hanya angka",
      digitsOnly: "Hanya digit"
    }
  }
};

export default function BookingPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | 'auto'>('auto');

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('lang') as 'en' | 'id';
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'id' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = translations[lang];

  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const fullCardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fullCardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target instanceof HTMLElement) {
          setCardHeight(entry.target.offsetHeight);
        }
      }
    });
    observer.observe(fullCardRef.current);
    return () => observer.disconnect();
  }, []);

  const nextStep = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep(prev => prev + 1);
      setAnimating(false);
    }, 200);
  };

  const prevStep = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep(prev => prev - 1);
      setAnimating(false);
    }, 200);
  };
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined);
  const [court, setCourt] = useState<Court | undefined>(undefined);
  
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{date: string, time: string, studio: string}[]>([]);

  useEffect(() => {
      if (showHistory) {
          fetch('https://larithmic-sina-nondigestible.ngrok-free.dev/api/bookings', { headers: { 'ngrok-skip-browser-warning': 'true' } })
            .then(res => res.json())
            .then(data => setHistory(data || []))
            .catch(err => console.error(err));
      }
  }, [showHistory]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qris' | 'transfer'>('card');
  const [isPaid, setIsPaid] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const changePaymentMethod = (method: 'card' | 'qris' | 'transfer') => {
      setPaymentMethod(method);
      setIsPaid(false);
      setErrors({});
  };

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validateCard = (val: string) => /^\d{4} \d{4} \d{4} \d{4}$/.test(val);
  const validateExpiry = (val: string) => {
    if (!/^\d{2}\/\d{2}$/.test(val)) return false;
    const [month, year] = val.split('/').map(Number);
    const now = new Date();
    const currYear = now.getFullYear() % 100;
    const currMonth = now.getMonth() + 1;
    if (month < 1 || month > 12) return false;
    if (year < currYear || (year === currYear && month < currMonth)) return false;
    return true;
  };
  const validateCvc = (val: string) => /^\d{3,4}$/.test(val);

  // Input Handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (/[0-9]/.test(val)) {
        setErrors(prev => ({ ...prev, name: t.errors.name }));
    } else {
        setErrors(prev => { const newErr = { ...prev }; delete newErr.name; return newErr; });
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.value;
    const digitsOnly = original.replace(/\D/g, '');
    
    if (original.length > 0 && original.replace(/\s/g, '').match(/[^\d]/)) {
        setErrors(prev => ({ ...prev, card: t.errors.numbersOnly }));
    } else {
        setErrors(prev => { const newErr = { ...prev }; delete newErr.card; return newErr; });
    }

    let val = digitsOnly.substring(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(val);
    
    if (val.length === 19 && !validateCard(val)) {
        setErrors(prev => ({ ...prev, card: t.errors.cardFormat }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.value;
    const digitsOnly = original.replace(/\D/g, '');

    if (original.length > 0 && original.replace(/\//g, '').match(/[^\d]/)) {
        setErrors(prev => ({ ...prev, expiry: t.errors.numbersOnly }));
    } else {
        setErrors(prev => { const newErr = { ...prev }; delete newErr.expiry; return newErr; });
    }

    let val = digitsOnly.substring(0, 4);
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
    setExpiry(val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.value;
    const digitsOnly = original.replace(/\D/g, '');

    if (original.length > 0 && original.match(/[^\d]/)) {
        setErrors(prev => ({ ...prev, cvc: t.errors.digitsOnly }));
    } else {
        setErrors(prev => { const newErr = { ...prev }; delete newErr.cvc; return newErr; });
    }

    const val = digitsOnly.substring(0, 4);
    setCvc(val);
  };
  
  // Currency State
  const [currency, setCurrency] = useState('USD');
  const rates: Record<string, number> = { USD: 1, EUR: 0.92, IDR: 15500 };
  const symbols: Record<string, string> = { USD: '$', EUR: '€', IDR: 'Rp ' };
  
  const getPrice = () => {
    const basePrice = 35;
    const price = basePrice * rates[currency];
    return currency === 'IDR' 
       ? `${symbols[currency]}${price.toLocaleString('id-ID')}` 
       : `${symbols[currency]}${price.toFixed(2)}`;
  };

  // Fetch availability
  useEffect(() => {
    if (date) {
      setLoading(true);
      const dateStr = format(date, 'yyyy-MM-dd');
      fetch(`/api/availability?date=${dateStr}`)
        .then(res => res.json())
        .then(data => {
          setAvailability(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch availability", err);
          setLoading(false);
        });
    }
  }, [date]);

  const handleBook = async () => {
    // Final Validation Check
    const newErrors: Record<string, string> = {};
    if (!validateEmail(email)) newErrors.email = t.errors.email;
    
    if (paymentMethod === 'card') {
        if (cardNumber.length < 19) newErrors.card = t.errors.card;
        if (!validateExpiry(expiry)) newErrors.expiry = t.errors.expiry;
        if (!validateCvc(cvc)) newErrors.cvc = t.errors.cvc;
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!date || !timeSlot || !court || !name || !email) return;
    setBookingLoading(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: format(date, 'yyyy-MM-dd'),
          timeSlotId: timeSlot.id,
          courtId: court.id,
          userName: name,
          email: email
        })
      });
      if (res.ok) setStep(5);
      else alert("Booking failed. The slot might have been taken.");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error processing booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const isSlotAvailable = (tSlot: TimeSlot, crt: Court) => {
    if (!availability) return false;
    const key = `${crt.id}_${tSlot.id}`;
    return !availability.bookedSlots.includes(key);
  };

  const isTimeSlotBookable = (tSlot: TimeSlot) => {
    if (!availability) return false;
    return availability.courts.some(c => isSlotAvailable(tSlot, c));
  };

  const steps = [
      { id: 1, label: t.stepDate, icon: Calendar },
      { id: 2, label: t.stepTime, icon: Clock },
      { id: 3, label: t.stepRoom, icon: MapPin },
      { id: 4, label: t.stepReview, icon: CreditCard },
  ];

  return (
    <div className={clsx(
        "min-h-screen flex flex-col items-center justify-start pt-16 px-4 pb-12 bg-theme relative text-theme transition-all duration-300",
        isExiting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
    )}>
      
      {/* Header & Controls */}
      <div className="w-full max-w-4xl mb-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
          <Link href="/" onClick={handleDashboardClick} className="inline-block text-center sm:text-left hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-bold tracking-tighter">
                diro<span className="font-light opacity-50">pilates</span>
            </h1>
            <p className="text-muted-theme text-xs mt-1 font-medium tracking-wide uppercase opacity-70">{t.newReservation}</p>
          </Link>

          <div className="flex gap-2">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-card-theme border border-theme rounded-full text-muted-theme hover:text-theme transition-all shadow-sm"
            >
              {mounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-1 bg-card-theme border border-theme rounded-full text-[10px] font-bold text-muted-theme hover:text-theme transition-all shadow-sm uppercase tracking-widest"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'en' ? 'English' : 'Indonesia'}</span>
            </button>
            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden p-2 bg-card-theme border border-theme rounded-full text-muted-theme hover:text-theme transition-all shadow-sm"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-card-theme border-l border-theme p-6 shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-theme rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
               <button 
                  onClick={() => { setShowMobileMenu(false); setShowHistory(true); }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-theme hover:bg-theme/80 transition-colors flex items-center gap-3 font-medium"
               >
                  <History className="w-5 h-5 text-accent" />
                  {t.viewHistory}
               </button>
               <button 
                  onClick={() => {
                      if(confirm('Reset all bookings?')) {
                          fetch('/api/reset', { method: 'POST' })
                            .then(() => window.location.reload());
                      }
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-theme hover:bg-theme/80 transition-colors flex items-center gap-3 font-medium text-muted-theme"
               >
                  <RefreshCcw className="w-5 h-5" />
                  {t.resetSystem}
               </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-theme">
               <p className="text-xs text-muted-theme uppercase tracking-wider mb-4">{t.support}</p>
               <p className="text-sm font-medium mb-1">+62 851-5614-5982</p>
               <p className="text-sm text-muted-theme">farhanilhamni@gmail.com</p>
            </div>
          </div>
        </div>
      )}

      <div 
        className="w-full max-w-4xl professional-card overflow-hidden bg-card-theme border-theme transition-[height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ height: cardHeight !== 'auto' ? `${cardHeight}px` : 'auto' }}
      >
         <div ref={fullCardRef} className="flex flex-col md:flex-row w-full min-h-[500px]">
         
         {/* Sidebar Progress (Desktop) */}
         <div className="hidden md:flex w-64 bg-theme border-r border-theme flex-col p-6 relative">
            <div className="mb-8">
                <Link href="/" onClick={handleDashboardClick} className="text-xs font-bold text-muted-theme hover:text-theme uppercase tracking-wider flex items-center gap-2 transition-colors">
                    <ChevronRight className="w-3 h-3 rotate-180" /> {t.backToDashboard}
                </Link>
            </div>
            <div className="space-y-6">
               {steps.map((s, idx) => {
                   const canNav = step !== 5 && (s.id === 1 || (s.id === 2 && date) || (s.id === 3 && date && timeSlot) || (s.id === 4 && date && timeSlot && court));
                   return (
                       <button 
                            key={s.id} 
                            onClick={() => { if (canNav) { setAnimating(true); setTimeout(() => { setStep(s.id); setAnimating(false); }, 200); } }}
                            disabled={!canNav}
                            className={clsx(
                                "relative flex items-center gap-3 w-full text-left transition-opacity", 
                                step === s.id ? "opacity-100 cursor-default" : canNav ? "opacity-100 cursor-pointer hover:opacity-80" : "opacity-40 cursor-not-allowed"
                            )}
                        >
                           {idx !== steps.length - 1 && (
                               <div className={clsx("absolute left-3.5 top-8 w-0.5 h-6 transition-colors", step > s.id ? "bg-accent" : "bg-muted/30")}></div>
                           )}
                           <div className={clsx(
                               "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors",
                               step === s.id ? "bg-accent text-white border-accent shadow-sm shadow-accent/20" :
                               step > s.id ? "bg-slate-200 dark:bg-slate-800 text-white border-transparent" : "bg-transparent text-muted-theme border-theme"
                           )}>
                               {step > s.id ? <CheckCircle2 className="w-4 h-4 text-white"/> : s.id}
                           </div>
                           <span className={clsx("text-sm font-medium", step === s.id ? "" : "text-muted-theme")}>{s.label}</span>
                       </button>
                   );
               })}
            </div>

            <div className="mt-auto pt-6 border-t border-theme">
               <div className="text-xs font-semibold text-muted-theme uppercase tracking-wider mb-2">{t.support}</div>
               <p className="text-xs text-muted-theme font-medium">+62 851-5614-5982</p>
               <p className="text-xs text-muted-theme mb-4">farhanilhamni@gmail.com</p>
               <div className="flex flex-col gap-2">
                   <button 
                      onClick={() => setShowHistory(true)}
                      className="text-[10px] bg-theme hover:bg-theme/80 text-theme-foreground px-2 py-1.5 rounded border border-theme transition-colors w-full text-left font-medium flex items-center gap-2"
                   >
                      <History className="w-3 h-3" />
                      {t.viewHistory}
                   </button>
                   <button 
                      onClick={() => {
                          if(confirm('Reset all bookings?')) {
                              fetch('/api/reset', { method: 'POST' })
                                .then(() => window.location.reload());
                          }
                      }}
                      className="text-[10px] bg-theme/50 hover:bg-theme/80 text-muted-theme px-2 py-1.5 rounded border border-theme transition-colors w-full text-left flex items-center gap-2"
                   >
                      <RefreshCcw className="w-3 h-3" />
                      {t.resetSystem}
                   </button>
               </div>
            </div>
         </div>

         {/* Mobile Progress Bar */}
         <div className="md:hidden w-full bg-theme border-b border-theme p-4 flex justify-between items-center relative">
             <div className="flex items-center gap-3">
                {step > 1 && step < 5 && (
                    <button onClick={prevStep} className="p-1 -ml-1 text-muted-theme hover:text-theme transition-colors">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                )}
                <span className="text-sm font-bold">{lang === 'en' ? `Step ${step} of 5` : `Tahap ${step} dari 5`}</span>
             </div>
             <Link href="/" onClick={handleDashboardClick} className="text-xs font-bold text-muted-theme hover:text-theme uppercase tracking-wider">{lang === 'en' ? 'Exit' : 'Keluar'}</Link>
         </div>
         
         <div className="md:hidden w-full border-b border-theme py-4 px-6 flex justify-center">
             <div className="w-full max-w-sm flex gap-1.5">
                 {[1,2,3,4,5].map(i => <div key={i} className={clsx("h-1 flex-1 rounded-full transition-colors", step >= i ? "bg-accent" : "bg-muted/30")}></div>)}
             </div>
         </div>

         {/* Main Content */}
         <div 
            ref={contentRef}
            className={clsx(
             "flex-1 p-6 sm:p-10 flex flex-col relative transition-all duration-300",
             animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
         )}>
            
            {/* STEP 1: DATE */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-muted-theme"/> {t.selectDate}
                    </h2>
                    <div className="w-full">
                         <div className="p-4 sm:p-8 border border-theme rounded-3xl bg-card-theme shadow-sm w-full">
                            <style>{`
                                .rdp-root { width: 100% !important; margin: 0 !important; }
                                .rdp-months, .rdp-month, .rdp-month_grid { width: 100% !important; }
                                .rdp-month_grid { border-collapse: separate !important; border-spacing: 4px !important; table-layout: fixed !important; }
                                .rdp-day_button { 
                                    width: 100% !important; 
                                    height: 44px !important; 
                                    border-radius: 10px !important; 
                                    display: flex !important; 
                                    align-items: center !important; 
                                    justify-content: center !important; 
                                    background: transparent !important;
                                    border: 1px solid transparent !important;
                                    color: inherit !important;
                                    font-size: 0.875rem !important;
                                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                                }
                                .rdp-day_button:hover {
                                    transform: translateY(-2px);
                                    background-color: rgba(0,0,0,0.02) !important;
                                }
                                [data-theme='dark'] .rdp-day_button:hover {
                                    background-color: rgba(255,255,255,0.05) !important;
                                }
                                .rdp-selected .rdp-day_button { 
                                    background-color: #f1f5f9 !important; 
                                    border-color: #0f172a !important; 
                                    color: #0f172a !important; 
                                    font-weight: 700 !important;
                                    transform: scale(1.05) translateY(-2px);
                                }
                                [data-theme='dark'] .rdp-selected .rdp-day_button {
                                    background-color: rgba(51, 65, 85, 0.2) !important;
                                    border-color: #64748b !important;
                                    color: #f8fafc !important;
                                }
                                .rdp-today:not(.rdp-selected) .rdp-day_button {
                                    border-color: #94a3b8 !important;
                                    color: #0f172a !important;
                                    font-weight: 700 !important;
                                }
                                [data-theme='dark'] .rdp-today:not(.rdp-selected) .rdp-day_button {
                                    border-color: #475569 !important;
                                    color: #3b82f6 !important;
                                }
                                .rdp-head_cell { 
                                    text-align: center !important; 
                                    color: #94a3b8 !important; 
                                    font-size: 0.7rem !important; 
                                    font-weight: 600 !important; 
                                    text-transform: uppercase !important; 
                                    padding-bottom: 8px !important;
                                }
                                .rdp-month_caption { 
                                    display: flex !important;
                                    justify-content: center !important;
                                    align-items: center !important;
                                    padding: 8px 0 24px 0 !important;
                                    width: 100% !important;
                                }
                                .rdp-caption_label { 
                                    font-weight: 700 !important; 
                                    font-size: 1.125rem !important;
                                    display: flex !important;
                                    justify-content: center !important;
                                    width: auto !important;
                                    margin: 0 auto !important;
                                }
                                .rdp-nav { 
                                    position: absolute !important; 
                                    top: 10px !important; 
                                    left: 0 !important;
                                    width: 100% !important; 
                                    display: flex !important; 
                                    justify-content: space-between !important; 
                                    padding: 0 16px !important;
                                    z-index: 10 !important;
                                }
                                .rdp-button_next, .rdp-button_previous { 
                                    width: 32px !important; 
                                    height: 32px !important; 
                                    border-radius: 50% !important; 
                                    color: #94a3b8 !important;
                                    transition: all 0.2s ease !important;
                                }
                                .rdp-button_next:hover, .rdp-button_previous:hover {
                                    background-color: rgba(0,0,0,0.05) !important;
                                    color: #0f172a !important;
                                }
                                [data-theme='dark'] .rdp-button_next:hover, [data-theme='dark'] .rdp-button_previous:hover {
                                    background-color: rgba(255,255,255,0.1) !important;
                                    color: #f8fafc !important;
                                }
                                .rdp-month_caption { padding-bottom: 20px !important; }
                            `}</style>
                            <DayPicker
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                locale={lang === 'id' ? idLocale : undefined}
                                disabled={{ before: new Date() }}
                                showOutsideDays
                                className="w-full"
                            />
                         </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={nextStep}
                            disabled={!date}
                            className="bg-accent text-accent-foreground px-6 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-accent/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                             {t.nextStep} <ChevronRight className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: TIME */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-muted-theme"/> {t.selectTime}
                            </h2>
                            <p className="text-[10px] text-muted-theme font-medium ml-7 uppercase tracking-wider">Timezone: Asia/Jakarta (WIB)</p>
                        </div>
                        <button onClick={() => { setAnimating(true); setTimeout(() => { setStep(1); setAnimating(false); }, 200); }} className="text-sm text-[#0f172a] dark:text-blue-400 font-bold hover:opacity-80 transition-opacity underline-offset-4 hover:underline">{t.changeDate}</button>
                    </div>

                    {loading ? (
                         <div className="flex-1 flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-theme/40"/></div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(availability?.timeSlots || []).map((ts) => {
                                const available = isTimeSlotBookable(ts);
                                const isSelected = timeSlot?.id === ts.id;
                                return (
                                    <button
                                        key={ts.id}
                                        disabled={!available}
                                        onClick={() => setTimeSlot(ts)}
                                        className={clsx(
                                            "px-4 py-3 rounded-lg text-sm font-medium border text-center transition-all",
                                            isSelected 
                                                ? "bg-accent text-white border-accent shadow-md shadow-accent/20"
                                                : available 
                                                    ? "bg-card-theme border-theme text-theme hover:border-accent hover:bg-accent/5" 
                                                    : "opacity-20 cursor-not-allowed"
                                        )}
                                    >
                                        {ts.startTime}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={nextStep}
                            disabled={!timeSlot}
                            className="bg-accent text-accent-foreground px-6 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-accent/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                             {t.nextStep} <ChevronRight className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: COURT */}
            {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                             <MapPin className="w-5 h-5 text-muted-theme"/> {t.selectRoom}
                        </h2>
                        <button onClick={() => { setAnimating(true); setTimeout(() => { setStep(2); setAnimating(false); }, 200); }} className="text-sm text-[#0f172a] dark:text-blue-400 font-bold hover:opacity-80 transition-opacity underline-offset-4 hover:underline">{t.changeTime}</button>
                    </div>

                    <div className="space-y-3">
                         {availability?.courts.map((c) => {
                                const available = timeSlot && isSlotAvailable(timeSlot, c);
                                const isSelected = court?.id === c.id;
                                return (
                                    <button
                                        key={c.id}
                                        disabled={!available}
                                        onClick={() => setCourt(c)}
                                        className={clsx(
                                            "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left group",
                                            isSelected
                                                ? "bg-accent text-white border-accent shadow-md shadow-accent/20"
                                                : available 
                                                    ? "bg-card-theme border-theme hover:border-accent hover:bg-accent/5" 
                                                    : "opacity-20 cursor-not-allowed"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", isSelected ? "bg-white/20 text-white" : available ? "bg-accent/10 text-accent" : "bg-theme text-muted-theme")}>
                                                {c.name.charAt(0)}
                                            </div>
                                            <span className={clsx("font-medium transition-colors", isSelected ? "text-white" : "")}>{c.name}</span>
                                        </div>
                                    </button>
                                )
                            })}
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={nextStep}
                            disabled={!court}
                            className="bg-accent text-accent-foreground px-6 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-accent/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                             {t.nextStep} <ChevronRight className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: FORM */}
            {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                             <CreditCard className="w-5 h-5 text-muted-theme"/> {t.checkout}
                        </h2>
                        <button onClick={() => { setAnimating(true); setTimeout(() => { setStep(3); setAnimating(false); }, 200); }} className="text-sm text-[#0f172a] dark:text-blue-400 font-bold hover:opacity-80 transition-opacity underline-offset-4 hover:underline">{t.changeRoom}</button>
                    </div>
                    
                    {/* Summary Box */}
                    <div className="bg-theme/50 border border-theme rounded-lg p-5 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <h3 className="text-sm font-bold mb-1">{court?.name}</h3>
                                <p className="text-sm text-muted-theme">{date && format(date, 'MMMM do, yyyy', { locale: lang === 'id' ? idLocale : undefined })} • {timeSlot?.startTime} - {timeSlot?.endTime}</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-bold leading-none">{getPrice()}</span>
                                <span className="text-[10px] font-bold text-muted-theme uppercase tracking-widest mt-1 block">{t.totalAmount}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-theme">
                            <span className="text-xs font-semibold text-muted-theme uppercase tracking-wider">{t.currency}</span>
                            <div className="flex bg-theme p-1 rounded-lg">
                                {['USD', 'EUR', 'IDR'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setCurrency(c)}
                                        className={clsx(
                                            "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                                            currency === c 
                                                ? "bg-card-theme shadow-sm" 
                                                : "text-muted-theme hover:text-theme"
                                        )}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div>
                            <label className="block text-xs font-semibold text-muted-theme mb-1.5">{t.fullName}</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-theme"/>
                                <input 
                                    type="text" 
                                    className={clsx("w-full pr-3 py-2 border rounded-md text-sm transition-all outline-none bg-theme border-theme", errors.name && "border-red-500 bg-red-500/10")}
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Farhan Nazrul"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </div>
                            {errors.name && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.name}</span>}
                         </div>
                         <div>
                            <label className="block text-xs font-semibold text-muted-theme mb-1.5">{t.emailAddress}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-theme"/>
                                <input 
                                    type="email" 
                                    className={clsx("w-full pr-3 py-2 border rounded-md text-sm transition-all outline-none bg-theme border-theme", errors.email && "!border-red-500 !bg-red-500/5")}
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="farhanilhamni@gmail.com"
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                        if(validateEmail(e.target.value)) setErrors(prev => { const newErr = {...prev}; delete newErr.email; return newErr; });
                                    }}
                                />
                            </div>
                            {errors.email && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.email}</span>}
                         </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-muted-theme mb-2">{t.paymentMethod}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['card', 'qris', 'transfer'].map((m) => (
                                <button 
                                    key={m}
                                    onClick={() => changePaymentMethod(m as any)}
                                    className={clsx("flex flex-col items-center justify-center p-3 border rounded-lg transition-all", paymentMethod === m ? "bg-accent border-accent text-white shadow-md shadow-accent/20" : "border-theme text-muted-theme hover:border-theme/80")}
                                >
                                    {m === 'card' && <CreditCard className="w-5 h-5 mb-1"/>}
                                    {m === 'qris' && <QrCode className="w-5 h-5 mb-1"/>}
                                    {m === 'transfer' && <Building className="w-5 h-5 mb-1"/>}
                                    <span className="text-[10px] font-bold uppercase">{m}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Payment Details */}
                    {paymentMethod === 'card' && (
                        <div className="border-t border-theme pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-xs font-semibold text-muted-theme mb-1.5">{t.cardInfo}</label>
                            <div className="flex flex-col gap-3">
                                <input type="text" className={clsx("w-full px-3 py-2 border rounded-md text-sm bg-theme border-theme outline-none transition-all", errors.card && "!border-red-500 !bg-red-500/5")} placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardChange} />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" className={clsx("w-full px-3 py-2 border rounded-md text-sm bg-theme border-theme outline-none transition-all", errors.expiry && "!border-red-500 !bg-red-500/5")} placeholder="MM/YY" value={expiry} onChange={handleExpiryChange} />
                                    <input type="text" className={clsx("w-full px-3 py-2 border rounded-md text-sm bg-theme border-theme outline-none transition-all", errors.cvc && "!border-red-500 !bg-red-500/5")} placeholder="123" value={cvc} onChange={handleCvcChange} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                                {errors.card && <span className="text-xs text-red-500 font-medium flex items-center gap-1">• {errors.card}</span>}
                                {errors.expiry && <span className="text-xs text-red-500 font-medium flex items-center gap-1">• {errors.expiry}</span>}
                                {errors.cvc && <span className="text-xs text-red-500 font-medium flex items-center gap-1">• {errors.cvc}</span>}
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'qris' && (
                        <div className="border-t border-theme pt-6 text-center animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="bg-white border border-slate-200 p-4 rounded-xl inline-block shadow-sm mb-4 relative overflow-hidden">
                                <img src="/qris.webp" alt="QRIS Code" className="w-32 h-32 object-contain" />
                                {isPaid && <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center text-green-600 font-bold animate-in zoom-in"><CheckCircle2 className="w-8 h-8 mb-1" />{t.paid}</div>}
                            </div>
                            {!isPaid ? (
                                <button onClick={() => { setLoading(true); setTimeout(() => { setIsPaid(true); setLoading(false); }, 1000); }} disabled={loading} className="block mx-auto text-xs bg-accent/10 text-accent dark:text-blue-300 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors font-medium">
                                    {loading ? t.scanning : t.simulateQR}
                                </button>
                            ) : <p className="text-xs text-green-600 font-medium">Payment Verified</p>}
                        </div>
                    )}

                    {paymentMethod === 'transfer' && (
                        <div className="border-t border-theme pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="bg-theme border border-theme rounded-lg p-4 space-y-3 relative overflow-hidden">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src="/bca.webp" alt="BCA" className="h-3 w-auto object-contain" />
                                        <span className="text-xs text-muted-theme block font-medium">BCA</span>
                                    </div>
                                    <span className="text-sm font-mono font-bold block">2631167405</span>
                                    <span className="text-[10px] text-muted-theme font-medium">{t.accName}</span>
                                </div>
                                {isPaid && <div className="absolute inset-0 bg-card-theme/90 flex items-center justify-center text-green-600 font-bold animate-in zoom-in gap-2"><CheckCircle2 className="w-5 h-5" />{t.transferVerified}</div>}
                            </div>
                            {!isPaid ? (
                                <button onClick={() => { setLoading(true); setTimeout(() => { setIsPaid(true); setLoading(false); }, 1500); }} disabled={loading} className="w-full mt-4 text-xs bg-accent/10 text-accent dark:text-blue-300 px-3 py-2 rounded-lg hover:bg-accent/20 transition-colors font-medium">
                                    {loading ? t.verifying : t.simulateTransfer}
                                </button>
                            ) : null}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleBook}
                            disabled={bookingLoading || !name || !email || (paymentMethod === 'card' ? !cardNumber : !isPaid)}
                            className="bg-accent text-accent-foreground px-6 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-accent/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                             {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : t.confirmBooking}
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
                <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                     <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                         <CheckCircle2 className="w-8 h-8"/>
                     </div>
                     <h2 className="text-xl font-bold mb-2">{t.bookingConfirmed}</h2>
                     <p className="text-muted-theme text-center max-w-sm text-sm mb-8">
                         {t.bookingSuccessMsg.replace('{date}', date ? format(date, 'MMMM do', { locale: lang === 'id' ? idLocale : undefined }) : '').replace('{email}', email)}
                     </p>
                     
                     <div className="bg-theme border border-theme rounded-lg p-4 w-full max-w-sm mb-8">
                         <div className="flex justify-between text-sm mb-2">
                             <span className="text-muted-theme">{t.reference}</span>
                             <span className="font-mono font-medium">#RES-{Math.floor(Math.random() * 10000)}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-muted-theme">{t.amountPaid}</span>
                             <span className="font-medium">{getPrice()}</span>
                         </div>
                     </div>

                     <button onClick={() => window.location.reload()} className="text-sm font-bold text-accent hover:underline underline-offset-4">
                        {t.bookAnother}
                    </button>
                </div>
            )}

         </div>
         </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card-theme border border-theme rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-theme flex justify-between items-center bg-theme/50">
                    <h3 className="font-bold">{t.bookingHistory}</h3>
                    <button onClick={() => setShowHistory(false)} className="text-muted-theme hover:text-theme text-2xl leading-none">&times;</button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-0">
                    {history.length === 0 ? (
                        <div className="p-8 text-center text-muted-theme text-sm">{t.noBookings}</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-theme uppercase bg-theme font-semibold sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">{t.stepDate}</th>
                                    <th className="px-6 py-3">{t.stepTime}</th>
                                    <th className="px-6 py-3">{t.stepRoom}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-theme">
                                {history.map((h, i) => (
                                    <tr key={i} className="hover:bg-theme/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{h.date}</td>
                                        <td className="px-6 py-4 text-muted-theme">{h.time}</td>
                                        <td className="px-6 py-4 text-muted-theme">{h.studio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="px-6 py-4 bg-theme/50 border-t border-theme text-right">
                    <button onClick={() => setShowHistory(false)} className="px-4 py-2 bg-card-theme border border-theme rounded text-sm font-medium hover:bg-theme">{t.close}</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}