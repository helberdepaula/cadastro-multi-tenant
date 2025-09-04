import React from 'react';

interface HeartProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

const IsEmpty: React.FC<HeartProps> = ({
    title = "Bem-vindo",
    subtitle = "Bem-vindo",
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-10">
            <div className="flex flex-col items-center justify-center py-8">
                <div className="text-gray-300 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mt-2">{title}</h3>
                <p className="text-gray-500 mt-2 text-center">{subtitle}</p>
            </div>
        </div>
    );
};

export default IsEmpty;
