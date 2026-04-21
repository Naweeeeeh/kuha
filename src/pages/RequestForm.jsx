import React, { useState } from 'react';
import { FileText, CheckCircle2, Download, MapPin, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificatePDF } from '../components/pdf/CertificatePDF';

export default function RequestForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ fullName: '', age: '', purok: '', purpose: '', email: '', fulfillmentMethod: 'digital' });
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleNextStep = (e) => { e.preventDefault(); setStep(2); };

    const handleSendOTP = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: { shouldCreateUser: true }
            });
            if (error) throw error;
            setOtpSent(true);
        } catch (err) {
            alert("Error sending OTP: " + err.message);
        }
        setLoading(false);
    };

    const verifyOTP = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: otp,
                type: 'email'
            });
            if (error) throw error;

            // OTP verified, insert into database using your exact schema
            const { error: dbError } = await supabase.from('requests').insert([{
                full_name: formData.fullName,
                age: parseInt(formData.age),
                purok: formData.purok,
                purpose: formData.purpose,
                email: formData.email,
                fulfillment_method: formData.fulfillmentMethod,
                status: 'verified',
                verified_at: new Date().toISOString()
            }]);

            if (dbError) throw dbError;

            setStep(3);
        } catch (err) {
            alert("Verification failed: " + err.message);
        }
        setLoading(false);
    };

    const inputClass = "w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-[#2D5128] focus:border-transparent outline-none transition-all shadow-sm";
    const labelClass = "block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 leading-snug";

    return (
        <section className="bg-white py-16 px-4 border-y border-[#8DA750]/30 flex-1 flex flex-col justify-center">
            <div className="container max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4EB9C]/40 text-[#2D5128] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <FileText size={14} /> Application Portal
                    </div>
                    <h2 className="font-heading text-3xl md:text-5xl font-black text-slate-900 flex items-center justify-center gap-3">
                        Request Certificate
                    </h2>
                </div>

                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-[#142C14]/10 border border-slate-100">

                    {step === 1 && (
                        <form onSubmit={handleNextStep} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input required type="text" className={inputClass} value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>Age</label>
                                    <input required type="number" className={inputClass} value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Purok</label>
                                    <input required type="text" className={inputClass} value={formData.purok} onChange={e => setFormData({ ...formData, purok: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelClass}>Purpose</label>
                                    <input required type="text" className={inputClass} value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6 mt-6">
                                <label className={labelClass}>Email Address (For Verification)</label>
                                <input required type="email" className={inputClass} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div>
                                <label className={labelClass}>Fulfillment Method</label>
                                <select className={`${inputClass} appearance-none cursor-pointer`} value={formData.fulfillmentMethod} onChange={e => setFormData({ ...formData, fulfillmentMethod: e.target.value })}>
                                    <option value="digital">Generate Digital PDF (Download)</option>
                                    <option value="physical">Request Physical Copy (Onsite Pickup)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full h-14 mt-8 inline-flex items-center justify-center rounded-xl bg-[#2D5128] text-white font-bold transition-all hover:bg-[#142C14] hover:shadow-xl hover:shadow-[#142C14]/20 active:scale-[0.98]">
                                Proceed to Verification
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="text-center space-y-6 py-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="w-16 h-16 bg-[#E4EB9C]/40 flex items-center justify-center rounded-xl mx-auto text-[#2D5128] mb-6">
                                <ShieldAlert size={32} />
                            </div>
                            <h3 className="font-heading font-black text-2xl text-[#142C14]">Verify Identity</h3>
                            <p className="text-sm text-slate-500 font-medium">We will send an OTP code to <strong className="text-slate-800">{formData.email}</strong></p>

                            {!otpSent ? (
                                <button onClick={handleSendOTP} disabled={loading} className="w-full h-14 mt-4 inline-flex items-center justify-center rounded-xl bg-[#2D5128] text-white font-bold transition-all hover:bg-[#142C14] disabled:opacity-50 active:scale-[0.98]">
                                    {loading ? 'Sending Code...' : 'Send Verification Code'}
                                </button>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    <input type="text" placeholder="ENTER OTP" className={`${inputClass} text-center text-xl tracking-[0.5em] font-black uppercase py-4`} value={otp} onChange={e => setOtp(e.target.value)} />
                                    <button onClick={verifyOTP} disabled={loading} className="w-full h-14 inline-flex items-center justify-center rounded-xl bg-[#142C14] text-white font-bold transition-all hover:bg-black disabled:opacity-50 active:scale-[0.98]">
                                        {loading ? 'Verifying...' : 'Verify & Submit Request'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-8 py-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-[#2D5128] rounded-2xl flex items-center justify-center mx-auto text-[#E4EB9C] mb-6 shadow-xl">
                                <CheckCircle2 size={40} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-3xl text-[#142C14] mb-2">Success!</h3>
                                <p className="text-sm text-slate-500 font-medium">Your request has been securely logged.</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 mt-8">
                                {formData.fulfillmentMethod === 'digital' ? (
                                    <div className="flex flex-col items-center">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Your digital certificate is ready</p>
                                        <PDFDownloadLink document={<CertificatePDF data={formData} />} fileName={`Indigency_${formData.fullName.replace(/\s+/g, '_')}.pdf`}>
                                            {({ loading }) => (
                                                <button disabled={loading} className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center gap-3 bg-[#2D5128] text-white px-8 rounded-xl font-bold transition-all hover:bg-[#142C14] active:scale-[0.98] disabled:opacity-50">
                                                    <Download size={20} className="group-hover:-translate-y-1 transition-transform" /> {loading ? 'Generating...' : 'Download PDF Now'}
                                                </button>
                                            )}
                                        </PDFDownloadLink>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 bg-[#E4EB9C]/40 rounded-xl flex items-center justify-center text-[#2D5128] mb-4">
                                            <MapPin size={24} />
                                        </div>
                                        <h4 className="font-heading font-black text-[#142C14] text-xl mb-2">Onsite Pickup</h4>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Proceed to the Barangay Tuyom Hall during office hours. Present your valid ID upon claiming.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}