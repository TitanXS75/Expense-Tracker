import { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { PlusCircle, X } from 'lucide-react';

const SUGGESTED_AMOUNT = 100;

const TransactionForm = () => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [showAmountModal, setShowAmountModal] = useState(false);
    const [showShortcutModal, setShowShortcutModal] = useState(false);
    const [tempAmount, setTempAmount] = useState('');
    const [shortcuts, setShortcuts] = useState(() => {
        const saved = localStorage.getItem('moneyShortcuts');
        return saved ? JSON.parse(saved) : [];
    });
    const { addTransaction, categories } = useContext(GlobalContext);

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');

        const finalAmount = customAmount || amount;
        const finalCategory = category || customCategory;
        
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
        
        // Reset form
        setText('');
        setAmount('');
        setCustomAmount('');
        setCategory('');
        setCustomCategory('');
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
        setCustomCategory('');
    };

    const handleCustomCategoryChange = (e) => {
        setCustomCategory(e.target.value);
        setCategory('');
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

    const handleCustomCategorySelect = () => {
        if (customCategory) {
            setCategory(customCategory);
            setCustomCategory(''); // Clear custom after selecting
        }
    };

    const handleAddShortcut = () => {
        setShowShortcutModal(true);
        setTempAmount('');
    };

    const handleSaveShortcut = () => {
        if (tempAmount && shortcuts.length < 5) {
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
                        <div className="flex flex-wrap gap-2">
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
                            <div className="flex flex-wrap gap-2">
                                {shortcuts.map((shortcut, index) => (
                                    <div key={index} className="relative group">
                                        <button
                                            type="button"
                                            onClick={() => handleShortcutSelect(shortcut)}
                                            className={`px-4 py-2 font-bold border-2 border-slate-900 rounded-lg transition-all ${
                                                customAmount === shortcut.toString()
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
                                {shortcuts.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={handleAddShortcut}
                                        className="px-4 py-2 font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-900 shadow-md hover:shadow-lg transition-all flex items-center gap-1"
                                    >
                                        <PlusCircle size={16} />
                                    </button>
                                )}
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
                
                {/* Suggested Category + Custom */}
                <div className="flex gap-2 mb-3">
                    {categories.filter(c => c.type === 'expense').slice(0, 1).map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategorySelect(cat.name)}
                            className={`px-4 py-2 font-bold border-2 border-slate-900 rounded-lg transition-all ${
                                category === cat.name
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'bg-white text-slate-900 shadow-md hover:shadow-lg'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => document.querySelector('input[placeholder*="custom"]').focus()}
                        className="px-4 py-2 font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-900 shadow-md hover:shadow-lg transition-all"
                    >
                        Custom
                    </button>
                </div>

                {/* Custom Category Input */}
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-900 rounded-lg shadow-md focus:outline-none focus:shadow-lg transition-shadow text-slate-900 placeholder-slate-400 mb-2"
                    placeholder="Enter custom category..."
                    value={category || customCategory}
                    onChange={(e) => {
                        setCategory('');
                        setCustomCategory(e.target.value);
                    }}
                />
                {customCategory && (
                    <button
                        type="button"
                        onClick={handleCustomCategorySelect}
                        className="w-full py-2 bg-slate-900 text-white font-bold border-2 border-slate-900 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        Use "{customCategory}"
                    </button>
                )}
            </div>

            {/* Shortcut Modal */}
            {showShortcutModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-slate-900 rounded-lg shadow-2xl max-w-sm w-full p-6 relative">
                        <button 
                            onClick={() => setShowShortcutModal(false)}
                            className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>

                        <h3 className="text-xl font-black text-slate-900 text-center mb-4">
                            Add Money Shortcut
                        </h3>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl font-black text-slate-900">₹</span>
                            <input
                                type="number"
                                autoFocus
                                className="flex-1 text-3xl font-black text-slate-900 bg-white border-2 border-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:shadow-lg [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                                value={tempAmount}
                                onChange={(e) => setTempAmount(e.target.value)}
                            />
                            <span className="text-3xl font-black text-slate-900">/-</span>
                        </div>

                        <button
                            onClick={handleSaveShortcut}
                            disabled={!tempAmount || shortcuts.length >= 5}
                            className={`w-full py-3 font-black text-lg border-2 border-slate-900 rounded-lg shadow-md transition-all ${
                                tempAmount && shortcuts.length < 5 
                                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Add Shortcut ({shortcuts.length}/5)
                        </button>
                    </div>
                </div>
            )}

            {/* Amount Modal */}
            {showAmountModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-slate-900 rounded-lg shadow-2xl max-w-sm w-full p-6 relative">
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
                            className={`w-full py-3 font-black text-lg border-4 border-slate-900 rounded-lg shadow-md transition-all ${
                                tempAmount 
                                    ? 'bg-slate-900 text-white hover:shadow-lg' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <button 
                type="submit"
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xl border-2 border-slate-900 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
                Spent
            </button>
        </form>
    );
};

export default TransactionForm;
