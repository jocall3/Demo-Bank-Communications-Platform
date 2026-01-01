import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import { UserProfile, ScheduledJob, SystemHealthMetric, LiveMessage } from '../types';
import { generateMockUserProfiles, generateMockScheduledJobs, generateMockSystemHealthMetrics, generateMockLiveMessages, getRandomInt, getRandom } from '../utils/mockData';

export const UserAndRoleManagement: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setUsers(generateMockUserProfiles(10));
            setIsLoading(false);
        }, getRandomInt(300, 1000));
    }, []);

    if (isLoading) return <Card title="User Management" className="min-h-[400px] flex items-center justify-center"><p className="text-gray-400">Loading...</p></Card>;

    return (
        <Card title="User & Role Management">
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-400 hover:text-indigo-300 ml-4 px-2 py-1 rounded">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const ScheduledJobsMonitor: React.FC = () => {
    const [jobs, setJobs] = useState<ScheduledJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setJobs(generateMockScheduledJobs(10));
            setIsLoading(false);
        }, getRandomInt(500, 1500));
    }, []);

    if (isLoading) return <Card title="Scheduled Jobs" className="min-h-[400px] flex items-center justify-center"><p className="text-gray-400">Loading...</p></Card>;

    return (
        <Card title="Scheduled Jobs & Automation">
             <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Next Run</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-800">
                                <td className="px-6 py-4 text-sm font-medium text-white">{job.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{job.status}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{new Date(job.nextRun).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const SystemHealthMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<SystemHealthMetric[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const interval = setInterval(() => setMetrics(generateMockSystemHealthMetrics()), 5000);
        setTimeout(() => setIsLoading(false), 1000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) return <Card title="System Health" className="min-h-[250px] flex items-center justify-center"><p className="text-gray-400">Loading...</p></Card>;

    return (
        <Card title="System Health Monitoring">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((metric) => (
                    <div key={metric.name} className={`p-4 rounded-lg shadow-md border ${metric.status === 'Critical' ? 'bg-red-900 border-red-700' : metric.status === 'Warning' ? 'bg-yellow-900 border-yellow-700' : 'bg-gray-800 border-gray-700'}`}>
                        <p className="text-lg font-medium text-white">{metric.name}</p>
                        <p className="text-2xl font-bold mt-1 text-white">{metric.value.toFixed(metric.unit === '%' ? 2 : 0)}{metric.unit}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const LiveCommunicationFeed: React.FC = () => {
    const [messages, setMessages] = useState<LiveMessage[]>([]);

    useEffect(() => {
        setMessages(generateMockLiveMessages(15));
        const interval = setInterval(() => {
            setMessages(prev => {
                const newMsgs = generateMockLiveMessages(getRandomInt(1, 3));
                return [...newMsgs, ...prev].slice(0, 15);
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card title="Live Communication Feed">
            <ul className="space-y-3">
                {messages.map((msg) => (
                    <li key={msg.id} className="p-3 bg-gray-800 rounded-lg shadow-sm flex items-start space-x-3 border border-gray-700">
                        <div className="text-sm font-semibold text-gray-400 min-w-[70px]">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                        <div className="flex-grow">
                            <p className="text-white text-base">
                                <span className={`font-semibold ${msg.status === 'Failed' ? 'text-red-400' : 'text-green-400'}`}>{msg.status}</span> {msg.channel} to <span className="font-mono text-blue-300">{msg.recipient}</span>
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};