import DashboardChart from '../components/DashboardChart';

const Charts = () => {
    return (
        <div className="pb-20">
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nb-muted">
                    Insights
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Analytics
                </h1>
            </div>
            <DashboardChart />
        </div>
    );
};

export default Charts;
