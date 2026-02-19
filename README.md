# PFMA - Personal Finance Management App
Expense Tracker 

A neo-brutalist styled expense tracking application built with React and Vite.

## Features

- **Expense-Only Tracking**: Focus solely on monitoring expenses without income complications
- **Neo-Brutalist Design**: Bold black borders, strong shadows, and clean layouts
- **Custom Money Shortcuts**: Create personalized quick amount buttons for faster entry
- **Category Management**: Organize expenses by custom categories
- **Visual Analytics**: Charts and summaries for expense insights
- **Responsive Design**: Works seamlessly across devices

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- Recharts for Analytics

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Design Philosophy

The app follows a neo-brutalist aesthetic with:
- Thick black borders (border-2 to border-4)
- Strong shadows (shadow-lg to shadow-2xl)
- Bold typography and uppercase text
- Clean, minimal layouts with high contrast

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TransactionForm.jsx
│   ├── TransactionList.jsx
│   ├── SummaryCards.jsx
│   └── DashboardChart.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   ├── Charts.jsx
│   └── Settings.jsx
├── context/            # Global state management
│   └── GlobalState.jsx
└── assets/             # Static assets
```
