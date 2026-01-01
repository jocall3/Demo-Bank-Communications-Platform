import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import { ChannelConfiguration, AlertRule } from '../types';
import { generateMockChannelConfigurations, generateMockAlertRules, getRandomInt, formatLargeNumber, getRandom } from '../utils/mockData';

export const ChannelConfigurationManager: React.FC = () => {
    const [configs, setConfigs] = useState<ChannelConfiguration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setConfigs(generateMockChannelConfigurations(8));
            setIsLoading(false);
        }, getRandomInt(300, 1000));
        return () => clearTimeout(timer);
    }, []);

    const filteredConfigs = useMemo(() => {
        let filtered = configs;
        if (filterType !== 'All') {
            filtered = filtered.filter(c => c.type === filterType);
        }
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.apiKeyPreview.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [configs, filterType, searchTerm]);

    const handleEditConfig = useCallback((id: string) => alert(`Simulating: Edit Config ID: ${id}`), []);
    const handleTestConfig = useCallback((id: string) => alert(`Simulating: Testing connection ID: ${id}`), []);
    const handleAddConfig = useCallback(() => alert("Simulating: Navigate to Add Config"), []);

    if (isLoading) {
        return <Card title="Channel Configurations" className="min-h-[400px] flex items-center justify-center"><p className="text-gray-400">Loading...</p></Card>;
    }

    return (
        <Card title="Channel Configurations">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <div className="flex flex-wrap gap-2">
                    <select className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="All">All Types</option>
                        <option value="Email">Email</option>
                        <option value="SMS">SMS</option>
                        <option value="Voice">Voice</option>
                    </select>
                    <input type="text" placeholder="Search configs..." className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 w-48 md:w-auto" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                <button onClick={handleAddConfig} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out">+ Add New Channel</button>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Provider</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">API Key</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usage / Limit</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {filteredConfigs.map((config) => (
                            <tr key={config.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{config.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{config.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{config.provider}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.status === 'Active' ? 'bg-green-100 text-green-800' : config.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{config.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{config.apiKeyPreview}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatLargeNumber(config.currentDailyUsage)} / {formatLargeNumber(config.dailyLimit)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleTestConfig(config.id)} className="text-yellow-400 hover:text-yellow-300 ml-4 px-2 py-1 rounded">Test</button>
                                    <button onClick={() => handleEditConfig(config.id)} className="text-indigo-400 hover:text-indigo-300 ml-4 px-2 py-1 rounded">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const AlertRulesManager: React.FC = () => {
    const [rules, setRules] = useState<AlertRule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterSeverity, setFilterSeverity] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setRules(generateMockAlertRules(10));
            setIsLoading(false);
        }, getRandomInt(300, 1000));
        return () => clearTimeout(timer);
    }, []);

    const filteredRules = useMemo(() => {
        let filtered = rules;
        if (filterStatus !== 'All') filtered = filtered.filter(rule => rule.status === filterStatus);
        if (filterSeverity !== 'All') filtered = filtered.filter(rule => rule.severity === filterSeverity);
        if (searchTerm) {
            filtered = filtered.filter(rule =>
                rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.metric.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [rules, filterStatus, filterSeverity, searchTerm]);

    const handleCreateRule = useCallback(() => alert("Simulating: Navigate to Create Alert"), []);
    const handleEditRule = useCallback((id: string) => alert(`Simulating: Edit Alert ID: ${id}`), []);
    const handleToggleStatus = useCallback((id: string, currentStatus: string, name: string) => {
        setRules(prev => prev.map(rule => rule.id === id ? { ...rule, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : rule));
        alert(`Simulating: Toggled status for "${name}"`);
    }, []);
    const handleDeleteRule = useCallback((id: string, name: string) => {
        if (window.confirm(`Delete rule "${name}"?`)) {
            setRules(prev => prev.filter(r => r.id !== id));
            alert(`Simulating: Rule "${name}" deleted.`);
        }
    }, []);

    if (isLoading) return <Card title="Alert Rules Management" className="min-h-[400px] flex items-center justify-center"><p className="text-gray-400">Loading...</p></Card>;

    return (
        <Card title="Alert Rules Management">
             <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <div className="flex flex-wrap gap-2">
                    <select className="bg-gray-700 text-white border border-gray-600 rounded-md p-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <select className="bg-gray-700 text-white border border-gray-600 rounded-md p-2" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                        <option value="All">All Severities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                    <input type="text" placeholder="Search rules..." className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 w-48 md:w-auto" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                <button onClick={handleCreateRule} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">+ Create Rule</button>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Metric</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Threshold</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Severity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {filteredRules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{rule.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{rule.metric}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{rule.operator === 'gt' ? '>' : '<'} {rule.threshold}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rule.severity === 'Critical' ? 'bg-red-100 text-red-800' : rule.severity === 'High' ? 'bg-orange-100 text-orange-800' : rule.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{rule.severity}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rule.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{rule.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleToggleStatus(rule.id, rule.status, rule.name)} className={`ml-4 px-2 py-1 rounded ${rule.status === 'Active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>{rule.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                                    <button onClick={() => handleEditRule(rule.id)} className="text-indigo-400 hover:text-indigo-300 ml-4 px-2 py-1 rounded">Edit</button>
                                    <button onClick={() => handleDeleteRule(rule.id, rule.name)} className="text-red-400 hover:text-red-300 ml-4 px-2 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};