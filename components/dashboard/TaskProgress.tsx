'use client';

export default function TaskProgress() {
    const tasks = [
        { name: 'Design Homepage', progress: 100, status: 'completed', color: 'green' },
        { name: 'Setup Database', progress: 65, status: 'in-progress', color: 'orange' },
        { name: 'API Integration', progress: 40, status: 'in-progress', color: 'teal' },
        { name: 'Security Testing', progress: 15, status: 'pending', color: 'red' },
    ];

    return (
        <div className="h-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-lg border border-white/20 dark:border-white/5 rounded-2xl p-6 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Task Progress</h3>
                <button className="text-xs text-[#008080] hover:underline font-medium">See All</button>
            </div>
            <div className="space-y-6">
                {tasks.map((task, i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{task.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{task.status}</p>
                            </div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{task.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${task.color === 'teal' ? 'bg-[#008080]' :
                                        task.color === 'orange' ? 'bg-orange-500' :
                                        task.color === 'green' ? 'bg-green-500' :
                                            'bg-red-500'
                                    }`}
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
