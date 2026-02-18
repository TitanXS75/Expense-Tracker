import { useContext, useState, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';

const DashboardChart = () => {
    const { transactions, categories } = useContext(GlobalContext);
    const [view, setView] = useState('category'); // 'top', 'category', 'monthly'
    const [timeRange, setTimeRange] = useState('all'); // 'all', '10', '20', '30'

    // 1. Process Expense Data (Negative transactions only)
    const expenseTransactions = transactions.filter(t => t.amount < 0);

    // Filter transactions based on time range
    const filteredTransactions = useMemo(() => {
        if (timeRange === 'all') return expenseTransactions;
        
        const days = parseInt(timeRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return expenseTransactions.filter(t => new Date(t.date) >= cutoffDate);
    }, [expenseTransactions, timeRange]);

    // 2. Category Data (Spend vs Category)
    const categoryData = useMemo(() => {
        console.log('All categories:', categories);
        console.log('Expense transactions:', filteredTransactions);
        
        const expenseCategories = categories.filter(c => c.type === 'expense');
        console.log('Expense categories:', expenseCategories);
        
        const data = expenseCategories.map(cat => {
            const total = filteredTransactions
                .filter(t => t.category === cat.name)
                .reduce((acc, t) => acc + Math.abs(t.amount), 0);
            return { name: cat.name, value: total, color: cat.color };
        }).filter(item => item.value > 0);
        
        console.log('Category data for charts:', data);
        return data;
    }, [filteredTransactions, categories]);

    // 3. Top Spending Data (Sorted for Bar Chart)
    const topSpendingData = useMemo(() => {
        return [...categoryData].sort((a, b) => b.value - a.value);
    }, [categoryData]);

    // 4. Monthly Data (Line Chart)
    const monthlyData = useMemo(() => {
        const months = {};
        filteredTransactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = date.toLocaleString('default', { month: 'short' }); // e.g., "Jan"
            if (!months[monthKey]) months[monthKey] = 0;
            months[monthKey] += Math.abs(t.amount);
        });

        // Sort months chronologically (simple version for current year context)
        // For a robust app, use full date parsing. Assuming data is relatively recent for this demo.
        const monthOrder = { "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12 };

        return Object.keys(months)
            .map(key => ({ name: key, amount: months[key] }))
            .sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);
    }, [filteredTransactions]);


    const renderChart = () => {
        if (filteredTransactions.length === 0) {
            return (
                <div className="flex h-full items-center justify-center text-slate-500 text-center px-4">
                    <div>
                        <p className="font-semibold text-slate-700 mb-2">No expenses found</p>
                        <p className="text-sm">
                            Add an expense transaction to see analytics.
                        </p>
                    </div>
                </div>
            );
        }

        switch (view) {
            case 'top': // Top Spending Category (Bar)
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topSpendingData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                            <XAxis type="number" stroke="#64748B" tick={{ fill: '#64748B' }} tickFormatter={(value) => `₹${value}`} />
                            <YAxis dataKey="name" type="category" stroke="#64748B" tick={{ fill: '#64748B', fontSize: 12 }} width={80} />
                            <Tooltip
                                formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#1E293B', borderWidth: 2, borderRadius: 8, color: '#1E293B' }}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {topSpendingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'category': // Money Spent vs Category (Vertical List with Amounts)
                return (
                    <div className="h-full overflow-y-auto">
                        <div className="space-y-2">
                            {categoryData.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-slate-500">
                                    <p>No expense data available</p>
                                </div>
                            ) : (
                                categoryData.map((cat, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between bg-white border-2 border-slate-900 rounded-lg p-3 shadow-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-4 h-4 rounded-full border-2 border-slate-900"
                                                style={{ backgroundColor: cat.color }}
                                            />
                                            <span className="font-bold text-slate-900">{cat.name}</span>
                                        </div>
                                        <span className="font-black text-slate-900">₹{cat.value.toFixed(2)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            case 'monthly': // Monthly Expense Track (Line)
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748B" tick={{ fill: '#64748B' }} />
                            <YAxis stroke="#64748B" tick={{ fill: '#64748B' }} tickFormatter={(value) => `₹${value}`} />
                            <Tooltip
                                formatter={(value) => [`₹${value.toFixed(2)}`, 'Expense']}
                                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#1E293B', borderWidth: 2, borderRadius: 8, color: '#1E293B' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#EF4444"
                                strokeWidth={3}
                                dot={{ fill: '#EF4444', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
                                activeDot={{ r: 7, strokeWidth: 2, stroke: '#FFFFFF' }}
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
            {/* Toggle Buttons Only */}
            <div className="flex justify-center w-full">
                <div className="flex w-full bg-white border-2 border-slate-900 rounded-lg shadow-md p-1">
                    <button
                        onClick={() => setView('top')}
                        className={`flex-1 py-3 rounded-md text-sm font-bold transition-all ${view === 'top'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Top
                    </button>
                    <button
                        onClick={() => setView('category')}
                        className={`flex-1 py-3 rounded-md text-sm font-bold transition-all ${view === 'category'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Category
                    </button>
                    <button
                        onClick={() => setView('monthly')}
                        className={`flex-1 py-3 rounded-md text-sm font-bold transition-all ${view === 'monthly'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {/* Time Range Filter - Only show for monthly view */}
            {view === 'monthly' && (
                <div className="flex justify-center w-full">
                    <div className="flex gap-2 bg-white border-2 border-slate-900 rounded-lg shadow-md p-1">
                        <button
                            onClick={() => setTimeRange('10')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${timeRange === '10'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Last 10 Days
                        </button>
                        <button
                            onClick={() => setTimeRange('20')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${timeRange === '20'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Last 20 Days
                        </button>
                        <button
                            onClick={() => setTimeRange('30')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${timeRange === '30'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Last 30 Days
                        </button>
                        <button
                            onClick={() => setTimeRange('all')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${timeRange === 'all'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            All Time
                        </button>
                    </div>
                </div>
            )}

            {/* Chart Container */}
            <div className="bg-white border-2 border-slate-900 rounded-lg shadow-lg p-6 h-80">
                {renderChart()}
            </div>
        </div>
    );
};

export default DashboardChart;
