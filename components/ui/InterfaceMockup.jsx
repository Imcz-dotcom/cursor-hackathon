import React from 'react';

const InterfaceMockup = () => {
    return (
        <div className="relative w-full max-w-[1200px] mx-auto perspective-[2000px] group">
            {/* Ambient Glow behind the mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-emerald-500/20 blur-[100px] opacity-50 group-hover:opacity-75 transition-opacity duration-700" />

            <div
                className="relative bg-[#050505]/80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl transform transition-all duration-1000 ease-out group-hover:rotate-x-0 group-hover:rotate-y-0 group-hover:scale-100"
                style={{
                    transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 50px 100px -20px rgba(0,0,0,0.7)'
                }}
            >
                {/* Window Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-80" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[10px] text-blue-200/70 font-mono tracking-widest uppercase">Matrix_OS // Connected</span>
                    </div>
                    <div className="w-10" />
                </div>

                {/* Dashboard Content */}
                <div className="flex h-[400px] md:h-[550px] bg-gradient-to-b from-transparent to-black/80">
                    {/* Sidebar */}
                    <div className="w-64 flex flex-col border-r border-white/5 bg-white/[0.01]">
                        <div className="p-6">
                            <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse mb-8" />
                            <div className="space-y-1">
                                {['Overview', 'Deployments', 'Analytics', 'Settings'].map((item, i) => (
                                    <div key={item} className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-3 ${i === 0 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-gray-600'}`} />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto p-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400" />
                                <div className="flex flex-col">
                                    <div className="h-2 w-20 bg-white/10 rounded mb-1.5" />
                                    <div className="h-2 w-12 bg-white/5 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col">
                        {/* Top Bar */}
                        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8">
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>matrix-ai</span>
                                <span className="text-gray-600">/</span>
                                <span className="text-white">dashboard</span>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5" />
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs">+</div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex-1 overflow-hidden">
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] transition-colors group/card">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/card:border-blue-500/40 transition-colors">
                                                <div className="w-4 h-4 rounded-sm bg-blue-400/50" />
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono">24h</div>
                                        </div>
                                        <div className="h-2 w-16 bg-white/10 rounded mb-2" />
                                        <div className="h-6 w-24 bg-white/20 rounded" />
                                    </div>
                                ))}
                            </div>

                            {/* Chart Area */}
                            <div className="h-64 bg-white/[0.02] border border-white/5 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent" />
                                <div className="flex items-end gap-4 h-full px-4 pb-4">
                                    {[30, 45, 35, 60, 50, 75, 65, 85, 70, 90, 60, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-blue-500/10 rounded-t-sm relative group/bar hover:bg-blue-500/30 transition-colors" style={{ height: `${h}%` }}>
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400/50 rounded-t-sm shadow-[0_0_10px_rgba(59,130,246,0.5)] opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterfaceMockup;
