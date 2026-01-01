import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import { Template } from '../types';
import { generateMockTemplates, getRandomInt } from '../utils/mockData';

export const TemplateManager: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterChannel, setFilterChannel] = useState<string>('All');
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setTemplates(generateMockTemplates(15));
            setIsLoading(false);
        }, getRandomInt(400, 1200));
        return () => clearTimeout(timer);
    }, []);

    const availableCategories = useMemo(() => ['All', ...new Set(templates.map(t => t.category))], [templates]);

    const filteredTemplates = useMemo(() => {
        let filtered = templates;
        if (filterChannel !== 'All') {
            filtered = filtered.filter(t => t.channel === filterChannel);
        }
        if (filterCategory !== 'All') {
            filtered = filtered.filter(t => t.category === filterCategory);
        }
        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
                t.previewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return filtered;
    }, [templates, filterChannel, filterCategory, searchTerm]);

    const handleCreateTemplate = useCallback(() => alert("Simulating: Navigate to Create Template Page"), []);
    const handleEditTemplate = useCallback((id: string) => alert(`Simulating: Edit Template ID: ${id}`), []);
    const handlePreviewTemplate = useCallback((id: string) => alert(`Simulating: Preview Template ID: ${id}`), []);
    const handleDeleteTemplate = useCallback((id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete template "${name}" (ID: ${id})?`)) {
            setTemplates(prev => prev.filter(t => t.id !== id));
            alert(`Simulating: Template "${name}" deleted.`);
        }
    }, []);

    if (isLoading) {
        return <Card title="Template Management" className="min-h-[600px] flex items-center justify-center"><p className="text-gray-400">Loading templates...</p></Card>;
    }

    return (
        <Card title="Template Management">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                <div className="flex flex-wrap gap-2">
                    <select
                        className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filterChannel}
                        onChange={(e) => setFilterChannel(e.target.value)}
                    >
                        <option value="All">All Channels</option>
                        <option value="Email">Email</option>
                        <option value="SMS">SMS</option>
                        <option value="Voice">Voice</option>
                    </select>
                    <select
                        className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {availableCategories.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 w-48 md:w-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleCreateTemplate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
                >
                    + Create New Template
                </button>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Channel</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subject / Preview</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Version</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Modified</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                        {filteredTemplates.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">No templates found.</td></tr>
                        ) : (
                            filteredTemplates.map((template) => (
                                <tr key={template.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {template.name}
                                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${template.status === 'Active' ? 'bg-green-100 text-green-800' : template.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{template.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{template.channel}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{template.subject || template.previewText}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{template.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{template.version}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(template.lastModified).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handlePreviewTemplate(template.id)} className="text-purple-400 hover:text-purple-300 ml-4 px-2 py-1 rounded">Preview</button>
                                        <button onClick={() => handleEditTemplate(template.id)} className="text-indigo-400 hover:text-indigo-300 ml-4 px-2 py-1 rounded">Edit</button>
                                        <button onClick={() => handleDeleteTemplate(template.id, template.name)} className="text-red-400 hover:text-red-300 ml-4 px-2 py-1 rounded">Delete</button>
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