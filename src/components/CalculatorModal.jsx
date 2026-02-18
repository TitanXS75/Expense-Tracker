import { useState } from 'react';
import { X, Delete } from 'lucide-react';

const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
];

const CalculatorModal = ({ onClose }) => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [justEvaluated, setJustEvaluated] = useState(false);

    const handleButton = (val) => {
        if (val === 'C') {
            setDisplay('0');
            setExpression('');
            setJustEvaluated(false);
            return;
        }

        if (val === '⌫') {
            if (justEvaluated) {
                setDisplay('0');
                setExpression('');
                setJustEvaluated(false);
                return;
            }
            const newDisplay = display.length > 1 ? display.slice(0, -1) : '0';
            setDisplay(newDisplay);
            return;
        }

        const isOperator = ['+', '-', '×', '÷', '%'].includes(val);

        if (val === '=') {
            try {
                const expr = (expression + display)
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/');
                // eslint-disable-next-line no-eval
                const result = Function('"use strict"; return (' + expr + ')')();
                const resultStr = parseFloat(result.toFixed(10)).toString();
                setDisplay(resultStr);
                setExpression('');
                setJustEvaluated(true);
            } catch {
                setDisplay('Error');
                setExpression('');
                setJustEvaluated(true);
            }
            return;
        }

        if (isOperator) {
            setExpression(expression + display + val);
            setDisplay('0');
            setJustEvaluated(false);
            return;
        }

        // Digit or dot
        if (justEvaluated) {
            setDisplay(val === '.' ? '0.' : val);
            setExpression('');
            setJustEvaluated(false);
            return;
        }

        if (val === '.' && display.includes('.')) return;

        setDisplay(display === '0' && val !== '.' ? val : display + val);
    };

    const getButtonStyle = (val) => {
        const base =
            'flex items-center justify-center font-black text-lg border-2 border-slate-900 rounded-xl transition-all active:scale-95 select-none cursor-pointer';
        if (val === '=')
            return `${base} bg-orange-500 text-white shadow-[3px_3px_0px_#1e293b] hover:shadow-[1px_1px_0px_#1e293b] hover:translate-x-[2px] hover:translate-y-[2px]`;
        if (['÷', '×', '-', '+', '%'].includes(val))
            return `${base} bg-slate-900 text-white shadow-[3px_3px_0px_#475569] hover:shadow-[1px_1px_0px_#475569] hover:translate-x-[2px] hover:translate-y-[2px]`;
        if (val === 'C')
            return `${base} bg-red-500 text-white shadow-[3px_3px_0px_#1e293b] hover:shadow-[1px_1px_0px_#1e293b] hover:translate-x-[2px] hover:translate-y-[2px]`;
        if (val === '⌫')
            return `${base} bg-amber-400 text-slate-900 shadow-[3px_3px_0px_#1e293b] hover:shadow-[1px_1px_0px_#1e293b] hover:translate-x-[2px] hover:translate-y-[2px]`;
        return `${base} bg-white text-slate-900 shadow-[3px_3px_0px_#1e293b] hover:shadow-[1px_1px_0px_#1e293b] hover:translate-x-[2px] hover:translate-y-[2px]`;
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 pb-24"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="animate-modal-in bg-nb-surface border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_#1e293b] w-full max-w-xs overflow-hidden max-h-[calc(100vh-7rem)] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Calculator</span>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Display */}
                <div className="mx-4 mb-4 bg-white border-2 border-slate-900 rounded-xl px-4 py-3 shadow-[3px_3px_0px_#1e293b]">
                    <div className="text-xs text-slate-400 font-semibold min-h-[18px] text-right truncate">
                        {expression || '\u00A0'}
                    </div>
                    <div className="text-4xl font-black text-slate-900 text-right truncate leading-tight mt-1">
                        {display}
                    </div>
                </div>

                {/* Buttons */}
                <div className="px-4 pb-4 space-y-2">
                    {buttons.map((row, ri) => (
                        <div
                            key={ri}
                            className={`grid gap-2 ${row.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}
                        >
                            {row.map((btn) => (
                                <button
                                    key={btn}
                                    type="button"
                                    onClick={() => handleButton(btn)}
                                    className={`${getButtonStyle(btn)} h-14 ${btn === '0' && row.length === 3 ? '' : ''}`}
                                >
                                    {btn === '⌫' ? <Delete size={18} /> : btn}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalculatorModal;
