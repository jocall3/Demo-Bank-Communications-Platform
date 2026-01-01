import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import { Campaign } from '../types';
import { generateMockCampaigns, getRandomInt, formatLargeNumber } from '../utils/mockData';

export const CampaignList: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setCampaigns(generateMockCampaigns(20));
            setIsLoading(false);
        }, getRandomInt(500, 1500));
        return () => clearTimeout(timer);
    }, []);

    const filteredCampaigns = useMemo(() => {
        let filtered = campaigns;
        if (filterStatus !== 'All') {
            filtered = filtered.filter(c => c.status === filterStatus);
        }
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.creator.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [campaigns, filterStatus, searchTerm]);

    const handleCreateCampaign = useCallback(() => {
        alert("Simulating: Navigate to Create Campaign Page");
    }, []);

    const handleViewCampaign = useCallback((id: string) => {
        alert(`Simulating: View Campaign ID: ${id}`);
    }, []);

    const handleEditCampaign = useCallback((id: string) => {
        alert(`Simulating: Edit Campaign ID: ${id}`);
    }, []);

    const handleDeleteCampaign = useCallback((id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete campaign "${name}" (ID: ${id})?`)) {
            setCampaigns(prev => prev.filter(c => c.id !== id));
            alert(`Simulating: Campaign "${name}" deleted successfully.`);
        }
    }, []);

    if (isLoading) {
        return <Card title="Campaign Management" className="min-h-[600px] flex items-center justify-center"><p className="text-gray-400">Loading campaigns...</p></Card>;
    }

    return (
        <Card title="Campaign Management">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <div className="flex flex-wrap gap-2">
                    <select
                        className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Draft">Draft</option>
                        <option value="Paused">Paused</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 w-48 md:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleCreateCampaign}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
                >
                    + Create New Campaign
                </button>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Channel</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Audience</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sent</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Deliverability</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cost ($)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Creator</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {filteredCampaigns.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">No campaigns found.</td>
                            </tr>
                        ) : (
                            filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{campaign.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            campaign.status === 'Completed' ? 'bg-gray-200 text-gray-800' :
                                            campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                            campaign.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-purple-100 text-purple-800'}`}
                                        >
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{campaign.channel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{campaign.targetAudience}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatLargeNumber(campaign.totalSent)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{((campaign.delivered / campaign.totalSent) * 100).toFixed(2)}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${campaign.cost.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{campaign.creator.split('@')[0]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleViewCampaign(campaign.id)} className="text-indigo-400 hover:text-indigo-300 ml-4 px-2 py-1 rounded">View</button>
                                        <button onClick={() => handleEditCampaign(campaign.id)} className="text-blue-400 hover:text-blue-300 ml-4 px-2 py-1 rounded">Edit</button>
                                        <button onClick={() => handleDeleteCampaign(campaign.id, campaign.name)} className="text-red-400 hover:text-red-300 ml-4 px-2 py-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-6 text-gray-400 text-sm">
                <span className="cursor-not-allowed px-3 py-1 border border-gray-700 rounded-l-md bg-gray-800">Previous</span>
                <span className="px-3 py-1 border-t border-b border-gray-700 bg-gray-700 text-white">1</span>
                <span className="cursor-pointer px-3 py-1 border border-gray-700 rounded-r-md hover:bg-gray-700">Next</span>
            </div>
        </Card>
    );
};