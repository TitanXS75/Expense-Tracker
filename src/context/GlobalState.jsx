import React, { createContext, useReducer, useEffect } from 'react';

// Initial State
const initialState = {
    transactions: JSON.parse(localStorage.getItem('transactions')) || [],
    categories: JSON.parse(localStorage.getItem('categories')) || [
        { id: 1, name: 'Salary', type: 'income', color: '#10B981' },
        { id: 2, name: 'Freelance', type: 'income', color: '#34D399' },
        { id: 3, name: 'Food', type: 'expense', color: '#EF4444' },
        { id: 4, name: 'Rent', type: 'expense', color: '#F59E0B' },
        { id: 5, name: 'Transport', type: 'expense', color: '#3B82F6' },
    ],
};

// Create Context
export const GlobalContext = createContext(initialState);

// Reducer
const AppReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
            };
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(
                    (transaction) => transaction.id !== action.payload
                ),
            };
        case 'ADD_CATEGORY':
            return {
                ...state,
                categories: [...state.categories, action.payload],
            };
        case 'DELETE_CATEGORY':
            return {
                ...state,
                categories: state.categories.filter(
                    (category) => category.id !== action.payload
                ),
            };
        default:
            return state;
    }
};

// Provider Component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    // Persist to LocalStorage
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(state.transactions));
        localStorage.setItem('categories', JSON.stringify(state.categories));
    }, [state.transactions, state.categories]);

    // Actions
    function addTransaction(transaction) {
        dispatch({
            type: 'ADD_TRANSACTION',
            payload: transaction,
        });
    }

    function deleteTransaction(id) {
        dispatch({
            type: 'DELETE_TRANSACTION',
            payload: id,
        });
    }

    function addCategory(category) {
        dispatch({
            type: 'ADD_CATEGORY',
            payload: category,
        });
    }

    function deleteCategory(id) {
        dispatch({
            type: 'DELETE_CATEGORY',
            payload: id,
        });
    }

    return (
        <GlobalContext.Provider
            value={{
                transactions: state.transactions,
                categories: state.categories,
                addTransaction,
                deleteTransaction,
                addCategory,
                deleteCategory,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
