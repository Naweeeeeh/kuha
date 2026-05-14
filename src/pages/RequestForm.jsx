import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Download, MapPin, ShieldAlert, Camera, UploadCloud, X, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificatePDF } from '../components/pdf/CertificatePDF';
import example2x2 from '../assets/example2x2.jpg';

export default function RequestForm() {
    const [step, setStep] = useState(1);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const [formData, setFormData] = useState({
        documentType: 'Certificate of Indigency',
        fullName: '',
        age: '',
        purok: '',
        purpose: '',
        fulfillmentMethod: 'digital',
        idImageUrl: null
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [modal, setModal] = useState({ show: false, message: '', type: 'error' });
    const showModal = (message, type = 'error') => setModal({ show: true, message, type });

    useEffect(() => {
        let interval;
        if (resendTimer > 0) interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setEmail(session.user.email);
                setStep(3);
            }
            setIsCheckingSession(false);
        };
        checkSession();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setStep(1);
        setEmail('');
        setOtp('');
        setResendTimer(0);
    };

    const validateStrictGmail = (emailString) => {
        const lowerEmail = emailString.trim().toLowerCase();
        const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!basicRegex.test(lowerEmail)) return "Please enter a valid email format.";
        if (!lowerEmail.endsWith('@gmail.com')) return "To ensure you receive your OTP, this portal strictly requires a valid @gmail.com address.";
        return null;
    };

    const handleSendOTP = async (e) => {
        if (e) e.preventDefault();
        if (!email) return;

        const emailWarning = validateStrictGmail(email);
        if (emailWarning) return showModal(emailWarning, "error");

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({ email: email, options: { shouldCreateUser: true } });
            if (error) throw error;
            setStep(2);
            setResendTimer(60);
        } catch (err) {
            showModal("Error sending OTP: " + err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.verifyOtp({ email: email, token: otp, type: 'email' });
            if (error) throw error;
            setStep(3);
        } catch (err) {
            showModal("Invalid OTP. Please check your email and try again." + err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const submitRequest = async (e) => {
        e.preventDefault();

        if (!imageFile) return showModal("A 2x2 ID picture is strictly required to process your document.", "error");
        if (!formData.age || parseInt(formData.age, 10) < 0) return showModal("Invalid age.", "error");

        setLoading(true);
        try {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `public/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('id_pictures').upload(filePath, imageFile);
            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from('id_pictures').getPublicUrl(filePath);
            const uploadedImageUrl = publicUrlData.publicUrl;

            const { error: dbError } = await supabase.from('requests').insert([{
                document_type: formData.documentType,
                full_name: formData.fullName,
                age: parseInt(formData.age, 10),
                purok: formData.purok,
                purpose: formData.purpose,
                email: email,
                fulfillment_method: formData.fulfillmentMethod,
                id_picture_url: uploadedImageUrl,
                status: 'verified',
                verified_at: new Date().toISOString()
            }]);

            if (dbError) throw dbError;

            setFormData(prev => ({ ...prev, idImageUrl: uploadedImageUrl }));
            setStep(4);

        } catch (err) {
            showModal("Submission failed: " + err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-[#2D5128] focus:border-transparent outline-none transition-all shadow-sm";
    const labelClass = "block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 leading-snug";
    const isSubmitDisabled = !imageFile || loading || !formData.age || parseInt(formData.age, 10) < 0;

    return (
        <section className="bg-white py-16 px-4 border-y border-[#8DA750]/30 flex-1 flex flex-col justify-center relative">

            {modal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142C14]/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-[#8DA750]/20 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="w-16 h-16 bg-[#E4EB9C]/40 flex items-center justify-center rounded-2xl mx-auto text-[#2D5128] mb-6"><ShieldAlert size={32} /></div>
                        <h3 className="font-heading font-black text-2xl text-[#142C14] mb-2">{modal.type === 'error' ? 'Action Required' : 'Notice'}</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{modal.message}</p>
                        <button onClick={() => setModal({ show: false, message: '', type: 'error' })} className="w-full h-14 inline-flex items-center justify-center rounded-xl bg-[#2D5128] text-white font-bold transition-all hover:bg-[#142C14] shadow-lg active:scale-[0.98]">
                            Understood
                        </button>
                    </div>
                </div>
            )}

            <div className="container max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4EB9C]/40 text-[#2D5128] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <FileText size={14} /> Application Portal
                    </div>
                    <h2 className="font-heading text-3xl md:text-5xl font-black text-slate-900 flex items-center justify-center gap-3">
                        Request Certificate
                    </h2>
                </div>

                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-[#142C14]/10 border border-slate-100 max-w-3xl mx-auto min-h-[400px] flex flex-col justify-center">

                    {isCheckingSession ? (
                        <div className="flex flex-col items-center justify-center text-slate-400 animate-pulse">
                            <ShieldAlert size={32} className="mb-4 opacity-50" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Checking secure session...</p>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <form onSubmit={handleSendOTP} className="text-center space-y-6 py-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-sm mx-auto w-full">
                                    <div className="w-16 h-16 bg-[#E4EB9C]/40 flex items-center justify-center rounded-xl mx-auto text-[#2D5128] mb-6"><Mail size={32} /></div>
                                    <h3 className="font-heading font-black text-2xl text-[#142C14]">Start Request</h3>
                                    <p className="text-sm text-slate-500 font-medium">Verify your email address to access the official document request forms.</p>
                                    <div className="text-left pt-4">
                                        <label className={labelClass}>Email Address</label>
                                        <input required type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full h-14 mt-4 inline-flex items-center justify-center rounded-xl bg-[#2D5128] text-white font-bold transition-all hover:bg-[#142C14] disabled:opacity-50 active:scale-[0.98]">
                                        {loading ? 'Sending Code...' : 'Send Verification Code'}
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={verifyOTP} className="text-center space-y-6 py-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-sm mx-auto w-full">
                                    <div className="w-16 h-16 bg-[#E4EB9C]/40 flex items-center justify-center rounded-xl mx-auto text-[#2D5128] mb-6"><ShieldAlert size={32} /></div>
                                    <h3 className="font-heading font-black text-2xl text-[#142C14]">Verify Identity</h3>
                                    <p className="text-sm text-slate-500 font-medium">We sent a secure code to <br/><strong className="text-slate-800">{email}</strong></p>
                                    <div className="space-y-4 pt-4 text-left">
                                        <label className={labelClass}>OTP</label>
                                        <input required type="text" placeholder="ENTER CODE" className={`${inputClass} text-center text-xl tracking-[0.5em] font-black uppercase py-4`} value={otp} onChange={e => setOtp(e.target.value)} />
                                        <button type="submit" disabled={loading} className="w-full h-14 inline-flex items-center justify-center rounded-xl bg-[#142C14] text-white font-bold transition-all hover:bg-black disabled:opacity-50 active:scale-[0.98]">
                                            {loading ? 'Verifying...' : 'Verify & Continue'}
                                        </button>
                                        <div className="flex flex-col gap-3 pt-3">
                                            <button type="button" onClick={handleSendOTP} disabled={loading || resendTimer > 0} className="w-full text-xs font-bold text-[#2D5128] hover:text-[#142C14] pt-2 uppercase tracking-widest transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                                {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code Now'}
                                            </button>
                                            <button type="button" onClick={() => setStep(1)} className="w-full text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                                                Change Email Address
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <form onSubmit={submitRequest} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                                    <div className="bg-[#E4EB9C]/20 border border-[#8DA750]/20 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">Verified Requester <CheckCircle2 className="text-[#8DA750]" size={14} /></p>
                                            <p className="font-mono text-sm font-bold text-[#2D5128] mt-0.5">{email}</p>
                                        </div>
                                        <button type="button" onClick={handleSignOut} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors border border-slate-200 hover:border-red-200 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                            Change
                                        </button>
                                    </div>

                                    <div className="bg-slate-50 border border-[#8DA750]/30 rounded-[2rem] p-6 shadow-sm">
                                        <label className={labelClass + " flex items-center gap-1 text-[#2D5128]"}>Select Document Type <span className="text-red-500 text-lg leading-none">*</span></label>
                                        <select required className={`${inputClass} appearance-none cursor-pointer text-base font-bold bg-white`} value={formData.documentType} onChange={e => setFormData({...formData, documentType: e.target.value})}>
                                            <option value="Certificate of Indigency">Certificate of Indigency</option>
                                            <option value="Good Moral Certificate">Good Moral Certificate</option>
                                            <option value="Certificate of Residency">Certificate of Residency</option>
                                            <option value="Barangay Clearance">Barangay Clearance</option>
                                            <option value="Certificate of Business Operation">Certificate of Business Operation</option>
                                        </select>
                                    </div>

                                    <div className={`p-6 rounded-[2rem] border transition-colors ${!imageFile ? 'bg-gray-100/50 border-[#2D5128]' : 'bg-slate-50/50 border-slate-100'}`}>
                                        <label className={labelClass + " mb-4 flex items-center gap-1"}>2x2 ID Picture Upload <span className="text-red-500 text-lg leading-none">*</span></label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col h-full">
                                                {!imagePreview ? (
                                                    <div className="relative w-full h-48 border-2 border-dashed border-[#8DA750]/40 rounded-2xl bg-white hover:bg-[#E4EB9C]/10 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                                                        <input required type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                        <div className="w-14 h-14 bg-[#E4EB9C]/30 rounded-full flex items-center justify-center text-[#2D5128] mb-3 group-hover:scale-110 transition-transform"><Camera size={24} /></div>
                                                        <p className="text-sm font-bold text-[#142C14]">Click or tap to upload photo</p>
                                                        <p className="text-xs text-red-600/80 font-bold mt-1 uppercase tracking-widest">Required to proceed</p>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl group">
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover object-top" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                            <button type="button" onClick={removeImage} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"><X size={20} /></button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-5 border border-slate-100 shadow-sm h-48">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Acceptable Format</p>
                                                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md border-2 border-slate-100 mb-3"><img src={example2x2} alt="Example 2x2" className="w-full h-full object-cover" /></div>
                                                <p className="text-xs text-slate-500 text-center font-medium leading-snug px-2">White background, formal attire, clear face without accessories.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClass}>Full Name</label>
                                            <input required type="text" className={inputClass} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Age</label>
                                            <input required type="number" className={inputClass} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                                            {formData.age && parseInt(formData.age, 10) < 0 && (
                                                <p className="text-red-500 text-xs font-bold mt-2">Invalid Age</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClass}>Purok</label>
                                            <select required className={`${inputClass} appearance-none cursor-pointer`} value={formData.purok} onChange={e => setFormData({...formData, purok: e.target.value})}>
                                                <option value="" disabled>Select your Purok</option>
                                                <option value="Avocado">Avocado</option>
                                                <option value="Buongon">Buongon</option>
                                                <option value="Caimito">Caimito</option>
                                                <option value="Chicos">Chicos</option>
                                                <option value="Mangga">Mangga</option>
                                                <option value="Nangka">Nangka</option>
                                                <option value="Tambis">Tambis</option>
                                                <option value="Tisa">Tisa</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Purpose</label>
                                            <input required type="text" className={inputClass} value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Fulfillment Method</label>
                                        <select className={`${inputClass} appearance-none cursor-pointer`} value={formData.fulfillmentMethod} onChange={e => setFormData({...formData, fulfillmentMethod: e.target.value})}>
                                            <option value="digital">Generate Digital PDF (Download)</option>
                                            <option value="physical">Request Physical Copy (Onsite Pickup)</option>
                                        </select>
                                    </div>

                                    <button type="submit" disabled={isSubmitDisabled} className="w-full h-14 mt-8 inline-flex items-center justify-center rounded-xl bg-[#2D5128] text-white font-bold transition-all hover:bg-[#142C14] hover:shadow-xl hover:shadow-[#142C14]/20 active:scale-[0.98] disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none">
                                        {loading ? <span className="flex items-center gap-2"><UploadCloud className="animate-bounce" size={20} /> Processing & Uploading...</span> : 'Submit Final Request'}
                                    </button>
                                </form>
                            )}

                            {step === 4 && (
                                <div className="text-center space-y-8 py-6 animate-in zoom-in-95 duration-500 w-full">
                                    <div className="w-20 h-20 bg-[#2D5128] rounded-2xl flex items-center justify-center mx-auto text-[#E4EB9C] mb-6 shadow-xl"><CheckCircle2 size={40} strokeWidth={2.5} /></div>
                                    <div>
                                        <h3 className="font-heading font-black text-3xl text-[#142C14] mb-2">Success!</h3>
                                        <p className="text-sm text-slate-500 font-medium">Your request for {formData.documentType} has been securely logged.</p>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 mt-8">
                                        {formData.fulfillmentMethod === 'digital' ? (
                                            <div className="flex flex-col items-center">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Your digital certificate is ready</p>

                                                <PDFDownloadLink
                                                    key={`${formData.documentType}-${formData.fullName}-${Date.now()}`}
                                                    document={<CertificatePDF docType={formData.documentType} data={formData} />}
                                                    fileName={`${formData.documentType.replace(/\s+/g, '_')}_${formData.fullName.replace(/\s+/g, '_')}.pdf`}
                                                >
                                                    {({ loading: pdfLoading }) => (
                                                        <button disabled={pdfLoading} className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center gap-3 bg-[#2D5128] text-white px-8 rounded-xl font-bold transition-all hover:bg-[#142C14] active:scale-[0.98] disabled:opacity-50">
                                                            <Download size={20} className="group-hover:-translate-y-1 transition-transform" /> {pdfLoading ? 'Generating...' : 'Download PDF Now'}
                                                        </button>
                                                    )}
                                                </PDFDownloadLink>

                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-14 h-14 bg-[#E4EB9C]/40 rounded-xl flex items-center justify-center text-[#2D5128] mb-4"><MapPin size={24} /></div>
                                                <h4 className="font-heading font-black text-[#142C14] text-xl mb-2">Onsite Pickup</h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs">Proceed to Tuyom Barangay Hall during office hours. Present your valid ID upon claiming.</p>

                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}