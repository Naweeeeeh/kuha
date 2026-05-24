import React, { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function Transactions() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();

        const channel = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'requests' },
                (payload) => {
                    setRequests((currentRequests) =>
                        currentRequests.map((req) =>
                            req.id === payload.new.id ? payload.new : req
                        )
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select('id, created_at, purpose, status, tx_hash')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (err) {
            console.error('Error fetching transactions', err);
        }
        setLoading(false);
    };

    return (
        <section className="bg-gradient-to-br from-emerald-50 via-stone-50 to-emerald-100/50 min-h-[calc(100vh-70px)] py-16 px-6 flex flex-col items-center selection:bg-emerald-200 selection:text-emerald-900">
            <div className="container max-w-6xl mx-auto w-full">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 relative"
                >
                    {/* Removed decorative element */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">

                        Transparency
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-800 tracking-tight mb-6">
                        Public <span className="text-emerald-500">Ledger</span>
                    </h2>
                    <p className="text-stone-500 text-lg md:text-xl leading-relaxed font-medium max-w-2xl mx-auto">
                        Anonymized public ledger of requested documents
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden relative"
                >
                    {/* Removed inner subtle gradient */}
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4 text-emerald-500">

                            <span className="font-bold uppercase tracking-widest text-sm animate-pulse">Syncing blocks...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto no-scrollbar relative z-10">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="border-b-2 border-stone-100">
                                        <th className="p-5 text-xs font-black text-stone-400 uppercase tracking-widest">Cardano Tx Hash</th>
                                        <th className="p-5 text-xs font-black text-stone-400 uppercase tracking-widest">Date</th>
                                        <th className="p-5 text-xs font-black text-stone-400 uppercase tracking-widest">Purpose</th>
                                        <th className="p-5 text-xs font-black text-stone-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-semibold text-stone-600">
                                    {requests.map((req, index) => (
                                        <motion.tr
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            key={req.id}
                                            className="border-b border-stone-50 hover:bg-emerald-50/50 transition-colors group"
                                        >
                                            <td className="p-5 font-mono text-sm">
                                                {req.tx_hash ? (
                                                    <a
                                                        href={`https://preview.cardanoscan.io/transaction/${req.tx_hash}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors group-hover:bg-emerald-100"
                                                    >
                                                        {req.tx_hash.substring(0, 16)}...<span className="font-bold ml-1">&#8599;</span>
                                                    </a>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-stone-400 italic bg-stone-50 px-3 py-1.5 rounded-lg">
                                                        Pending Batch
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5 text-stone-500">{new Date(req.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td className="p-5">{req.purpose}</td>
                                            <td className="p-5 text-right">
                                            <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-all ${req.status === 'On-Chain' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                                                    req.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                                                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-16 text-center text-stone-400 font-medium">

                                                No transactions found in the ledger.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}