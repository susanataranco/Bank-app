import { jsx as _jsx } from "react/jsx-runtime";
import { useLoading } from '../contexts/LoadingContext';
const LoadingBar = () => {
    const { isLoading } = useLoading();
    return (_jsx("div", { className: `fixed top-0 left-0 h-1 bg-blue-500 transition-all duration-300 ${isLoading ? 'w-full' : 'w-0'}` }));
};
export default LoadingBar;
