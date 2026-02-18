import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';

const Dashboard = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-baseline justify-between mb-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nb-muted">
                        Overview
                    </p>
                    <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                        Add Expense
                    </h1>
                </div>
            </div>

            <div className="mb-8">
                <TransactionForm />
            </div>

            <SummaryCards />
        </div>
    );
};

export default Dashboard;
