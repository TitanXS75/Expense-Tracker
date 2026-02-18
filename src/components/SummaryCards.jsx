import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

const SummaryCards = () => {
    const { transactions } = useContext(GlobalContext);

    const amounts = transactions.map(transaction => transaction.amount);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    return (
        <div className="mb-8">
            <div className="nb-card-soft flex flex-col items-start gap-3 px-6 py-5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                    Total Spent
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 leading-none">
                    ₹{expense}
                </h2>
                <p className="text-xs text-nb-muted max-w-xs">
                    Keep daily expenses sharp and intentional. Brutally honest, visually bold.
                </p>
            </div>
        </div>
    ); 
};

export default SummaryCards;
