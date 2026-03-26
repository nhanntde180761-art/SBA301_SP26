import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'app-btn-primary',
    secondary: 'app-btn-secondary',
    outline: 'app-btn border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50',
    ghost: 'app-btn bg-transparent text-primary-700 hover:bg-primary-100',
    soft: 'app-btn-soft',
    danger: 'app-btn bg-error text-white shadow-soft hover:brightness-95',
    success: 'app-btn bg-success text-white shadow-soft hover:brightness-95',
    warning: 'app-btn-warning',
};

const sizes = {
    sm: 'min-h-9 px-3 py-1.5 text-xs',
    md: 'min-h-10 px-4 py-2 text-sm',
    lg: 'min-h-11 px-5 py-2.5 text-base',
    icon: 'h-10 w-10 p-0',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    disabled = false,
    icon: Icon = null,
    iconPosition = 'left',
    fullWidth = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
    
    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.md;
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className={`h-4 w-4 ${children ? 'ml-2' : ''}`} />}
                </>
            )}
        </button>
    );
};

export default Button;
