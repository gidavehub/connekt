"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, X, BarChart3, List, Eye } from 'lucide-react';

const projects = [
    { id: 'ecommerce', name: 'E-Commerce Platform', status: 'In Progress', date: 'Due Dec 5', color: 'orange', progress: 65, tasks: 24, completed: 15, budget: 5000, spent: 3200, members: ['Alice', 'Bob', 'Charlie'] },
    { id: 'analytics', name: 'Dashboard Analytics', status: 'Completed', date: 'Nov 28', color: 'green', progress: 100, tasks: 18, completed: 18, budget: 3000, spent: 3000, members: ['Diana', 'Edward'] },
    { id: 'mobile', name: 'Mobile App Launch', status: 'Pending', date: 'Dec 15', color: 'gray', progress: 10, tasks: 32, completed: 3, budget: 8000, spent: 500, members: ['Frank', 'Grace', 'Henry'] },
    { id: 'docs', name: 'API Documentation', status: 'In Progress', date: 'Dec 3', color: 'orange', progress: 45, tasks: 12, completed: 5, budget: 2000, spent: 900, members: ['Ivan'] },
];

export default function ProjectList() {
    const [selected, setSelected] = useState<any | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'overview' | 'stats' | 'list'>('overview');
    const router = useRouter();

    const openModal = (project: any) => {
        setSelected(project);
        setIsOpen(true);
        setViewMode('overview');
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelected(null);
    };

    const goToProject = (projectId: string) => {
        // Navigate to the project dynamic route. The project page layout already sits inside the main content,
        // so this will replace the right container while keeping Sidebar and TopNav intact.
        router.push(`/projects/${projectId}`);
    };

    return (
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-lg border border-white/20 dark:border-white/5 rounded-2xl p-6 h-[420px] overflow-y-auto custom-scrollbar relative">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Projects</h3>
                <button className="text-xs text-[#008080] hover:underline font-medium">View All</button>
            </div>
            <div className="space-y-3">
                {projects.map((project, i) => (
                    <div key={project.id} onClick={() => openModal(project)} className="cursor-pointer flex items-start justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{project.name}</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${project.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' :
                                        project.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                                            'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {project.status}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{project.date}</span>
                            </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={16} className="text-gray-400" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal (keeps Sidebar and TopNav visible) */}
            {isOpen && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col w-full h-full max-w-6xl max-h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{selected.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selected.status} • {selected.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => goToProject(selected.id)} className="px-6 py-2.5 bg-[#008080] hover:bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20">Open Project</button>
                                <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"><X size={24} /></button>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-1 px-8 pt-6 border-b border-gray-100 dark:border-zinc-800">
                            <button onClick={() => setViewMode('overview')} className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${viewMode === 'overview' ? 'text-[#008080] border-b-2 border-[#008080]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}><Eye size={18} /> Overview</button>
                            <button onClick={() => setViewMode('stats')} className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${viewMode === 'stats' ? 'text-[#008080] border-b-2 border-[#008080]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}><BarChart3 size={18} /> Stats</button>
                            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${viewMode === 'list' ? 'text-[#008080] border-b-2 border-[#008080]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}><List size={18} /> Details</button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {viewMode === 'overview' && <OverviewView project={selected} />}
                            {viewMode === 'stats' && <StatsView project={selected} />}
                            {viewMode === 'list' && <ListView project={selected} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function OverviewView({ project }: { project: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Progress</p>
                    <p className="text-3xl font-bold text-blue-600">{project.progress}%</p>
                    <div className="mt-3 w-full bg-blue-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: `${project.progress}%`}}></div></div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tasks Completed</p>
                    <p className="text-3xl font-bold text-green-600">{project.completed}/{project.tasks}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget Used</p>
                    <p className="text-3xl font-bold text-purple-600">${project.spent}/${project.budget}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Team Members</p>
                    <p className="text-3xl font-bold text-orange-600">{project.members.length}</p>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl">
                <h4 className="font-bold text-lg mb-4">Team</h4>
                <div className="flex flex-wrap gap-3">
                    {project.members.map((m: string) => (
                        <div key={m} className="px-4 py-2 bg-white dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-700 text-sm font-medium">{m}</div>
                    ))}
                </div>
            </div>

            <AssignSupervisor projectId={project.id} />
        </div>
    );
}

function StatsView({ project }: { project: any }) {
    const chartBars = Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 100));
    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-bold text-lg mb-4">Progress Over Time</h4>
                <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl flex items-end gap-2 h-64">
                    {chartBars.map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-[#008080] to-teal-400 rounded-t-lg hover:opacity-75 transition-opacity" style={{height: `${h}%`}} title={`Week ${i + 1}: ${h}%`}></div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Avg. Completion Rate</p>
                    <p className="text-4xl font-bold text-indigo-600">{Math.floor((project.completed / project.tasks) * 100)}%</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 p-6 rounded-2xl border border-rose-200 dark:border-rose-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Budget Efficiency</p>
                    <p className="text-4xl font-bold text-rose-600">{Math.floor((project.spent / project.budget) * 100)}%</p>
                </div>
            </div>
        </div>
    );
}

function ListView({ project }: { project: any }) {
    const mockTasks = [
        { id: 1, title: 'Design Homepage', assignee: 'Alice', status: 'done', priority: 'high' },
        { id: 2, title: 'Setup Database', assignee: 'Bob', status: 'in-progress', priority: 'high' },
        { id: 3, title: 'API Integration', assignee: 'Charlie', status: 'todo', priority: 'medium' },
        { id: 4, title: 'Testing', assignee: 'Alice', status: 'pending', priority: 'low' },
        { id: 5, title: 'Documentation', assignee: 'Bob', status: 'todo', priority: 'low' },
    ];

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-lg">Recent Tasks</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-zinc-700">
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Title</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Assignee</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Status</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTasks.map(t => (
                            <tr key={t.id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="py-3 px-4">{t.title}</td>
                                <td className="py-3 px-4">{t.assignee}</td>
                                <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${t.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : t.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 'bg-gray-100 text-gray-700 dark:bg-gray-700'}`}>{t.status}</span></td>
                                <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${t.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : t.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' : 'bg-gray-100 text-gray-700 dark:bg-gray-700'}`}>{t.priority}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AssignSupervisor({ projectId }: { projectId: string }) {
    const [managerId, setManagerId] = (useState as any)('');
    const [managerType, setManagerType] = (useState as any)('user');
    const [loading, setLoading] = (useState as any)(false);
    const [message, setMessage] = (useState as any)(null);

    const submit = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`/api/projects/${projectId}/assign-manager`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ managerId, managerType, transferredBy: managerId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed');
            setMessage({ type: 'success', text: 'Manager assigned' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-6 rounded-2xl border border-teal-200 dark:border-teal-700">
            <h4 className="font-bold text-lg mb-4">Assign Manager/Supervisor</h4>
            <div className="space-y-3">
                <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Manager ID / Username</label>
                    <input value={managerId} onChange={(e) => setManagerId(e.target.value)} className="w-full mt-1 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm" placeholder="uid or username" />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Type</label>
                    <select value={managerType} onChange={(e) => setManagerType(e.target.value)} className="w-full mt-1 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm">
                        <option value="user">Internal User</option>
                        <option value="external">External Manager</option>
                    </select>
                </div>
                <button onClick={submit} disabled={loading} className="w-full px-4 py-2 bg-[#008080] hover:bg-teal-600 text-white rounded-lg font-bold transition-colors">
                    {loading ? 'Assigning...' : 'Assign Manager'}
                </button>
                {message && <p className={`text-sm text-center ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</p>}
            </div>
        </div>
    );
}
