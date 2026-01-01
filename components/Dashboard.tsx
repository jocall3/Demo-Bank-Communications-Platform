import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import Card from './Card';
import { CommunicationSummary, DailyMetric } from '../types';
import { generateMockCommunicationSummaries, generateMockDailyMetrics, formatLargeNumber, getRandomInt } from '../utils/mockData';

export const CHART_COLORS = ['#06b6d4', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#00c49f'];

export const CommunicationOverviewMetrics: React.FC = () => {
    const [summary, setSummary] = useState<CommunicationSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setSummary(generateMockCommunicationSummaries());
            setIsLoading(false);
        }, getRandomInt(300, 1000));
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <div className="text-gray-400 text-center py-8">Loading detailed metrics...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {summary.map((item) => (
                <Card key={item.channel} className="text-center p-4 h-full flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{item.channel}</h3>
                        <p className="text-gray-400 text-sm mb-3">Last 30 days</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm flex-grow items-center">
                        <div className="flex flex-col items-center">
                            <p className="text-gray-400">Sent</p>
                            <p className="text-white text-lg font-bold">{formatLargeNumber(item.sent)}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-gray-400">Delivered</p>
                            <p className="text-white text-lg font-bold">{formatLargeNumber(item.delivered)}</p>
                        </div>
                        {item.openRate !== undefined && (
                            <>
                                <div className="flex flex-col items-center">
                                    <p className="text-gray-400">Open Rate</p>
                                    <p className="text-white text-lg font-bold">{item.openRate.toFixed(1)}%</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-gray-400">Click Rate</p>
                                    <p className="text-white text-lg font-bold">{item.clickRate?.toFixed(1)}%</p>
                                </div>
                            </>
                        )}
                        {item.optOutRate !== undefined && (
                             <div className="flex flex-col items-center">
                                <p className="text-gray-400">Opt-Out Rate</p>
                                <p className="text-white text-lg font-bold">{item.optOutRate.toFixed(2)}%</p>
                            </div>
                        )}
                        <div className="flex flex-col items-center col-span-2 mt-2">
                            <p className="text-gray-400">Failed</p>
                            <p className="text-red-400 text-xl font-bold">{formatLargeNumber(item.failed)}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export const DailyCommunicationsTrend: React.FC = () => {
    const [data, setData] = useState<DailyMetric[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setData(generateMockDailyMetrics(30)); 
            setIsLoading(false);
        }, getRandomInt(500, 1500));
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Card title="Daily Communication Trends" className="min-h-[400px] flex items-center justify-center"><p className="text-gray-400">Loading daily trends...</p></Card>;
    }

    return (
        <Card title="Daily Communication Trends (Last 30 Days)">
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorEmailSent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSMSSent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorVoiceMinutes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#9ca3af" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis stroke="#9ca3af" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="emailSent" name="Emails Sent" stroke="#8884d8" fillOpacity={1} fill="url(#colorEmailSent)" />
                    <Area type="monotone" dataKey="smsSent" name="SMS Sent" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSMSSent)" />
                    <Area type="monotone" dataKey="voiceMinutes" name="Voice Minutes" stroke="#ffc658" fillOpacity={1} fill="url(#colorVoiceMinutes)" />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

const usageData = [
    { name: 'Email', count: 1250000 },
    { name: 'SMS', count: 850000 },
    { name: 'Voice', count: 50000 },
];

export const ChannelUsagePieChart: React.FC = () => {
    return (
        <Card title="Usage Distribution by Channel">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={usageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {usageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};