import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchAccountId } from "../hooks/useAccountId";
import { useUser } from "@clerk/clerk-react";
import { useLoading } from "../contexts/LoadingContext";
import { useToast } from "../hooks/use-toast";
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
                    const transactionsData = await fetchData(`http://localhost:5000/api/transactions/${accountId}`);
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
                    const response = await fetchData(`http://localhost:5000/api/users/${accountId}/balance`);
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
            const response = await fetch("http://localhost:5000/api/transactions", {
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
    return (_jsxs("div", { className: "flex flex-col h-screen md:flex-row", children: [_jsxs("div", { className: "flex items-center justify-center w-full bg-gray-100 bg-center bg-no-repeat bg-cover md:w-1/2", style: { backgroundImage: `url('https://britepayments.com/app/uploads/sites/2/2023/03/Consumer-lending-1-1920x1093.png')`, backgroundColor: "var(--overlay-color)", }, children: [_jsx("div", { className: "absolute inset-0", style: { backgroundColor: "var(--overlay-color)" } }), _jsxs("div", { className: "max-w-md p-8 bg-white rounded-md shadow-md", children: [_jsx("h2", { className: "mb-4 text-2xl font-bold text-center", children: "Make a Transaction" }), _jsxs("form", { onSubmit: handleTransactionSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "transaction-type", children: "Transaction Type" }), _jsxs("select", { id: "transaction-type", value: transactionType, onChange: (e) => setTransactionType(e.target.value), className: "w-full px-4 py-2 border rounded-md", children: [_jsx("option", { value: "deposit", children: "Deposit" }), _jsx("option", { value: "withdrawal", children: "Withdrawal" }), _jsx("option", { value: "transfer_to", children: "Transfer" })] })] }), transactionType === "transfer_to" && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "to-account-id", children: "Recipient Account ID" }), _jsx("input", { type: "text", id: "to-account-id", value: toAccountId, onChange: (e) => setToAccountId(e.target.value), placeholder: "Enter recipient account ID", className: "w-full px-4 py-2 border rounded-md" })] })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "amount", children: "Amount" }), _jsx("input", { type: "number", id: "amount", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "Enter amount", className: "w-full px-4 py-2 border rounded-md" })] }), _jsx("button", { type: "submit", className: "w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600", children: "Perform Transaction" })] })] })] }), _jsx("div", { className: "w-full bg-gray-50 md:w-1/2", children: _jsxs("div", { className: "max-w-md p-8", children: [_jsx("h2", { className: "mb-4 text-2xl font-bold", children: "Your Balance" }), _jsxs("div", { className: "text-3xl font-semibold text-green-600", children: ["$", balance !== null ? balance.toFixed(2) : "Loading..."] }), _jsx("h2", { className: "mb-4 text-2xl font-bold", children: "Transaction History" }), _jsx("ul", { className: "space-y-4", children: isLoading ? (_jsx("p", { children: "Loading transactions..." })) : transactions.length > 0 ? (transactions.map((txn) => (_jsxs("li", { className: "flex justify-between px-4 py-2 bg-gray-100 rounded-md", children: [_jsxs("span", { children: [txn.transactionType === "deposit" && "Deposit", txn.transactionType === "withdrawal" && "Withdrawal", txn.transactionType === "transfer_to" &&
                                                `Transfer to ${txn.toAccountId}`, txn.transactionType === "transfer_from" &&
                                                `Transfer from ${txn.toAccountId}`] }), _jsxs("span", { children: ["$", txn.amount] })] }, txn.id)))) : (_jsx("li", { className: "text-gray-500", children: "No transactions found." })) })] }) })] }));
};
export default Home;
