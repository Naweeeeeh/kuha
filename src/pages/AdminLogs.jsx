import React, { useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';
import { PDFViewer } from '@react-pdf/renderer';
import { CertificatePDF } from '../components/pdf/CertificatePDF';
import { BrowserWallet, Transaction } from '@meshsdk/core';
import { motion } from 'framer-motion';
import { X, Check, RefreshCw, Eye, Printer } from 'lucide-react';

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

    const [isBatching, setIsBatching] = useState(false);
    const [needsDailyPush, setNeedsDailyPush] = useState(false);

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

    useEffect(() => {
        const checkSchedule = () => {
            const pendingCount = logs.filter(l => !l.tx_hash && l.status === 'verified').length;

            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Manila',
                hour: 'numeric',
                hour12: false
            });
            const cebuHour = parseInt(formatter.format(now), 10);

            if (cebuHour >= 8 && pendingCount > 0) {
                setNeedsDailyPush(true);
            } else {
                setNeedsDailyPush(false);
            }
        };

        checkSchedule();
        const interval = setInterval(checkSchedule, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [logs]);

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

    const verifyRequest = async (log) => {
        try {
            const { error } = await supabase
                .from('requests')
                .update({ status: 'verified', verified_at: new Date().toISOString() })
                .eq('id', log.id);

            if (error) throw error;

            setLogs(currentLogs => currentLogs.map(l =>
                l.id === log.id ? { ...l, status: 'verified', verified_at: new Date().toISOString() } : l
            ));
        } catch (err) {
            setErrorModal({ show: true, message: "Failed to verify: " + err.message });
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
                throw new Error("Blockchain Success, but Database Blocked the Save! Please disable Row Level Security (RLS) in Supabase.");
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
                setErrorModal({ show: true, message: "Network Busy: Cardano is currently minting your previous transaction. Please wait 20 seconds for the next block before submitting another document!" });
            } else {
                setErrorModal({ show: true, message: errorStr });
            }
        } finally {
            setIsTransacting(false);
        }
    };

    const pushAllPending = async () => {
        const pendingLogs = logs.filter(log => !log.tx_hash && log.status === 'verified');
        if (pendingLogs.length === 0) return;

        if (!walletAddress || !wallet) {
            setErrorModal({ show: true, message: "Please connect a Cardano wallet first." });
            return;
        }

        setIsBatching(true);
        setErrorModal({ show: false, message: '' });

        try {
            const tx = new Transaction({ initiator: wallet })
                .sendLovelace(walletAddress, "1500000");

            const batchMetadata = {};
            pendingLogs.forEach((log, index) => {
                batchMetadata[index.toString()] = [
                    `ID: ${log.id}`.substring(0, 64),
                    `Doc: ${log.document_type || 'Indigency'}`.substring(0, 64),
                    `Req: ${log.full_name}`.substring(0, 64)
                ];
            });

            tx.setMetadata(674, batchMetadata);

            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);

            for (const log of pendingLogs) {
                await supabase
                    .from('requests')
                    .update({ tx_hash: txHash, status: 'On-Chain' })
                    .eq('id', log.id);
            }

            setLogs(currentLogs => currentLogs.map(l =>
                (!l.tx_hash && l.status === 'verified') ? { ...l, tx_hash: txHash, status: 'On-Chain' } : l
            ));

            localStorage.setItem('cardano_connected_time', Date.now().toString());
            setSuccessModal({ show: true, hash: txHash });

        } catch (err) {
            console.error("Batch Error:", err);
            setErrorModal({ show: true, message: err.message || "Failed to batch transactions." });
        } finally {
            setIsBatching(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-PH', options);
    };

    return (
        <section className="bg-gradient-to-br from-emerald-50 via-stone-50 to-emerald-100/50 py-16 px-6 flex-1 min-h-[calc(100vh-70px)] selection:bg-emerald-200 selection:text-emerald-900">

            {showWalletModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-stone-200 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative overflow-hidden">
                        {/* Removed radial gradient */}
                        <button onClick={() => setShowWalletModal(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 transition-colors bg-stone-50 hover:bg-stone-100 p-2 rounded-full">
                            <X size={20} className="stroke-[3]" />
                        </button>
                        <h3 className="font-heading font-extrabold text-2xl text-stone-800 mb-2">Connect Wallet</h3>
                        <p className="text-sm text-stone-500 font-medium leading-relaxed mb-6">
                            Choose your preferred Cardano wallet to sign transactions securely.
                        </p>

                        <div className="flex flex-col gap-3 relative z-10">
                            {availableWallets.length === 0 ? (
                                <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold text-center border border-amber-200">
                                    No Cardano wallets detected. Please install a wallet extension like Lace, Nami, or Eternl.
                                </div>
                            ) : (
                                availableWallets.map(w => (
                                    <button
                                        key={w.name}
                                        onClick={() => connectSelectedWallet(w.name)}
                                        className="w-full h-14 px-5 flex items-center justify-between rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group active:scale-[0.98] shadow-sm hover:shadow-md"
                                    >
                                        <span className="font-extrabold text-stone-800 capitalize group-hover:text-emerald-700 transition-colors">{w.name}</span>
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-stone-100 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
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
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-red-100 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="w-16 h-16 bg-red-50 flex items-center justify-center rounded-2xl mx-auto text-red-500 mb-6 shadow-inner">
                            <X size={32} className="stroke-[3]" />
                        </div>
                        <h3 className="font-heading font-extrabold text-2xl text-stone-800 mb-2">Transaction Failed</h3>
                        <p className="text-sm text-stone-500 font-medium leading-relaxed mb-8 break-words bg-stone-50 p-4 rounded-xl border border-stone-100">
                            {errorModal.message}
                        </p>
                        <button
                            onClick={() => setErrorModal({ show: false, message: '' })}
                            className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-stone-800 text-white font-bold transition-all hover:bg-black shadow-lg active:scale-[0.98]"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {successModal.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-emerald-100 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative overflow-hidden">
                        {/* Removed radial gradient */}
                        <h3 className="font-heading font-extrabold text-3xl text-stone-800 mb-2">Success!</h3>
                        <p className="text-sm text-stone-500 font-medium leading-relaxed mb-6">
                            The document record has been permanently secured on the Cardano blockchain.
                        </p>

                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 mb-6 overflow-hidden relative z-10 shadow-sm">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Transaction Hash</p>
                            <p className="font-mono text-xs text-stone-800 truncate">{successModal.hash}</p>
                        </div>

                        <div className="flex flex-col gap-3 relative z-10">
                            <a
                                href={`https://preview.cardanoscan.io/transaction/${successModal.hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white font-bold transition-all hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                            >
                                View on Explorer
                            </a>
                            <button
                                onClick={() => setSuccessModal({ show: false, hash: '' })}
                                className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-white text-stone-500 font-bold transition-all hover:bg-stone-50 border border-stone-200 hover:text-stone-800 active:scale-[0.98]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedLog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-stone-900/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-5xl h-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-stone-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center rounded-xl text-emerald-600 shadow-inner">
                                    <Printer size={24} className="stroke-[2.5]" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-extrabold text-stone-800 text-lg leading-tight">Document Print Preview</h3>
                                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-0.5">
                                        {selectedLog.document_type || 'Certificate of Indigency'} • {selectedLog.full_name}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-3 bg-white rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-stone-200">
                                <X size={20} className="stroke-[3]" />
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-stone-200 p-2 md:p-6">
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-stone-300 bg-white">
                                <PDFViewer className="w-full h-full border-none">
                                    <CertificatePDF docType={selectedLog.document_type} data={selectedLog} />
                                </PDFViewer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container max-w-7xl mx-auto w-full relative">

                {/* Removed blur gradient */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10"
                >
                    <div>
                        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-stone-800 tracking-tight">
                            Document <span className="text-emerald-500">Logs</span>
                        </h2>
                        <p className="text-stone-500 text-lg font-medium mt-3 max-w-md">
                            Manage, preview, and securely log requested certificates to the blockchain.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {!walletAddress ? (
                            <button onClick={handleConnectClick} className="flex items-center gap-2 bg-stone-800 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">
                                Connect Wallet
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-3 rounded-xl font-bold text-sm shadow-sm">
                                    <Check size={16} className="stroke-[3] text-emerald-500" />
                                    <span className="capitalize">{localStorage.getItem('cardano_wallet_name')}:</span>
                                    {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 4)}
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="p-3.5 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-white-600 hover:border-green-200 hover:bg-green-50 font-bold transition-all shadow-sm"
                                    title="Disconnect Wallet"
                                >
                                    <span className="font-bold text-xs uppercase">disconnect</span>
                                </button>
                            </div>
                        )}

                        <div className="bg-white px-6 py-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-5">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Records</span>
                                <span className="text-2xl font-black text-emerald-600 leading-none mt-0.5">{logs.length}</span>
                            </div>
                            <div className="h-10 w-px bg-stone-100"></div>

                            <div className="flex items-center gap-3">
                                <button onClick={fetchLogs} className="p-2 text-stone-400 hover:text-emerald-600 transition-colors" title="Refresh">
                                    <RefreshCw size={20} className="stroke-[2.5]" />
                                </button>

                                {logs.filter(l => !l.tx_hash && l.status === 'verified').length > 0 && (
                                    <button
                                        onClick={pushAllPending}
                                        disabled={isBatching || !walletAddress}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${needsDailyPush
                                            ? 'bg-blue-500 text-white animate-pulse hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                                            : 'bg-stone-800 text-white hover:bg-black'
                                            } disabled:opacity-50 disabled:animate-none`}
                                    >

                                        {isBatching ? 'Batching...' : `Push All Verified (${logs.filter(l => !l.tx_hash && l.status === 'verified').length})`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="bg-white rounded-[2.5rem] border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-stone-50/50 border-b-2 border-stone-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap">Resident Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap">Document Type</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap">Fulfillment</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-50 text-sm font-semibold text-stone-600">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center text-emerald-500">
                                            <div className="animate-pulse flex flex-col items-center gap-3">

                                                <span className="text-xs font-bold uppercase tracking-widest">Syncing Records...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center text-stone-400">

                                            <span className="text-sm font-medium">No document requests found.</span>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, index) => (
                                        <motion.tr
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            key={log.id}
                                            className="hover:bg-emerald-50/30 transition-colors group"
                                        >
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-lg border border-emerald-200 shadow-sm group-hover:scale-105 transition-transform">
                                                        {log.full_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-stone-800 text-base">{log.full_name}</div>
                                                        <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5 mt-1">
                                                            Purok {log.purok} • {log.age} yrs
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="inline-flex font-extrabold text-sm text-emerald-700">{log.document_type || 'Certificate of Indigency'}</span>
                                                    <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mt-1.5">Purpose: <span className="text-stone-500">{log.purpose}</span></span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex flex-col gap-2">
                                                    {log.fulfillment_method === 'digital' ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md w-fit border border-blue-200 shadow-sm">Digital</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-700 bg-orange-100 px-2.5 py-1 rounded-md w-fit border border-orange-200 shadow-sm">Physical Pickup</span>
                                                    )}
                                                    <span className="text-[10px] text-stone-400 font-bold">{formatDate(log.created_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button onClick={() => setSelectedLog(log)} className="inline-flex items-center gap-2 text-xs font-bold bg-white text-stone-600 border border-stone-200 px-4 py-2.5 rounded-xl hover:bg-stone-50 hover:text-stone-800 transition-all active:scale-95 shadow-sm">
                                                        <Eye size={16} />View
                                                    </button>

                                                    {log.tx_hash ? (
                                                        <a href={`https://preview.cardanoscan.io/transaction/${log.tx_hash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/20 px-4 py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95">
                                                            On-Chain
                                                        </a>
                                                    ) : log.status === 'pending' ? (
                                                        <button
                                                            onClick={() => verifyRequest(log)}
                                                            className="inline-flex items-center gap-2 text-xs font-bold bg-amber-500 text-white px-4 py-2.5 rounded-xl hover:bg-amber-600 transition-all active:scale-95 shadow-md"
                                                        >
                                                            <Check size={16} className="stroke-[3]" /> Verify
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => logToBlockchain(log)}
                                                            disabled={isTransacting || !walletAddress}
                                                            className="inline-flex items-center gap-2 text-xs font-bold bg-stone-800 text-white px-4 py-2.5 rounded-xl hover:bg-black transition-all disabled:opacity-50 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed active:scale-95 shadow-md"
                                                        >
                                                            {isTransacting ? 'Signing...' : 'Push to Ledger'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}