import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldAlert, Clock, MapPin, Printer, X, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PDFViewer } from '@react-pdf/renderer';
import { CertificatePDF } from '../components/pdf/CertificatePDF';

export default function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- NEW: State to hold the log currently being previewed ---
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLogs(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-PH', options);
    };

    return (
        <section className="bg-slate-50 py-12 px-4 flex-1 relative">

            {/* --- NEW: FULL SCREEN PRINT PREVIEW MODAL --- */}
            {selectedLog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#142C14]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#E4EB9C]/40 flex items-center justify-center rounded-xl text-[#2D5128]">
                                    <Printer size={20} />
                                </div>
                                <div>
                                    <h3 className="font-heading font-black text-[#142C14] text-lg leading-tight">Document Print Preview</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {selectedLog.document_type || 'Certificate of Indigency'} • {selectedLog.full_name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-2.5 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-slate-100"
                                title="Close Preview"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* The Actual PDF Viewer Engine */}
                        <div className="flex-1 w-full bg-slate-200/50 p-2 md:p-6">
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200/60 bg-white">
                                <PDFViewer className="w-full h-full border-none">
                                    <CertificatePDF docType={selectedLog.document_type} data={selectedLog} />
                                </PDFViewer>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <div className="container max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h2 className="font-heading text-3xl md:text-5xl font-black text-[#142C14]">
                            Document Logs
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-2">
                            Manage, preview, and print requested certificates for Barangay residents.
                        </p>
                    </div>

                    <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Records</span>
                            <span className="text-xl font-black text-[#2D5128]">{logs.length}</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <button onClick={fetchLogs} className="text-sm font-bold text-[#2D5128] hover:text-[#142C14] transition-colors">
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* --- ERROR STATE --- */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-medium">
                        <ShieldAlert size={20} />
                        Failed to load logs: {error}
                    </div>
                )}

                {/* --- TABLE CONTAINER --- */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-[#142C14]/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Resident Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Document Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Fulfillment</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        <div className="animate-pulse flex flex-col items-center gap-2">
                                            <Clock size={24} className="opacity-50" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Syncing with secure database...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        <FileText size={32} className="mx-auto mb-3 opacity-20" />
                                        <span className="text-sm font-medium">No document requests found.</span>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">

                                        {/* Name & Details */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#E4EB9C]/30 flex items-center justify-center text-[#2D5128] font-black text-sm border border-[#8DA750]/20">
                                                    {log.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#142C14] text-sm">{log.full_name}</div>
                                                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                                        <MapPin size={10} /> Purok {log.purok} • {log.age} yrs
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Document Type & Purpose */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                    <span className="inline-flex font-black text-xs text-[#2D5128]">
                                                        {log.document_type || 'Certificate of Indigency'}
                                                    </span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">
                                                        Purpose: {log.purpose}
                                                    </span>
                                            </div>
                                        </td>

                                        {/* Fulfillment & Date */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1.5">
                                                {log.fulfillment_method === 'digital' ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit">
                                                            <Download size={10} /> Digital
                                                        </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit">
                                                            <MapPin size={10} /> Physical Pickup
                                                        </span>
                                                )}
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                        {formatDate(log.created_at)}
                                                    </span>
                                            </div>
                                        </td>

                                        {/* Action / Preview Button */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="inline-flex items-center gap-2 text-xs font-bold bg-[#2D5128] text-white px-4 py-2.5 rounded-lg hover:bg-[#142C14] transition-all active:scale-95 shadow-sm shadow-[#142C14]/20"
                                            >
                                                <Eye size={14} /> Preview & Print
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    );
}