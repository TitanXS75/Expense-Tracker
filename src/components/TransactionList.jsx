import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Trash2 } from 'lucide-react';

const TransactionList = () => {
    const { transactions, deleteTransaction, categories } = useContext(GlobalContext);

    const getCategoryColor = (catName) => {
        const category = categories.find(c => c.name === catName);
        return category ? category.color : '#9CA3AF'; // Default gray
    };

    const handleDelete = (id, text) => {
        if (confirm(`Are you sure you want to delete "${text}"? This action cannot be undone.`)) {
            deleteTransaction(id);
        }
    };

    return (
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
    );
};

export default TransactionList;
