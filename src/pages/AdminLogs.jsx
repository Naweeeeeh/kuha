import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLogs() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLogs(); }, []);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setRequests(data || []);
        } catch (err) {
            console.error('Error fetching admin logs', err);
        }
        setLoading(false);
    };

    return (
        <section className="bg-white py-16 px-4 border-y border-[#8DA750]/30 flex-1 flex flex-col justify-center">
            <div className="container max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <ShieldAlert size={14} /> Secretary Access Only
                    </div>
                    <h2 className="font-heading text-3xl md:text-5xl font-black text-slate-900 flex items-center justify-center gap-3 mb-4">
                        Admin Dashboard
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-2xl mx-auto">
                        Secure logbook for the barangay secretary. View complete details regarding all document requests.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-[#142C14]/10 border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Decrypting logs...</div>
                    ) : (
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest rounded-tl-xl">Requester</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Age/Purok</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purpose</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Method</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest rounded-tr-xl">Status</th>
                                </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-[#142C14]/80">
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b border-slate-50 hover:bg-[#E4EB9C]/10 transition-colors">
                                        <td className="p-4 font-black text-[#142C14]">{req.full_name}</td>
                                        <td className="p-4 text-slate-500">{req.age} • {req.purok}</td>
                                        <td className="p-4">{req.purpose}</td>
                                        <td className="p-4 text-xs font-mono text-slate-400">{req.email}</td>
                                        <td className="p-4">
                        <span className="inline-flex px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                          {req.fulfillment_method}
                        </span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                        <span className="inline-flex px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#E4EB9C]/40 text-[#2D5128]">
                          {req.status}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}