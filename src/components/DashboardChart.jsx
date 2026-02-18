import { useContext, useState, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';

const DashboardChart = () => {
    const { transactions, categories } = useContext(GlobalContext);
    const [view, setView] = useState('category');
    const [timeRange, setTimeRange] = useState('all');

    const expenseTransactions = transactions.filter(t => t.amount < 0);

    const filteredTransactions = useMemo(() => {
        if (timeRange === 'all') return expenseTransactions;
        const days = parseInt(timeRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return expenseTransactions.filter(t => new Date(t.date) >= cutoffDate);
    }, [expenseTransactions, timeRange]);

    const categoryData = useMemo(() => {
        const expenseCategories = categories.filter(c => c.type === 'expense');
        return expenseCategories.map(cat => {
            const total = filteredTransactions
                .filter(t => t.category === cat.name)
                .reduce((acc, t) => acc + Math.abs(t.amount), 0);
            return { name: cat.name, value: total, color: cat.color };
        }).filter(item => item.value > 0);
    }, [filteredTransactions, categories]);

    const topSpendingData = useMemo(() => {
        return [...categoryData].sort((a, b) => b.value - a.value);
    }, [categoryData]);

    const monthlyData = useMemo(() => {
        const months = {};
        filteredTransactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = date.toLocaleString('default', { month: 'short' });
            if (!months[monthKey]) months[monthKey] = 0;
            months[monthKey] += Math.abs(t.amount);
        });
        const monthOrder = { "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12 };
        return Object.keys(months)
            .map(key => ({ name: key, amount: months[key] }))
            .sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);
    }, [filteredTransactions]);

    const CustomXAxisTick = ({ x, y, payload }) => {
        const label = payload.value.length > 8 ? payload.value.slice(0, 7) + '…' : payload.value;
        return (
            <text x={x} y={y + 12} textAnchor="middle" fill="#1E293B" fontSize={11} fontWeight={600}>
                {label}
            </text>
        );
    };

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: '#FFF8F0',
                    border: '1.5px solid #050505',
                    borderRadius: 10,
                    padding: '8px 14px',
                    fontWeight: 700,
                    color: '#050505',
                    fontSize: 13,
                }}>
                    <span style={{ color: d.color }}>● </span>
                    {d.name}: ₹{d.value.toFixed(2)}
                </div>
            );
        }
        return null;
    };

    const emptyState = (
        <div className="flex h-full items-center justify-center text-slate-500 text-center px-4">
            <div>
                <p className="font-semibold text-slate-700 mb-2">No expenses found</p>
                <p className="text-sm">Add an expense transaction to see analytics.</p>
            </div>
        </div>
    );

    const renderChart = () => {
        if (filteredTransactions.length === 0) return emptyState;

        switch (view) {
            case 'top':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topSpendingData}
                            layout="horizontal"
                            margin={{ left: 10, right: 10, top: 10, bottom: 30 }}
                            barCategoryGap="25%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <YAxis
                                type="number"
                                stroke="#64748B"
                                tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 600 }}
                                tickFormatter={(value) => `₹${value}`}
                                width={60}
                                axisLine={{ stroke: '#050505', strokeWidth: 2 }}
                                tickLine={{ stroke: '#050505' }}
                            />
                            <XAxis
                                dataKey="name"
                                type="category"
                                stroke="#64748B"
                                tick={<CustomXAxisTick />}
                                axisLine={{ stroke: '#050505', strokeWidth: 2 }}
                                tickLine={{ stroke: '#050505' }}
                                interval={0}
                            />
                            <Tooltip
                                formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                                contentStyle={{
                                    backgroundColor: '#F4D06F',
                                    borderColor: '#050505',
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    color: '#050505',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 0 0 rgba(5,5,5,0.75)'
                                }}
                                cursor={{ fill: 'rgba(244, 208, 111, 0.15)' }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                {topSpendingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#050505" strokeWidth={1.5} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'category':
                return (
                    <div className="h-full flex flex-col gap-4 overflow-y-auto">
                        {categoryData.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center text-slate-500">
                                <p>No expense data available</p>
                            </div>
                        ) : (
                            <>
                                {/* Pie Chart */}
                                <div style={{ height: 200, flexShrink: 0 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={85}
                                                paddingAngle={3}
                                                dataKey="value"
                                                strokeWidth={0}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Category list — no boxes, just rows */}
                                <div className="flex flex-col gap-2 pb-2">
                                    {categoryData.map((cat, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between px-2 py-1"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: cat.color }}
                                                />
                                                <span className="text-sm font-semibold text-slate-800">{cat.name}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-900">₹{cat.value.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );

            case 'monthly':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#64748B"
                                tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 600 }}
                                axisLine={{ stroke: '#050505', strokeWidth: 2 }}
                                tickLine={{ stroke: '#050505' }}
                            />
                            <YAxis
                                stroke="#64748B"
                                tick={{ fill: '#1E293B', fontSize: 11, fontWeight: 600 }}
                                tickFormatter={(value) => `₹${value}`}
                                axisLine={{ stroke: '#050505', strokeWidth: 2 }}
                                tickLine={{ stroke: '#050505' }}
                            />
                            <Tooltip
                                formatter={(value) => [`₹${value.toFixed(2)}`, 'Expense']}
                                contentStyle={{
                                    backgroundColor: '#F4D06F',
                                    borderColor: '#050505',
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    color: '#050505',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 0 0 rgba(5,5,5,0.75)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#FF8811"
                                strokeWidth={3}
                                dot={{ fill: '#FF8811', r: 5, strokeWidth: 2, stroke: '#050505' }}
                                activeDot={{ r: 7, strokeWidth: 2, stroke: '#050505' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {/* Toggle Buttons */}
            <div className="flex justify-center w-full">
                <div
                    className="flex w-full rounded-nb border-2 border-nb-border shadow-nb-md p-1 gap-1"
                    style={{ backgroundColor: '#FFF8F0' }}
                >
                    {['top', 'category', 'monthly'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setView(tab)}
                            className={`flex-1 py-3 rounded-nb text-sm font-bold uppercase tracking-wide transition-all duration-200 ease-in-out border ${view === tab
                                ? 'bg-nb-primary text-white border-black'
                                : 'bg-transparent text-slate-900 border-transparent hover:bg-black/5'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Range Filter — only for monthly view */}
            {view === 'monthly' && (
                <div className="flex justify-center w-full">
                    <div
                        className="flex gap-1 rounded-nb border-2 border-nb-border shadow-nb-md p-1"
                        style={{ backgroundColor: '#FFF8F0' }}
                    >
                        {[
                            { label: 'Last 10 Days', value: '10' },
                            { label: 'Last 20 Days', value: '20' },
                            { label: 'Last 30 Days', value: '30' },
                            { label: 'All Time', value: 'all' },
                        ].map((btn) => (
                            <button
                                key={btn.value}
                                onClick={() => setTimeRange(btn.value)}
                                className={`px-4 py-2 rounded-nb text-sm font-bold uppercase tracking-wide transition-all duration-200 ease-in-out border ${timeRange === btn.value
                                    ? 'bg-nb-primary text-white border-black'
                                    : 'bg-transparent text-slate-900 border-transparent hover:bg-black/5'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Chart Container — taller to fit pie + list */}
            <div className="bg-white border-2 border-nb-border rounded-nb shadow-nb-lg p-6"
                style={{ minHeight: view === 'category' ? 'auto' : '20rem', height: view === 'category' ? 'auto' : '20rem' }}
            >
                {renderChart()}
            </div>
        </div>
    );
};

export default DashboardChart;
