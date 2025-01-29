import { useLoading } from '../contexts/LoadingContext';
export const useFetch = () => {
    const { setIsLoading } = useLoading();
    const fetchData = async (url, options) => {
        setIsLoading(true);
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data;
        }
        finally {
            setIsLoading(false);
        }
    };
    return fetchData;
};
