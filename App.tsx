import React, { useState, useCallback } from 'react';
import { 
    LayoutDashboard, Megaphone, FileText, Users, Settings, FileBarChart, ShieldCheck, 
    Activity, Radio, Server, Clock 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import Card from './components/Card';
import { CommunicationOverviewMetrics, DailyCommunicationsTrend, ChannelUsagePieChart } from './components/Dashboard';
import { CampaignList } from './components/Campaigns';
import { TemplateManager } from './components/Templates';
import { AudienceSegmentManager } from './components/Audiences';
import { ChannelConfigurationManager, AlertRulesManager } from './components/Settings';
import { CommunicationCostAnalysis, AuditLogViewer } from './components/Reports';
import { UserAndRoleManagement, ScheduledJobsMonitor, SystemHealthMonitor, LiveCommunicationFeed } from './components/Admin';

const deliverabilityData = [
    { name: 'Mon', email: 99.8, sms: 99.5 }, { name: 'Tue', email: 99.9, sms: 99.6 },
    { name: 'Wed', email: 99.7, sms: 99.4 }, { name: 'Thu', email: 99.9, sms: 99.7 },
    { name: 'Fri', email: 99.8, sms: 99.5 }, { name: 'Sat', email: 99.9, sms: 99.8 },
    { name: 'Sun', email: 99.9, sms: 99.7 },
];

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    const renderSection = useCallback(() => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <Card className="text-center"><p className="text-3xl font-bold text-white">1.25M</p><p className="text-sm text-gray-400 mt-1">Emails Sent (30d)</p></Card>
                            <Card className="text-center"><p className="text-3xl font-bold text-white">850k</p><p className="text-sm text-gray-400 mt-1">SMS Sent (30d)</p></Card>
                            <Card className="text-center"><p className="text-3xl font-bold text-white">50k</p><p className="text-sm text-gray-400 mt-1">Voice Minutes (30d)</p></Card>
                        </div>
                        <CommunicationOverviewMetrics />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <ChannelUsagePieChart />
                            <Card title="Deliverability Rate (%)">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={deliverabilityData}>
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" domain={[98, 100]} unit="%" />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }}/>
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        <Line type="monotone" dataKey="email" stroke="#8884d8" name="Email" />
                                        <Line type="monotone" dataKey="sms" stroke="#82ca9d" name="SMS" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                        <div className="mt-6"><DailyCommunicationsTrend /></div>
                    </>
                );
            case 'campaigns': return <CampaignList />;
            case 'templates': return <TemplateManager />;
            case 'audiences': return <AudienceSegmentManager />;
            case 'settings':
                return <div className="space-y-6"><ChannelConfigurationManager /><AlertRulesManager /></div>;
            case 'reports':
                return <div className="space-y-6"><CommunicationCostAnalysis /><AuditLogViewer /></div>;
            case 'admin':
                return <div className="space-y-6"><UserAndRoleManagement /><ScheduledJobsMonitor /><SystemHealthMonitor /><LiveCommunicationFeed /></div>;
            default: return null;
        }
    }, [activeSection]);

    const NavButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button
            onClick={() => setActiveSection(id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${activeSection === id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
            <Icon size={18} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
            <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg"><Activity className="text-white" size={24} /></div>
                            <span className="text-xl font-bold tracking-tight text-white">BankComms<span className="text-blue-500">Platform</span></span>
                        </div>
                        <div className="hidden md:block"><div className="ml-10 flex items-baseline space-x-4"><span className="text-gray-400 text-sm">Enterprise Edition v2.4</span></div></div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-1">
                            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main</p>
                            <NavButton id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                            <NavButton id="campaigns" label="Campaigns" icon={Megaphone} />
                            <NavButton id="templates" label="Templates" icon={FileText} />
                            <NavButton id="audiences" label="Audiences" icon={Users} />
                            
                            <div className="pt-4 pb-2">
                                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">System</p>
                                <NavButton id="reports" label="Reports & Audit" icon={FileBarChart} />
                                <NavButton id="settings" label="Settings" icon={Settings} />
                                <NavButton id="admin" label="Admin Tools" icon={ShieldCheck} />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white capitalize">{activeSection.replace('-', ' ')}</h1>
                            <p className="text-gray-400 text-sm mt-1">Manage your banking communications infrastructure.</p>
                        </div>
                        {renderSection()}
                    </main>
                </div>
            </div>
            
            <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Demo Bank Communications. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;