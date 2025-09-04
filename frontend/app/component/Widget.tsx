import React from 'react';

interface WidgetProps {
    title: string;
    value: number;
    icon: React.ReactNode;
}
const Widget: React.FC<WidgetProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default Widget;