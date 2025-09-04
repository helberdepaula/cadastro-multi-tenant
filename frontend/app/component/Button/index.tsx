import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    isLoading = false,
    loadingText = 'Carregando...',
    icon,
    disabled,
    className = '',
    ...props 
}) => {
    const baseClasses = "flex items-center justify-center gap-2 px-6 py-2  rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 cursor-pointer";

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-70',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:opacity-70',
        outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:opacity-70',
        ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:opacity-70'
    };
    
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
    
    return (
        <button 
            className={combinedClasses}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    {loadingText}
                </>
            ) : (
                <>
                    {icon && icon}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;