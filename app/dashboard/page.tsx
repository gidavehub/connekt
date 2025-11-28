'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FirestoreService } from '@/lib/services/firestore-service';
import ProjectAnalytics from '@/components/dashboard/ProjectAnalytics';
import Reminders from '@/components/dashboard/Reminders';
import TeamCollaboration from '@/components/dashboard/TeamCollaboration';
import TaskProgress from '@/components/dashboard/TaskProgress';
import ProjectList from '@/components/dashboard/ProjectList';
import TimeTracker from '@/components/dashboard/TimeTracker';
import ProjectsModal from '@/components/dashboard/ProjectsModal';
import TasksModal from '@/components/dashboard/TasksModal';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({ total: 0, completed: 0, running: 0, pending: 0, runningTasks: 0, pendingTasks: 0, pendingPOT: 0 });
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState<{ isOpen: boolean; type: string; data: any }>({ isOpen: false, type: '', data: null });
    const [tasksModalState, setTasksModalState] = useState<{ isOpen: boolean; type: string; data: any }>({ isOpen: false, type: '', data: null });

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const s = await FirestoreService.getProjectStats(user.uid);
                // Fetch additional task stats
                setStats({
                    ...s,
                    runningTasks: 12, // Mock data - should be fetched from Firestore
                    pendingTasks: 8,  // Mock data
                    pendingPOT: 5     // Mock data
                });
                setLoading(false);
            };
            fetchData();
        }
    }, [user]);

    const openModal = (type: string, data: any) => {
        setModalState({ isOpen: true, type, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: '', data: null });
    };

    const openTasksModal = (type: string, data: any) => {
        setTasksModalState({ isOpen: true, type, data });
    };

    const closeTasksModal = () => {
        setTasksModalState({ isOpen: false, type: '', data: null });
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Plan, prioritize, and accomplish your tasks with ease.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push('/projects/create')}
                        className="px-5 py-2.5 bg-[#008080] hover:bg-teal-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                    >
                        <Plus size={16} /> Add Project
                    </button>
                    <button className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        Import Data
                    </button>
                </div>
            </div>

            {/* Row 1: Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Running Projects */}
                <button onClick={() => openModal('runningProjects', { count: stats.running, type: 'projects' })} className="text-left group">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg cursor-pointer">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Running Projects</p>
                        <p className="text-4xl font-bold text-blue-600 mb-1">{stats.running}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">Click to view details</p>
                    </div>
                </button>

                {/* Running Tasks */}
                <button onClick={() => openModal('runningTasks', { count: stats.runningTasks, type: 'tasks' })} className="text-left group">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 transition-all hover:shadow-lg cursor-pointer">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Running Tasks</p>
                        <p className="text-4xl font-bold text-green-600 mb-1">{stats.runningTasks}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">Click to view details</p>
                    </div>
                </button>

                {/* Pending Tasks */}
                <button onClick={() => openModal('pendingTasks', { count: stats.pendingTasks, type: 'tasks' })} className="text-left group">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-all hover:shadow-lg cursor-pointer">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pending Tasks</p>
                        <p className="text-4xl font-bold text-yellow-600 mb-1">{stats.pendingTasks}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">Click to view details</p>
                    </div>
                </button>

                {/* Pending Task POT */}
                <button onClick={() => openModal('pendingPOT', { count: stats.pendingPOT, type: 'pot' })} className="text-left group">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all hover:shadow-lg cursor-pointer">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pending Task POT</p>
                        <p className="text-4xl font-bold text-orange-600 mb-1">{stats.pendingPOT}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">Click to view details</p>
                    </div>
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto">

                {/* Left Column (2/3 width) */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Row 2: Analytics & Reminders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
                        <ProjectAnalytics />
                        <Reminders />
                    </div>

                    {/* Row 3: Team & Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[280px]">
                        <button onClick={() => openModal('dashboardList', { component: 'team' })} className="text-left h-full">
                            <div className="h-full hover:shadow-lg transition-all cursor-pointer">
                                <TeamCollaboration />
                            </div>
                        </button>
                        <button onClick={() => openTasksModal('taskList', { component: 'progress' })} className="text-left h-full">
                            <div className="h-full hover:shadow-lg transition-all cursor-pointer">
                                <TaskProgress />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Column (1/3 width) */}
                <div className="space-y-6">
                    <ProjectList />
                    <TimeTracker />
                </div>
            </div>

            {/* Dashboard Modal for Stats */}
            <ProjectsModal
                isOpen={modalState.isOpen}
                type={modalState.type as any}
                data={modalState.data}
                onClose={closeModal}
            />

            {/* Tasks Modal */}
            <TasksModal
                isOpen={tasksModalState.isOpen}
                type={tasksModalState.type as any}
                data={tasksModalState.data}
                onClose={closeTasksModal}
            />
        </div>
    );
}
