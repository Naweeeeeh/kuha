import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, MapPin, Printer, X, Eye, Wallet, Link as LinkIcon, CheckCircle2, LogOut, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PDFViewer } from '@react-pdf/renderer';
import { CertificatePDF } from '../components/pdf/CertificatePDF';
import { BrowserWallet, Transaction } from '@meshsdk/core';

export default function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);

    const [successModal, setSuccessModal] = useState({ show: false, hash: '' });
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });

    const [showWalletModal, setShowWalletModal] = useState(false);
    const [availableWallets, setAvailableWallets] = useState([]);

    const [walletAddress, setWalletAddress] = useState(() => {
        const cached = localStorage.getItem('cardano_address');
        const time = localStorage.getItem('cardano_connected_time');
        if (cached && time) {
            if (Date.now() - parseInt(time, 10) < 86400000) return cached;
        }
        return '';
    });

    const [wallet, setWallet] = useState(null);
    const [isTransacting, setIsTransacting] = useState(false);

    useEffect(() => {
        fetchLogs();
        const savedWalletName = localStorage.getItem('cardano_wallet_name');
        if (walletAddress && savedWalletName) {
            let attempts = 0;
            const poller = setInterval(async () => {
                if (window.cardano && window.cardano[savedWalletName.toLowerCase()]) {
                    clearInterval(poller);
                    try {
                        const meshWallet = await BrowserWallet.enable(savedWalletName.toLowerCase());
                        setWallet(meshWallet);
                    } catch (e) {
                        console.warn("Silent re-enable failed:", e);
                    }
                } else if (attempts > 30) {
                    clearInterval(poller);
                }
                attempts++;
            }, 100);
        }

        const channel = supabase
            .channel('admin-logs-channel')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'requests' },
                (payload) => {
                    setLogs((currentLogs) =>
                        currentLogs.map((log) =>
                            log.id === payload.new.id ? payload.new : log
                        )
                    );
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [walletAddress]);

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
            setErrorModal({ show: true, message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleConnectClick = async () => {
        try {
            const wallets = await BrowserWallet.getAvailableWallets();
            setAvailableWallets(wallets);
            setShowWalletModal(true);
        } catch (err) {
            setErrorModal({ show: true, message: "Could not detect any Cardano wallets in this browser." + err.message });
        }
    };

    const connectSelectedWallet = async (walletName) => {
        try {
            setErrorModal({ show: false, message: '' });
            const meshWallet = await BrowserWallet.enable(walletName.toLowerCase());
            setWallet(meshWallet);

            const address = await meshWallet.getChangeAddress();
            setWalletAddress(address);

            localStorage.setItem('cardano_address', address);
            localStorage.setItem('cardano_wallet_name', walletName);
            localStorage.setItem('cardano_connected_time', Date.now().toString());

            setShowWalletModal(false);

        } catch (err) {
            setShowWalletModal(false);
            setErrorModal({ show: true, message: err.message || `Failed to connect ${walletName}.` });
            disconnectWallet();
        }
    };

    const disconnectWallet = () => {
        setWallet(null);
        setWalletAddress('');
        localStorage.removeItem('cardano_address');
        localStorage.removeItem('cardano_wallet_name');
        localStorage.removeItem('cardano_connected_time');
    };

    const logToBlockchain = async (log) => {
        if (!walletAddress) {
            setErrorModal({ show: true, message: "Please connect a Cardano wallet first." });
            return;
        }

        if (walletAddress && !wallet) {
            setErrorModal({ show: true, message: "Wallet is still synchronizing. Please wait 2 seconds and try again." });
            return;
        }

        setIsTransacting(true);
        setErrorModal({ show: false, message: '' });

        try {
            const tx = new Transaction({ initiator: wallet })
                .sendLovelace(walletAddress, "1500000")
                .setMetadata(674, {
                    msg: [
                        `KuhaPortal Record: ${log.id}`,
                        `Doc: ${log.document_type || 'Indigency'}`,
                        `Purpose: ${log.purpose}`,
                        `Requested by: ${log.full_name}`,
                    ]
                });

            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);

            const { data: updatedData, error: dbError } = await supabase
                .from('requests')
                .update({ tx_hash: txHash, status: 'On-Chain' })
                .eq('id', log.id)
                .select();

            if (dbError) throw new Error(`Database Sync Failed: ${dbError.message}`);

            if (!updatedData || updatedData.length === 0) {
                throw new Error("Blockchain Success, Database Blocked.");
            }

            setLogs(currentLogs => currentLogs.map(l =>
                l.id === log.id ? { ...l, tx_hash: txHash, status: 'On-Chain' } : l
            ));

            localStorage.setItem('cardano_connected_time', Date.now().toString());
            setSuccessModal({ show: true, hash: txHash });

        } catch (err) {
            console.error("Blockchain Error Trace:", err);
            const errorStr = err.message || JSON.stringify(err);

            if (errorStr.includes("BAD_REQUEST") || errorStr.includes("Bad Request") || errorStr.includes("UTxO")) {
                setErrorModal({ show: true, message: "Network Busy, Please wait for another 20 seconds" });
            } else {
                setErrorModal({ show: true, message: errorStr });
            }
        } finally {
            setIsTransacting(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-PH', options);
    };

    return (
        <section className="bg-slate-50 py-12 px-4 flex-1 relative">

            {showWalletModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#142C14]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-slate-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative">
                        <button onClick={() => setShowWalletModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors">
                            <X size={20} strokeWidth={2.5} />
                        </button>
                        <h3 className="font-heading font-black text-2xl text-[#142C14] mb-2">Connect Wallet</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                            Choose your preferred Cardano wallet to sign transactions securely.
                        </p>

                        <div className="flex flex-col gap-3">
                            {availableWallets.length === 0 ? (
                                <div className="p-4 bg-orange-50 text-orange-700 rounded-xl text-sm font-bold text-center border border-orange-100">
                                    No Cardano wallets detected. Please install a wallet extension like Lace, Nami, or Eternl.
                                </div>
                            ) : (
                                availableWallets.map(w => (
                                    <button
                                        key={w.name}
                                        onClick={() => connectSelectedWallet(w.name)}
                                        className="w-full h-14 px-5 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 hover:border-[#8DA750] hover:bg-[#E4EB9C]/10 transition-all group active:scale-[0.98]"
                                    >
                                        <span className="font-bold text-[#142C14] capitalize">{w.name}</span>
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
                                            <img src={w.icon} alt={w.name} className="w-full h-full object-contain" />
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {errorModal.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#142C14]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-red-100 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="w-16 h-16 bg-red-50 flex items-center justify-center rounded-2xl mx-auto text-red-500 mb-6">
                            <XCircle size={32} />
                        </div>
                        <h3 className="font-heading font-black text-2xl text-slate-900 mb-2">Transaction Failed</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 break-words">
                            {errorModal.message}
                        </p>
                        <button
                            onClick={() => setErrorModal({ show: false, message: '' })}
                            className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white font-bold transition-all hover:bg-slate-800 shadow-lg active:scale-[0.98]"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {successModal.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#142C14]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-[#8DA750]/20 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <h3 className="font-heading font-black text-2xl text-[#142C14] mb-2">Transaction Successful!</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                            The document record has been permanently secured on the Cardano blockchain.
                        </p>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 overflow-hidden">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Hash</p>
                            <p className="font-mono text-xs text-[#2D5128] truncate">{successModal.hash}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <a
                                href={`https://preview.cardanoscan.io/transaction/${successModal.hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2D5128] text-white font-bold transition-all hover:bg-[#142C14] shadow-lg active:scale-[0.98]"
                            >
                                <LinkIcon size={16} /> View on Explorer
                            </a>
                            <button
                                onClick={() => setSuccessModal({ show: false, hash: '' })}
                                className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-white text-slate-500 font-bold transition-all hover:bg-slate-50 border border-slate-200 active:scale-[0.98]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedLog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#142C14]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
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
                            <button onClick={() => setSelectedLog(null)} className="p-2.5 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-slate-100">
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>
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

                    <div className="flex items-center gap-4">
                        {!walletAddress ? (
                            <button onClick={handleConnectClick} className="flex items-center gap-2 bg-[#2D5128] text-[#E4EB9C] px-5 py-3 rounded-xl font-bold hover:bg-[#142C14] transition-all shadow-md active:scale-95">
                                Connect Wallet
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-[#E4EB9C]/30 text-[#2D5128] border border-[#8DA750]/30 px-5 py-3 rounded-xl font-bold text-sm">
                                    <CheckCircle2 size={16} />
                                    <span className="capitalize">{localStorage.getItem('cardano_wallet_name')}:</span>
                                    {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 4)}
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="p-3 rounded-xl text-[#2D5128] hover:text-[#E4EB9C] hover:bg-[#2D5128] font-bold transition-all"
                                    title="Disconnect Wallet"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

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
                </div>

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
                                            <span className="text-xs font-bold uppercase tracking-widest">Syncing...</span>
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
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="inline-flex font-black text-xs text-[#2D5128]">{log.document_type || 'Certificate of Indigency'}</span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">Purpose: {log.purpose}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1.5">
                                                {log.fulfillment_method === 'digital' ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit"><Download size={10} /> Digital</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit"><MapPin size={10} /> Physical Pickup</span>
                                                )}
                                                <span className="text-[10px] text-slate-400 font-medium">{formatDate(log.created_at)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelectedLog(log)} className="inline-flex items-center gap-2 text-xs font-bold bg-[#E4EB9C]/50 text-[#142C14] px-4 py-2.5 rounded-lg hover:bg-[#E4EB9C] transition-all active:scale-95">
                                                    <Eye size={14} /> View
                                                </button>

                                                {log.tx_hash ? (
                                                    <a href={`https://preview.cardanoscan.io/transaction/${log.tx_hash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2.5 rounded-lg hover:bg-blue-100 transition-all">
                                                        <LinkIcon size={14} /> On-Chain
                                                    </a>
                                                ) : (
                                                    <button
                                                        onClick={() => logToBlockchain(log)}
                                                        disabled={isTransacting || !walletAddress}
                                                        className="inline-flex items-center gap-2 text-xs font-bold bg-[#2D5128] text-white px-4 py-2.5 rounded-lg hover:bg-[#142C14] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                                                    >
                                                        <Wallet size={14} /> {isTransacting ? 'Signing...' : 'Push to Ledger'}
                                                    </button>
                                                )}
                                            </div>
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