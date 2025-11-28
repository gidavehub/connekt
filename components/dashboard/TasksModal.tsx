'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, BarChart3, List, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export type TasksModalType = 'taskList' | 'taskDetails' | 'taskStats' | null;

interface TasksModalProps {
    isOpen: boolean;
    type: TasksModalType;
    data: any;
    onClose: () => void;
}

export default function TasksModal({ isOpen, type, data, onClose }: TasksModalProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'overview' | 'stats' | 'list'>('overview');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !type || !data || !mounted) return null;

    const goToRoute = (route: string) => {
        router.push(route);
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col w-full h-full max-w-6xl max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {type === 'taskList' && 'Task List & Progress'}
                            {type === 'taskDetails' && 'Task Details'}
                            {type === 'taskStats' && 'Task Statistics'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {type === 'taskList' && 'Manage and track all your tasks in one place'}
                            {type === 'taskDetails' && 'View detailed information about this task'}
                            {type === 'taskStats' && 'Analytics and insights about your tasks'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 px-8 pt-6 border-b border-gray-100 dark:border-zinc-800">
                    <button onClick={() => setViewMode('overview')} className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${viewMode === 'overview' ? 'text-[#008080] border-b-2 border-[#008080]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        <Eye size={18} /> Overview
                    </button>
                    <button onClick={() => setViewMode('stats')} className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${viewMode === 'stats' ? 'text-[#008080] border-b-2 border-[#008080]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        <BarChart3 size={18} /> Statistics
                    </button>
                    <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${viewMode === 'list' ? 'text-[#008080] border-b-2 border-[#008080]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        <List size={18} /> List View
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {type === 'taskList' && viewMode === 'overview' && <TaskOverview data={data} />}
                    {type === 'taskList' && viewMode === 'stats' && <TaskStatistics data={data} />}
                    {type === 'taskList' && viewMode === 'list' && <TaskListView data={data} />}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

function TaskOverview({ data }: { data: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                        <CheckCircle size={20} className="text-blue-600" />
                    </div>
                    <p className="text-4xl font-bold text-blue-600">32</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">All task types</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                        <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <p className="text-4xl font-bold text-green-600">18</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">56% completion rate</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                        <Clock size={20} className="text-orange-600" />
                    </div>
                    <p className="text-4xl font-bold text-orange-600">8</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Being worked on</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-2xl border border-red-200 dark:border-red-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        <AlertCircle size={20} className="text-red-600" />
                    </div>
                    <p className="text-4xl font-bold text-red-600">4</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Awaiting review</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
                        <AlertCircle size={20} className="text-purple-600" />
                    </div>
                    <p className="text-4xl font-bold text-purple-600">6</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Requires attention</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 p-6 rounded-2xl border border-cyan-200 dark:border-cyan-700">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                        <AlertCircle size={20} className="text-cyan-600" />
                    </div>
                    <p className="text-4xl font-bold text-cyan-600">2</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Past deadline</p>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl">
                <h4 className="font-bold text-lg mb-4">Quick Stats</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Average Time to Complete</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">3.5 days</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Completion This Week</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">5 tasks</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TaskStatistics({ data }: { data: any }) {
    const chartBars = Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 10));

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-bold text-lg mb-4">Tasks Completed This Week</h4>
                <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl flex items-end gap-3 h-64">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div key={day} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gradient-to-t from-[#008080] to-teal-400 rounded-t-lg hover:opacity-75 transition-opacity" style={{ height: `${chartBars[i] * 20}px` }} title={`${day}: ${chartBars[i]} tasks`}></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{day}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Task Completion Rate</p>
                    <p className="text-4xl font-bold text-indigo-600">56%</p>
                    <div className="mt-3 w-full bg-indigo-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 p-6 rounded-2xl border border-rose-200 dark:border-rose-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Priority Distribution</p>
                    <p className="text-4xl font-bold text-rose-600">6 High</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">18% of total tasks</p>
                </div>
            </div>
        </div>
    );
}

function TaskListView({ data }: { data: any }) {
    const mockTasks = [
        { id: 1, title: 'Design Homepage', project: 'E-Commerce', assignee: 'Alice', status: 'completed', priority: 'high', dueDate: 'Nov 20' },
        { id: 2, title: 'Setup Database', project: 'Mobile App', assignee: 'Bob', status: 'in-progress', priority: 'high', dueDate: 'Dec 3' },
        { id: 3, title: 'API Integration', project: 'Analytics', assignee: 'Charlie', status: 'in-progress', priority: 'medium', dueDate: 'Dec 8' },
        { id: 4, title: 'Testing Phase', project: 'E-Commerce', assignee: 'Alice', status: 'pending', priority: 'low', dueDate: 'Dec 10' },
        { id: 5, title: 'Documentation', project: 'Mobile App', assignee: 'Bob', status: 'pending', priority: 'low', dueDate: 'Dec 12' },
        { id: 6, title: 'Security Audit', project: 'Analytics', assignee: 'Edward', status: 'todo', priority: 'high', dueDate: 'Dec 15' },
    ];

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-lg mb-4">All Tasks</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-zinc-700">
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Title</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Project</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Assignee</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Priority</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTasks.map(t => (
                            <tr key={t.id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                                <td className="py-3 px-4 font-medium">{t.title}</td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{t.project}</td>
                                <td className="py-3 px-4">{t.assignee}</td>
                                <td className="py-3 px-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        t.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                                        t.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                                        t.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-700'
                                    }`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        t.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                                        t.priority === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-700'
                                    }`}>
                                        {t.priority}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{t.dueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
