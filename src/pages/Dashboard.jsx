import { useState } from 'react';
import { Calculator } from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import CalculatorModal from '../components/CalculatorModal';

const Dashboard = () => {
    const [showCalc, setShowCalc] = useState(false);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nb-muted">
                        Overview
                    </p>
                    <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                        Add Expense
                    </h1>
                </div>
                {/* Calculator Icon Button */}
                <button
                    onClick={() => setShowCalc(true)}
                    className="flex items-center justify-center w-10 h-10 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_#1e293b] hover:shadow-[1px_1px_0px_#1e293b] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    aria-label="Open Calculator"
                >
                    <Calculator size={20} className="text-slate-900" />
                </button>
            </div>

            <div className="mb-8">
                <TransactionForm />
            </div>

            <SummaryCards />

            {showCalc && <CalculatorModal onClose={() => setShowCalc(false)} />}
        </div>
    );
};

export default Dashboard;
