import { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { PlusCircle, X } from 'lucide-react';

const SUGGESTED_AMOUNT = 100;

const TransactionForm = () => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showAmountModal, setShowAmountModal] = useState(false);
    const [showShortcutModal, setShowShortcutModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [tempAmount, setTempAmount] = useState('');
    const [tempCategory, setTempCategory] = useState('');
    const [shortcuts, setShortcuts] = useState(() => {
        const saved = localStorage.getItem('moneyShortcuts');
        return saved ? JSON.parse(saved) : [];
    });
    const { addTransaction, categories, addCategory, deleteCategory } = useContext(GlobalContext);

    const playCashSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            // 3-note ascending arpeggio: C5 → E5 → G5 (major chord)
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, i) => {
                const t = ctx.currentTime + i * 0.13;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                // Slight reverb via a short delay
                const delay = ctx.createDelay(0.1);
                delay.delayTime.value = 0.04;
                const delayGain = ctx.createGain();
                delayGain.gain.value = 0.18;
                osc.connect(gain);
                gain.connect(ctx.destination);
                gain.connect(delay);
                delay.connect(delayGain);
                delayGain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);
                // Attack → sustain → release
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
                gain.gain.setValueAtTime(0.28, t + 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
                osc.start(t);
                osc.stop(t + 0.4);
            });
        } catch (_) { /* silently fail if audio not supported */ }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');

        const finalAmount = customAmount || amount;
        const finalCategory = category;

        console.log('Form data:', { text, finalAmount, finalCategory });

        if (!text || !finalAmount || !finalCategory) {
            console.log('Validation failed - missing fields');
            alert('Please fill in all fields: Description, Amount, and Category');
            return;
        }

        // All transactions are expenses (negative values)
        const finalAmountNum = -Math.abs(+finalAmount);

        const newTransaction = {
            id: Math.floor(Math.random() * 100000000),
            text,
            amount: finalAmountNum,
            category: finalCategory,
            date: new Date().toISOString(),
        };

        console.log('Adding transaction:', newTransaction);
        addTransaction(newTransaction);
        playCashSound();

        // Reset form
        setText('');
        setAmount('');
        setCustomAmount('');
        setCategory('');
        setNewCategory('');
        console.log('Form reset successfully');
    };

    const handleAmountSelect = (amt) => {
        setAmount(amt.toString());
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        setCustomAmount(e.target.value);
        setAmount('');
    };

    const handleCategorySelect = (catName) => {
        setCategory(catName);
    };

    const handleAddCategory = () => {
        setShowCategoryModal(true);
        setTempCategory('');
    };

    const handleSaveCategory = () => {
        if (tempCategory && tempCategory.trim()) {
            const categoryName = tempCategory.trim();

            // Check if category already exists
            const existingCategory = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

            if (!existingCategory) {
                // Generate random color for new category
                const colors = ['#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#06B6D4', '#A855F7', '#F59E0B'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                // Add new category
                const newCategory = {
                    id: Date.now(),
                    name: categoryName,
                    type: 'expense',
                    color: randomColor
                };
                console.log('Adding new category:', newCategory);
                addCategory(newCategory);
            }

            // Select the category
            setCategory(categoryName);
            setTempCategory('');
            setShowCategoryModal(false);
        }
    };

    const handleManualAmountClick = () => {
        setShowAmountModal(true);
        setTempAmount('');
    };

    const handleSaveManualAmount = () => {
        if (tempAmount) {
            setCustomAmount(tempAmount);
            setAmount('');
            setShowAmountModal(false);
        }
    };

    const handleAddShortcut = () => {
        setShowShortcutModal(true);
        setTempAmount('');
    };

    const handleSaveShortcut = () => {
        if (tempAmount) {
            const newShortcuts = [...shortcuts, +tempAmount];
            setShortcuts(newShortcuts);
            localStorage.setItem('moneyShortcuts', JSON.stringify(newShortcuts));
            setTempAmount('');
            setShowShortcutModal(false);
        }
    };

    const handleShortcutSelect = (amount) => {
        setCustomAmount(amount.toString());
        setAmount('');
    };

    const handleRemoveShortcut = (index) => {
        const newShortcuts = shortcuts.filter((_, i) => i !== index);
        setShortcuts(newShortcuts);
        localStorage.setItem('moneyShortcuts', JSON.stringify(newShortcuts));
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 mb-6">
            {/* Description - Small input */}
            <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-2">
                    Description
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-900 rounded-lg shadow-md focus:outline-none focus:shadow-lg transition-shadow text-slate-900 placeholder-slate-400"
                    placeholder="What is this for?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            {/* Big Rupee and Amount Section */}
            <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-2">
                    Amount
                </label>
                <div className="border-2 border-slate-900 rounded-lg shadow-md px-4 py-3 mb-4">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <span className="text-6xl font-black text-slate-900 flex-shrink-0">₹</span>
                        <input
                            type="number"
                            className="flex-1 text-5xl font-black text-slate-900 bg-transparent focus:outline-none placeholder-slate-300 py-2 min-w-0 [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                            value={customAmount || amount}
                            onChange={handleCustomAmountChange}
                        />
                    </div>
                </div>

                {/* Money Shortcuts Section */}
                <div className="space-y-2">
                    <div className="flex items-center">
                        <span className="text-xs font-semibold text-slate-600">Quick Amounts</span>
                    </div>

                    {shortcuts.length === 0 ? (
                        <div className="flex flex-wrap gap-2 gap-y-4">
                            <button
                                type="button"
                                onClick={handleAddShortcut}
                                className="px-4 py-2 font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-900 shadow-md hover:shadow-lg transition-all"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2 gap-y-4">
                                {shortcuts.map((shortcut, index) => (
                                    <div key={index} className="relative group">
                                        <button
                                            type="button"
                                            onClick={() => handleShortcutSelect(shortcut)}
                                            className={`px-4 py-2 font-bold border-2 border-slate-900 rounded-lg transition-all ${customAmount === shortcut.toString()
                                                ? 'bg-slate-900 text-white shadow-lg'
                                                : 'bg-white text-slate-900 shadow-md hover:shadow-lg'
                                                }`}
                                        >
                                            ₹{shortcut}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveShortcut(index)}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white border-2 border-slate-900 rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddShortcut}
                                    className="px-4 py-2 font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-900 shadow-md hover:shadow-lg transition-all flex items-center gap-1"
                                >
                                    <PlusCircle size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Category Section */}
            <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-2">
                    Category
                </label>

                {/* Categories - Quick Select */}
                <div className="space-y-2">
                    <div className="flex items-center">
                        <span className="text-xs font-semibold text-slate-600">Your Categories</span>
                    </div>

                    {categories.filter(c => c.type === 'expense').length === 0 ? (
                        <div className="flex flex-wrap gap-2 gap-y-4">
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="w-full py-2 font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-900 shadow-md hover:shadow-lg transition-all"
                            >
                                + Add Your First Category
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 gap-y-4">
                            {categories.filter(c => c.type === 'expense').map((cat) => (
                                <div key={cat.id} className="relative group">
                                    <button
                                        type="button"
                                        onClick={() => handleCategorySelect(cat.name)}
                                        className={`px-4 py-2 font-bold border-2 border-slate-900 rounded-lg transition-all ${category === cat.name
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'bg-white text-slate-900 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (category === cat.name) setCategory('');
                                            deleteCategory(cat.id);
                                        }}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white border-2 border-slate-900 rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="px-4 py-2 font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-900 shadow-md hover:shadow-lg transition-all flex items-center gap-1"
                            >
                                <PlusCircle size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Shortcut Modal */}
            {showShortcutModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-2 border-slate-900 rounded-lg shadow-2xl max-w-sm w-full p-5 relative">
                        <button
                            type="button"
                            onClick={() => setShowShortcutModal(false)}
                            className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>

                        <h3 className="text-xl font-black text-slate-900 text-center mb-4">
                            Add Quick Amount
                        </h3>

                        <input
                            type="number"
                            autoFocus
                            className="w-full px-4 py-3 bg-white border-2 border-slate-900 rounded-lg shadow-md focus:outline-none focus:shadow-lg transition-shadow text-slate-900 placeholder-slate-400 mb-4 [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Enter amount..."
                            value={tempAmount}
                            onChange={(e) => setTempAmount(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={handleSaveShortcut}
                            disabled={!tempAmount}
                            className={`w-full py-3 font-black text-lg border-2 border-slate-900 rounded-lg shadow-md transition-all ${tempAmount
                                ? 'bg-nb-primary text-white hover:opacity-90'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            {/* Amount Modal */}
            {showAmountModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-slate-900 rounded-lg shadow-2xl max-w-sm w-full p-6 relative">
                        <button
                            onClick={() => setShowAmountModal(false)}
                            className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>

                        <h3 className="text-xl font-black text-slate-900 text-center mb-4">
                            Enter Amount
                        </h3>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl font-black text-slate-900">₹</span>
                            <input
                                type="number"
                                autoFocus
                                className="flex-1 text-3xl font-black text-slate-900 bg-white border-2 border-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:shadow-lg"
                                placeholder="0"
                                value={tempAmount}
                                onChange={(e) => setTempAmount(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSaveManualAmount}
                            disabled={!tempAmount}
                            className={`w-full py-3 font-black text-lg border-4 border-slate-900 rounded-lg shadow-md transition-all ${tempAmount
                                ? 'bg-slate-900 text-white hover:shadow-lg'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-2 border-slate-900 rounded-lg shadow-2xl max-w-sm w-full p-5 relative">
                        <button
                            onClick={() => setShowCategoryModal(false)}
                            className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>

                        <h3 className="text-xl font-black text-slate-900 text-center mb-4">
                            Add Category
                        </h3>

                        <input
                            type="text"
                            autoFocus
                            className="w-full px-4 py-3 bg-white border-2 border-slate-900 rounded-lg shadow-md focus:outline-none focus:shadow-lg transition-shadow text-slate-900 placeholder-slate-400 mb-4"
                            placeholder="Category name..."
                            value={tempCategory}
                            onChange={(e) => setTempCategory(e.target.value)}
                        />

                        <button
                            onClick={handleSaveCategory}
                            disabled={!tempCategory.trim()}
                            className={`w-full py-3 font-black text-lg border-2 border-slate-900 rounded-lg shadow-md transition-all ${tempCategory.trim()
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Add Category
                        </button>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xl border-2 border-slate-900 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
                Spent !!!
            </button>
        </form>
    );
};

export default TransactionForm;
