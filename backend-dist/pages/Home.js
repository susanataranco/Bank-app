import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchAccountId } from "../hooks/useAccountId";
import { useUser } from "@clerk/clerk-react";
import { useLoading } from "../contexts/LoadingContext";
import { useToast } from "../hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://bank-app-production-b9b8.up.railway.app";
const Home = () => {
    const fetchData = useFetch();
    const { isLoading, setIsLoading } = useLoading();
    const { toast } = useToast();
    const [accountId, setAccountId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(null);
    const [transactionType, setTransactionType] = useState("deposit");
    const [toAccountId, setToAccountId] = useState("");
    const [balance, setBalance] = useState(null);
    const { user } = useUser();
    // Fetch account ID
    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            const getAccountId = async () => {
                try {
                    setIsLoading(true);
                    const email = user.primaryEmailAddress?.emailAddress;
                    const clerkId = user.id;
                    if (email && clerkId) {
                        const id = await fetchAccountId(email, clerkId, setIsLoading);
                        if (id === null) {
                            throw new Error("User ID not found in the database.");
                        }
                        setAccountId(id);
                        setError(null);
                    }
                }
                catch (err) {
                    setError(err.message || "An unexpected error occurred.");
                }
                finally {
                    setIsLoading(false);
                }
            };
            getAccountId();
        }
    }, [user]);
    // Fetch transactions
    useEffect(() => {
        if (accountId) {
            const fetchTransactions = async () => {
                setIsLoading(true);
                try {
                    const transactionsData = await fetchData(`${API_BASE_URL}/api/transactions/${accountId}`);
                    setTransactions(transactionsData);
                }
                catch (err) {
                    setError("Failed to fetch transactions.");
                }
                finally {
                    setIsLoading(false);
                }
            };
            fetchTransactions();
        }
    }, [accountId]);
    // Fetch user balance
    useEffect(() => {
        if (accountId) {
            const fetchBalance = async () => {
                setIsLoading(true);
                try {
                    const response = await fetchData(`${API_BASE_URL}/api/users/${accountId}/balance`);
                    setBalance(response.balance);
                }
                catch (err) {
                    setError("Failed to fetch balance.");
                }
                finally {
                    setIsLoading(false);
                }
            };
            fetchBalance();
        }
    }, [accountId]);
    // Handle transaction submission
    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        if (!amount ||
            !transactionType ||
            (transactionType === "transfer_to" && !toAccountId)) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accountId,
                    amount: parseFloat(amount),
                    transactionType,
                    toAccountId,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Transaction failed");
            }
            const newTransaction = await response.json();
            toast({
                title: "Success",
                description: "Transaction added successfully!",
                variant: "success",
            });
            setTransactions((prev) => [newTransaction, ...prev]);
            // refetch balance
            const balanceResponse = await fetch(`${API_BASE_URL}/api/users/${accountId}/balance`);
            const balanceData = await balanceResponse.json();
            setBalance(balanceData.balance);
            setAmount("");
            setToAccountId("");
        }
        catch (error) {
            toast({
                title: "Error",
                description: error.message || "Error adding transaction.",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-screen md:flex-row", children: [_jsx("div", { className: "flex items-center justify-center w-full bg-gray-100 bg-center bg-no-repeat bg-cover md:w-1/2", style: { backgroundImage: `url('https://britepayments.com/app/uploads/sites/2/2023/03/Consumer-lending-1-1920x1093.png')`, backgroundColor: "var(--overlay-color)", }, children: _jsxs("div", { className: "max-w-md p-8 bg-white rounded-md shadow-md", children: [_jsx("h2", { className: "mb-4 text-2xl font-bold text-center", children: "Make a Transaction" }), _jsxs("form", { onSubmit: handleTransactionSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "transaction-type", children: "Transaction Type" }), _jsxs(Select, { onValueChange: (value) => setTransactionType(value), defaultValue: transactionType, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Transaction Type" }) }), _jsxs(SelectContent, { className: "bg-white shadow-md", children: [_jsx(SelectItem, { value: "deposit", children: "Deposit" }), _jsx(SelectItem, { value: "withdrawal", children: "Withdrawal" }), _jsx(SelectItem, { value: "transfer_to", children: "Transfer" })] })] })] }), transactionType === "transfer_to" && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "to-account-id", children: "Recipient Account ID" }), _jsx(Input, { type: "text", id: "to-account-id", value: toAccountId, onChange: (e) => setToAccountId(e.target.value), placeholder: "Enter recipient account ID" })] })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "amount", children: "Amount" }), _jsx(Input, { type: "number", id: "amount", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "Enter amount" })] }), _jsx(Button, { type: "submit", size: "lg", className: "w-full", children: "Perform Transaction" })] })] }) }), _jsx("div", { className: "w-full bg-gray-50 md:w-1/2", children: _jsxs("div", { className: "max-w-md p-8", children: [_jsxs("div", { className: "flex items-baseline", children: [_jsx("h2", { className: "mb-4 text-2xl font-bold", children: "Your Balance:\u00A0" }), _jsxs("div", { className: "text-2xl font-semibold", children: ["$", balance !== null ? balance.toFixed(2) : "Loading..."] })] }), _jsx("h2", { className: "mb-4 text-2xl font-bold", children: "Transaction History" }), _jsx("ul", { className: "space-y-4", children: isLoading ? (_jsx("p", { children: "Loading transactions..." })) : transactions.length > 0 ? (transactions.map((txn) => (_jsxs("li", { className: "flex justify-between px-4 py-2 bg-gray-100 rounded-md", children: [_jsxs("span", { children: [txn.transactionType === "deposit" && "Deposit", txn.transactionType === "withdrawal" && "Withdrawal", txn.transactionType === "transfer_to" &&
                                                `Transfer to ${txn.toAccountId}`, txn.transactionType === "transfer_from" &&
                                                `Transfer from ${txn.toAccountId}`] }), _jsxs("span", { children: ["$", txn.amount] })] }, txn.id)))) : (_jsx("li", { className: "text-gray-500", children: "No transactions found." })) })] }) })] }));
};
export default Home;
