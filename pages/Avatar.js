import { useState, useRef } from 'react';
import Avatar from '../components/ui/Avatar';
import Avatar2 from '../components/ui/Avatar2';
import IDE from '../components/IDE';
import Link from 'next/link';
import { ArrowLeft, Zap, MicOff } from 'lucide-react';

export default function AvatarPage() {
    const [files, setFiles] = useState([
        {
            name: 'matrix_protocol.js',
            language: 'javascript',
            content: '// ANTIGRAVITY OS v2.0\n// Initializing Neural Interface...\n\nconst system = {\n  state: "FLOATING",\n  security: "MAXIMUM"\n};\n\nfunction connect() {\n  return "Link Established";\n}'
        }
    ]);

    // Centralized connection state
    const [isConnected, setIsConnected] = useState(false);
    const avatarRef = useRef(null);

    const handleCodeGenerated = (newCode, fileName = 'generated.js', language = 'javascript') => {
        const existingIndex = files.findIndex(f => f.name === fileName);
        if (existingIndex >= 0) {
            const updatedFiles = [...files];
            updatedFiles[existingIndex] = { name: fileName, language, content: newCode };
            setFiles(updatedFiles);
        } else {
            setFiles([...files, { name: fileName, language, content: newCode }]);
        }
    };

    // Centralized connect function - only connects one agent
    const handleConnect = async () => {
        try {
            if (avatarRef.current?.connect) {
                await avatarRef.current.connect();
            }
            setIsConnected(true);
        } catch (error) {
            console.error('Error connecting agent:', error);
        }
    };

    // Centralized disconnect function
    const handleDisconnect = async () => {
        try {
            if (avatarRef.current?.disconnect) {
                await avatarRef.current.disconnect();
            }
            setIsConnected(false);
        } catch (error) {
            console.error('Error disconnecting agent:', error);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#020205] text-white font-sans overflow-hidden relative transition-all duration-700">

            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Application Window Container */}
            <div className="w-full h-full bg-[#0a0a0a]/60 backdrop-blur-2xl flex flex-col overflow-hidden relative">

                {/* Header Bar */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] shrink-0 z-50">
                    <div className="flex gap-4 items-center">
                        <Link
                            href="/?skipLoading=true"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-all group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="text-xs font-mono uppercase tracking-widest">Home</span>
                        </Link>
                    </div>

                    {/* Centralized Connection Control */}
                    <div className="flex items-center gap-4">
                        {!isConnected ? (
                            <button
                                onClick={handleConnect}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-all font-mono text-xs uppercase tracking-wider"
                            >
                                <Zap className="w-4 h-4" />
                                <span>Connect Agent</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleDisconnect}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-all font-mono text-xs uppercase tracking-wider"
                            >
                                <MicOff className="w-4 h-4" />
                                <span>Disconnect</span>
                            </button>
                        )}

                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/5 backdrop-blur-md">
                            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                            <span className="text-[10px] text-emerald-100/50 font-mono tracking-widest uppercase">
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Body - 60-20-20 Split Layout */}
                <div className="flex flex-1 overflow-hidden relative">

                    {/* IDE Area - 60% */}
                    <div className="flex-[3] border-r border-white/5 bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col min-w-0">
                        <div className="h-full flex flex-col">
                            <IDE files={files} onFileChange={setFiles} />
                        </div>
                    </div>

                    {/* Avatar 1 Area - 20% - Same Agent */}
                    <div className="flex-1 border-r border-white/5 flex flex-col relative z-0">
                        <div className="flex-1 relative overflow-hidden">
                            <Avatar
                                ref={avatarRef}
                                onCodeGenerated={handleCodeGenerated}
                                viewMode="focus"
                                onModeChange={() => { }}
                                agentEndpoint="/api/signed-url"
                                agentLabel="AI Agent"
                                isConnected={isConnected}
                            />
                        </div>
                    </div>

                    {/* Avatar 2 Area - 20% - Same Agent (visual only) */}
                    <div className="flex-1 flex flex-col relative z-0">
                        <div className="flex-1 relative overflow-hidden">
                            <Avatar2
                                onCodeGenerated={handleCodeGenerated}
                                agentLabel="AI Agent"
                                isConnected={isConnected}
                                showChatInterface={false}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
