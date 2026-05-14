import React, { useEffect, useState } from 'react';
import { Activity, LinkIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
        <section className="bg-white py-16 px-4 border-y border-[#8DA750]/30 flex-1 flex flex-col justify-center">
            <div className="container max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">

                <div className="text-center mb-12">
                    <h2 className="font-heading text-3xl md:text-5xl font-black text-slate-900 flex items-center justify-center gap-3 mb-4">
                        Public Ledger
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-2xl mx-auto">
                        Anonymized public ledger of requested documents, secured immutably on the Cardano Preview testnet.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-[#142C14]/10 border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Syncing blocks...</div>
                    ) : (
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Hash</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purpose</th>
                                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-[#142C14]/80">
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b border-slate-50 hover:bg-[#E4EB9C]/10 transition-colors group">
                                        <td className="p-4 font-mono text-xs">
                                            {req.tx_hash ? (
                                                <a
                                                    href={`https://preview.cardanoscan.io/transaction/${req.tx_hash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    {req.tx_hash.substring(0, 12)}...<LinkIcon size={12}/>
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 italic">Pending Batch</span>
                                            )}
                                        </td>
                                        <td className="p-4">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">{req.purpose}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                                req.status === 'On-Chain' ? 'bg-blue-100 text-blue-700' :
                                                    req.status === 'verified' ? 'bg-[#E4EB9C]/40 text-[#2D5128]' : 'bg-slate-100 text-slate-500'
                                            }`}>
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