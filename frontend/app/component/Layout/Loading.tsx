import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
};

export default Loading;
