import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        // Simula datos de transacciones (luego se puede conectar a Neon)
        const fakeTransactions = [
            { id: 1, amount: 100, date: '2024-01-01' },
            { id: 2, amount: 50, date: '2024-01-02' },
        ];
        setTransactions(fakeTransactions);
    }, []);
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Transaction History" }), _jsx("ul", { children: transactions.map((txn) => (_jsxs("li", { children: ["$", txn.amount, " - ", txn.date] }, txn.id))) })] }));
};
export default Transactions;
