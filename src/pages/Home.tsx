import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchAccountId } from "../hooks/useAccountId";
import { useUser } from "@clerk/clerk-react";
import { useLoading } from "../contexts/LoadingContext";
import { useToast } from "../hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"


const Home: React.FC = () => {
  const fetchData = useFetch();
  const { isLoading, setIsLoading } = useLoading();
  const { toast } = useToast();

  const [accountId, setAccountId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState("deposit");
  const [toAccountId, setToAccountId] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

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
        } catch (err: any) {
          setError(err.message || "An unexpected error occurred.");
        } finally {
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
          const transactionsData = await fetchData(
            `http://localhost:5000/api/transactions/${accountId}`
          );
          setTransactions(transactionsData);
        } catch (err) {
          setError("Failed to fetch transactions.");
        } finally {
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
          const response = await fetchData(
            `http://localhost:5000/api/users/${accountId}/balance`
          );
          setBalance(response.balance);
        } catch (err) {
          setError("Failed to fetch balance.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchBalance();
    }
  }, [accountId]);

  // Handle transaction submission
  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !amount ||
      !transactionType ||
      (transactionType === "transfer_to" && !toAccountId)
    ) {
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

      // refetch balance
      const balanceResponse = await fetch(
        `http://localhost:5000/api/users/${accountId}/balance`
      );
      const balanceData = await balanceResponse.json();
      setBalance(balanceData.balance);

      setAmount("");
      setToAccountId("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error adding transaction.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Left Section: Transaction Form */}
      <div className="flex items-center justify-center w-full bg-gray-100 bg-center bg-no-repeat bg-cover md:w-1/2" style={{ backgroundImage: `url('https://britepayments.com/app/uploads/sites/2/2023/03/Consumer-lending-1-1920x1093.png')`, backgroundColor: "var(--overlay-color)", }}>
        <div className="max-w-md p-8 bg-white rounded-md shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-center">
            Make a Transaction
          </h2>
          <form onSubmit={handleTransactionSubmit}>
            <div className="mb-4">
              <label htmlFor="transaction-type">Transaction Type</label>
              
              <Select onValueChange={(value) => setTransactionType(value)} defaultValue={transactionType}>
                <SelectTrigger >
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md">
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer_to">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {transactionType === "transfer_to" && (
              <div className="mb-4">
                <label htmlFor="to-account-id">Recipient Account ID</label>
                
                <Input 
                type="text"
                id="to-account-id"
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                placeholder="Enter recipient account ID"/>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="amount">Amount</label>
         
              <Input 
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"/>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
            >
              Perform Transaction
            </Button>
          </form>
        </div>
      </div>

      {/* Right Section: Transaction History */}
      <div className="w-full bg-gray-50 md:w-1/2">
        <div className="max-w-md p-8">
          <div className="flex items-baseline">
            <h2 className="mb-4 text-2xl font-bold">Your Balance:&nbsp;</h2>
            <div className="text-2xl font-semibold">
              ${balance !== null ? balance.toFixed(2) : "Loading..."}
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold">Transaction History</h2>
          <ul className="space-y-4">
            {isLoading ? (
              <p>Loading transactions...</p>
            ) : transactions.length > 0 ? (
              transactions.map((txn: any) => (
                <li
                  key={txn.id}
                  className="flex justify-between px-4 py-2 bg-gray-100 rounded-md"
                >
                  <span>
                    {txn.transactionType === "deposit" && "Deposit"}
                    {txn.transactionType === "withdrawal" && "Withdrawal"}
                    {txn.transactionType === "transfer_to" &&
                      `Transfer to ${txn.toAccountId}`}
                    {txn.transactionType === "transfer_from" &&
                      `Transfer from ${txn.toAccountId}`}
                  </span>
                  <span>${txn.amount}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No transactions found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
