import TransactionList from '../components/TransactionList';

const Transactions = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nb-muted">
                    Records
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Transaction History
                </h1>
            </div>
            <TransactionList />
        </div>
    );
};

export default Transactions;
