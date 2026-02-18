import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Trash2, X, AlertTriangle } from 'lucide-react';

const TransactionList = () => {
    const { transactions, deleteTransaction, categories } = useContext(GlobalContext);
    const [showModal, setShowModal] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    const getCategoryColor = (catName) => {
        const category = categories.find(c => c.name === catName);
        return category ? category.color : '#9CA3AF'; // Default gray
    };

    const handleDelete = (id, text) => {
        setTransactionToDelete({ id, text });
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (transactionToDelete) {
            deleteTransaction(transactionToDelete.id);
            setShowModal(false);
            setTransactionToDelete(null);
        }
    };

    return (
        <>
            <ul className="space-y-3">
                {transactions.map((transaction) => (
                    <li
                        key={transaction.id}
                        className="flex justify-between items-center bg-white px-4 py-4 rounded-lg border-2 border-slate-900 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-transform"
                    >
                        <div>
                            <div className="font-semibold text-slate-900">{transaction.text}</div>
                            <div className="text-xs text-slate-600 flex gap-2">
                                <span>{transaction.category}</span>
                                <span>•</span>
                                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-sm text-red-600">
                                -₹{Math.abs(transaction.amount).toFixed(2)}
                            </span>
                            <button
                                onClick={() => handleDelete(transaction.id, transaction.text)}
                                className="text-red-600 hover:text-red-700 transition-colors p-1 border-2 border-slate-900 rounded-full bg-red-50"
                                aria-label="Delete transaction"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </li>
                ))}
                {transactions.length === 0 && (
                    <p className="text-slate-500 text-center py-8">
                        No transactions found.
                    </p>
                )}
            </ul>

            {/* Neo-Brutalist Delete Confirmation Modal */}
            {showModal && transactionToDelete && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="animate-modal-in bg-white border-2 border-slate-900 rounded-lg shadow-2xl max-w-sm w-full p-5 relative">
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
                            Delete Transaction?
                        </h3>

                        {/* Message */}
                        <p className="text-slate-700 text-center mb-4 font-medium text-sm">
                            Are you sure you want to delete<br />
                            <span className="font-black text-red-600">"{transactionToDelete.text}"</span>?
                            <br />
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
                                onClick={confirmDelete}
                                className="flex-1 py-2 bg-red-600 text-white font-bold border-2 border-slate-900 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionList;
