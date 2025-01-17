import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Terminal } from "lucide-react";
const AlertMessage = ({ title, description }) => {
    return (_jsxs(Alert, { className: "mb-4", children: [_jsx(Terminal, { className: "w-4 h-4 mr-2" }), _jsxs("div", { children: [_jsx(AlertTitle, { children: title }), _jsx(AlertDescription, { children: description })] })] }));
};
export default AlertMessage;
