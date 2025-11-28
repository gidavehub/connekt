'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TasksModal from '@/components/dashboard/TasksModal';

export default function TasksPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Design Homepage', project: 'E-Commerce', status: 'completed', priority: 'high', dueDate: 'Nov 20', progress: 100 },
        { id: 2, title: 'Setup Database', project: 'Mobile App', status: 'in-progress', priority: 'high', dueDate: 'Dec 3', progress: 65 },
        { id: 3, title: 'API Integration', project: 'Analytics', status: 'in-progress', priority: 'medium', dueDate: 'Dec 8', progress: 40 },
        { id: 4, title: 'Testing Phase', project: 'E-Commerce', status: 'pending', priority: 'low', dueDate: 'Dec 10', progress: 0 },
        { id: 5, title: 'Documentation', project: 'Mobile App', status: 'pending', priority: 'low', dueDate: 'Dec 12', progress: 0 },
        { id: 6, title: 'Security Audit', project: 'Analytics', status: 'todo', priority: 'high', dueDate: 'Dec 15', progress: 0 },
    ]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalState, setModalState] = useState<{ isOpen: boolean; type: string; data: any }>({ isOpen: false, type: '', data: null });

    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             task.project.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const openModal = (type: string, data: any) => {
        setModalState({ isOpen: true, type, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: '', data: null });
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Tasks</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage and track all your tasks</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => openModal('taskList', { component: 'progress' })}
                        className="px-5 py-2.5 bg-[#008080] hover:bg-teal-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                    >
                        <Plus size={16} /> Add Task
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[250px] relative">
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm font-medium"
                >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="todo">To Do</option>
                </select>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map(task => (
                    <button
                        key={task.id}
                        onClick={() => openModal('taskDetails', task)}
                        className="text-left group"
                    >
                        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 hover:border-[#008080] dark:hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer h-full">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#008080]">{task.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    task.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-700'
                                }`}>
                                    {task.status}
                                </span>
                            </div>

                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{task.project}</p>

                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{task.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                                    <div
                                        className="bg-[#008080] h-2 rounded-full transition-all"
                                        style={{ width: `${task.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-700">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                                    task.priority === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-700'
                                }`}>
                                    {task.priority}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">{task.dueDate}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Modal */}
            <TasksModal
                isOpen={modalState.isOpen}
                type={modalState.type as any}
                data={modalState.data}
                onClose={closeModal}
            />
        </div>
    );
}
