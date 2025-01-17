import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext } from 'react';
const LoadingContext = createContext(undefined);
export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    return (_jsx(LoadingContext.Provider, { value: { isLoading, setIsLoading }, children: children }));
};
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
