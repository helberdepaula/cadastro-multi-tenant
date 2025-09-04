import React from 'react';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
const Content: React.FC<ContentProps> = ({ children, className }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export default Content;