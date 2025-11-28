"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, X } from 'lucide-react';

const projects = [
    { id: 'ecommerce', name: 'E-Commerce Platform', status: 'In Progress', date: 'Due Dec 5', color: 'orange' },
    { id: 'analytics', name: 'Dashboard Analytics', status: 'Completed', date: 'Nov 28', color: 'green' },
    { id: 'mobile', name: 'Mobile App Launch', status: 'Pending', date: 'Dec 15', color: 'gray' },
    { id: 'docs', name: 'API Documentation', status: 'In Progress', date: 'Dec 3', color: 'orange' },
];

export default function ProjectList() {
    const [selected, setSelected] = useState<any | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const openModal = (project: any) => {
        setSelected(project);
        setIsOpen(true);
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
                <div
                    className="fixed z-50 rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 overflow-auto"
                    style={{ top: 88, left: 280, right: 24, bottom: 24 }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{selected.status} • {selected.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => goToProject(selected.id)} className="px-4 py-2 bg-[#008080] text-white rounded-lg font-medium">Open Project</button>
                            <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"><X /></button>
                        </div>
                    </div>
                    <div className="p-6">
                        <h4 className="font-bold mb-2">Overview</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">This modal presents a larger view of the project inside the dashboard container. From here you can access project-level management actions such as assigning supervisors, viewing tasks, and opening the project workspace.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-1 bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                                <h5 className="font-bold mb-2">Timeline</h5>
                                <p className="text-xs text-gray-500">Start: TBD</p>
                                <p className="text-xs text-gray-500">Due: {selected.date}</p>
                            </div>
                            <div className="col-span-1 bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                                <h5 className="font-bold mb-2">Members</h5>
                                <p className="text-xs text-gray-500">Alice, Bob, Charlie</p>
                            </div>
                            <div className="col-span-1 bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                                <h5 className="font-bold mb-2">Actions</h5>
                                <button className="w-full py-2 px-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm mb-2">Assign Supervisor</button>
                                <button className="w-full py-2 px-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm">Submit Proof</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
