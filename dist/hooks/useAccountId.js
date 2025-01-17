export async function fetchAccountId(email, clerkId, setIsLoading) {
    try {
        setIsLoading(true);
        const response = await fetch(`${process.env.BACKEND_API_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, clerkId }),
        });
        if (response.ok) {
            const data = await response.json();
            return data.accountId;
        }
        else {
            console.error("Failed to fetch account ID. Status:", response.status, "Message:", await response.text());
            return null;
        }
    }
    catch (error) {
        console.error("Error fetching account ID:", error);
        return null;
    }
    finally {
        setIsLoading(false);
    }
}
