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

    // 1. Process Expense Data (Negative transactions only)
    const expenseTransactions = transactions.filter(t => t.amount < 0);

    // 2. Category Data (Spend vs Category)
    const categoryData = useMemo(() => {
        return categories
            .filter(c => c.type === 'expense')
            .map(cat => {
                const total = expenseTransactions
                    .filter(t => t.category === cat.name)
                    .reduce((acc, t) => acc + Math.abs(t.amount), 0);
                return { name: cat.name, value: total, color: cat.color };
            })
            .filter(item => item.value > 0);
    }, [transactions, categories]);

    // 3. Top Spending Data (Sorted for Bar Chart)
    const topSpendingData = useMemo(() => {
        return [...categoryData].sort((a, b) => b.value - a.value);
    }, [categoryData]);

    // 4. Monthly Data (Line Chart)
    const monthlyData = useMemo(() => {
        const months = {};
        expenseTransactions.forEach(t => {
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
    }, [expenseTransactions]);


    const renderChart = () => {
        if (expenseTransactions.length === 0) {
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
            case 'category': // Money Spent vs Category (Pie)
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `₹${value.toFixed(2)}`}
                                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#1E293B', borderWidth: 2, borderRadius: 8, color: '#1E293B' }}
                                itemStyle={{ color: '#1E293B' }}
                            />
                            <Legend wrapperStyle={{ color: '#64748B', paddingTop: 20 }} />
                        </PieChart>
                    </ResponsiveContainer>
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

            {/* Chart Container */}
            <div className="bg-white border-2 border-slate-900 rounded-lg shadow-lg p-6 h-80">
                {renderChart()}
            </div>
        </div>
    );
};

export default DashboardChart;
