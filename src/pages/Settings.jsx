import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Trash2, ShieldAlert, AlertTriangle, X } from 'lucide-react';

const Settings = () => {
    const { transactions } = useContext(GlobalContext);
    const [showModal, setShowModal] = useState(false);

    const clearData = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleClearClick = () => {
        if (transactions.length === 0) return;
        setShowModal(true);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nb-muted">
                    Control
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Settings
                </h1>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                        Data Management
                    </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 leading-none mb-4">
                    Control Your Data
                </h2>
                <p className="text-xs text-slate-600 max-w-xs mb-6">
                    Manage your local data. All data is stored in your browser's Local Storage.
                </p>

                <div className="flex items-center justify-between border-t border-slate-900 pt-4">
                    <div>
                        <span className="block font-semibold text-slate-800">Clear All Data</span>
                        <span className="text-xs text-slate-500">
                            Remove all transactions and categories.
                        </span>
                    </div>
                    <button
                        onClick={handleClearClick}
                        disabled={transactions.length === 0}
                        className={`px-4 py-2 rounded-lg font-semibold border-2 border-slate-900 transition-colors shadow-sm flex items-center ${transactions.length === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                    >
                        Clear 
                    </button>
                </div>
            </div>

            {/* Neo-Brutalist Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-2 border-slate-900 rounded-lg shadow-2xl max-w-sm w-full p-5 relative">
                        {/* Close button */}
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>

                        {/* Warning Icon */}
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-12 bg-red-100 border-4 border-red-500 rounded-full flex items-center justify-center">
                                <AlertTriangle size={24} className="text-red-600" />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-black text-slate-900 text-center mb-2">
                            WARNING!
                        </h3>

                        {/* Message */}
                        <p className="text-slate-700 text-center mb-4 font-medium text-sm">
                            You are about to delete <span className="font-black text-red-600">ALL DATA</span>.<br />
                            This includes {transactions.length} transaction{transactions.length !== 1 && 's'} and all categories.<br />
                            <span className="text-xs text-slate-500">This action cannot be undone.</span>
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2 bg-orange-500 text-white font-bold border-2 border-slate-900 rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={clearData}
                                className="flex-1 py-2 bg-red-600 text-white font-bold border-2 border-slate-900 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="nb-card-soft flex flex-col items-start gap-3 px-6 py-5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                    About
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 leading-none">
                    PFMA v1.0.0
                </h2>
                <p className="text-xs text-nb-muted max-w-xs">
                    Built with React, Tailwind CSS, and Recharts. Offline support enabled.
                    Designed With Simplicity and Neo Brutalism.
                </p>
            </div>
        </div>
    );
};

export default Settings;
