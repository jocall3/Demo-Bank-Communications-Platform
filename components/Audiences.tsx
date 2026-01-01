import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import { AudienceSegment } from '../types';
import { generateMockAudienceSegments, getRandomInt, formatLargeNumber } from '../utils/mockData';

export const AudienceSegmentManager: React.FC = () => {
    const [segments, setSegments] = useState<AudienceSegment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterDynamic, setFilterDynamic] = useState<string>('All');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setSegments(generateMockAudienceSegments(10));
            setIsLoading(false);
        }, getRandomInt(300, 1000));
        return () => clearTimeout(timer);
    }, []);

    const filteredSegments = useMemo(() => {
        let filtered = segments;
        if (filterDynamic !== 'All') {
            const isDynamic = filterDynamic === 'Dynamic';
            filtered = filtered.filter(s => s.isDynamic === isDynamic);
        }
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.criteria.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
                s.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [segments, searchTerm, filterDynamic]);

    const handleCreateSegment = useCallback(() => alert("Simulating: Navigate to Create Segment Page"), []);
    const handleViewSegment = useCallback((id: string) => alert(`Simulating: View Segment ID: ${id}`), []);
    const handleEditSegment = useCallback((id: string) => alert(`Simulating: Edit Segment ID: ${id}`), []);
    const handleDeleteSegment = useCallback((id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete segment "${name}" (ID: ${id})?`)) {
            setSegments(prev => prev.filter(s => s.id !== id));
            alert(`Simulating: Segment "${name}" deleted.`);
        }
    }, []);

    if (isLoading) {
        return <Card title="Audience Segmentation" className="min-h-[400px] flex items-center justify-center"><p className="text-gray-400">Loading audience segments...</p></Card>;
    }

    return (
        <Card title="Audience Segmentation">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <div className="flex flex-wrap gap-2">
                    <select
                        className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filterDynamic}
                        onChange={(e) => setFilterDynamic(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Dynamic">Dynamic</option>
                        <option value="Static">Static</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search segments..."
                        className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 w-48 md:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleCreateSegment}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
                >
                    + Create New Segment
                </button>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Members</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Updated</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created By</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {filteredSegments.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">No segments found.</td></tr>
                        ) : (
                            filteredSegments.map((segment) => (
                                <tr key={segment.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{segment.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300 max-w-md truncate">{segment.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatLargeNumber(segment.memberCount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${segment.isDynamic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {segment.isDynamic ? 'Dynamic' : 'Static'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(segment.lastUpdated).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{segment.createdBy.split('@')[0]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleViewSegment(segment.id)} className="text-indigo-400 hover:text-indigo-300 ml-4 px-2 py-1 rounded">View</button>
                                        <button onClick={() => handleEditSegment(segment.id)} className="text-blue-400 hover:text-blue-300 ml-4 px-2 py-1 rounded">Edit</button>
                                        <button onClick={() => handleDeleteSegment(segment.id, segment.name)} className="text-red-400 hover:text-red-300 ml-4 px-2 py-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};