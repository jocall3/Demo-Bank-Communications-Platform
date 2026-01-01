import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from './Card';
import { CostSummary, AuditLogEntry } from '../types';
import { generateMockCostSummaries, generateMockAuditLogs, getRandomInt } from '../utils/mockData';

export const CommunicationCostAnalysis: React.FC = () => {
    const [costData, setCostData] = useState<CostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setCostData(generateMockCostSummaries(12));
            setIsLoading(false);
        }, getRandomInt(500, 1500));
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <Card title="Cost Analysis" className="min-h-[400px] flex items-center justify-center"><p className="text-gray-400">Loading...</p></Card>;

    return (
        <Card title="Communication Cost Analysis (Last 12 Months)">
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={costData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="emailCost" stackId="1" name="Email Cost" stroke="#8884d8" fill="#8884d8" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="smsCost" stackId="1" name="SMS Cost" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="voiceCost" stackId="1" name="Voice Cost" stroke="#ffc658" fill="#ffc658" fillOpacity={0.8} />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export const AuditLogViewer: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterUser, setFilterUser] = useState<string>('All');
    const [filterAction, setFilterAction] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setLogs(generateMockAuditLogs(30));
            setIsLoading(false);
        }, getRandomInt(400, 1200));
        return () => clearTimeout(timer);
    }, []);

    const availableUsers = useMemo(() => ['All', ...new Set(logs.map(log => log.user))], [logs]);
    const availableActions = useMemo(() => ['All', ...new Set(logs.map(log => log.action))], [logs]);

    const filteredLogs = useMemo(() => {
        let filtered = logs;
        if (filterUser !== 'All') filtered = filtered.filter(log => log.user === filterUser);
        if (filterAction !== 'All') filtered = filtered.filter(log => log.action === filterAction);
        if (searchTerm) {
            filtered = filtered.filter(log =>
                log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.entityId && log.entityId.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return filtered;
    }, [logs, filterUser, filterAction, searchTerm]);

    if (isLoading) return <Card title="Audit Logs" className="min-h-[500px] flex items-center justify-center"><p className="text-gray-400">Loading...</p></Card>;

    return (
        <Card title="Audit Logs">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <div className="flex flex-wrap gap-2">
                    <select className="bg-gray-700 text-white border border-gray-600 rounded-md p-2" value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
                        {availableUsers.map(user => <option key={user} value={user}>{user}</option>)}
                    </select>
                    <select className="bg-gray-700 text-white border border-gray-600 rounded-md p-2" value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
                        {availableActions.map(action => <option key={action} value={action}>{action}</option>)}
                    </select>
                    <input type="text" placeholder="Search log details..." className="bg-gray-700 text-white border border-gray-600 rounded-md p-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Entity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.user.split('@')[0]}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.action}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.entityType || 'N/A'} {log.entityId ? `(${log.entityId})` : ''}</td>
                                <td className="px-6 py-4 text-sm text-gray-300 max-w-lg truncate">{log.details}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.ipAddress || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};