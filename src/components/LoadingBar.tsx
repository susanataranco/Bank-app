import React from 'react';
import { useLoading } from '../contexts/LoadingContext';

const LoadingBar: React.FC = () => {
  const { isLoading } = useLoading();

  return (
    <div
      className={`fixed top-0 left-0 h-1 bg-blue-500 transition-all duration-300 ${
        isLoading ? 'w-full' : 'w-0'
      }`}
    ></div>
  );
};

export default LoadingBar;
