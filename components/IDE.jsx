"use client";

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function IDE({ files = [], onFileChange }) {
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [localFiles, setLocalFiles] = useState(files.length > 0 ? files : [
        { name: 'example.js', language: 'javascript', content: '// Your generated code will appear here\n\nfunction hello() {\n  console.log("Hello from the IDE!");\n}' }
    ]);

    // Update local files when props change
    React.useEffect(() => {
        if (files.length > 0) {
            setLocalFiles(files);
        }
    }, [files]);

    const activeFile = localFiles[activeFileIndex] || localFiles[0];

    const handleEditorChange = (value) => {
        const updatedFiles = [...localFiles];
        updatedFiles[activeFileIndex] = {
            ...updatedFiles[activeFileIndex],
            content: value
        };
        setLocalFiles(updatedFiles);
        if (onFileChange) {
            onFileChange(updatedFiles);
        }
    };

    const addNewFile = () => {
        const newFile = {
            name: `untitled-${localFiles.length + 1}.js`,
            language: 'javascript',
            content: '// New file\n'
        };
        setLocalFiles([...localFiles, newFile]);
        setActiveFileIndex(localFiles.length);
    };

    const [showPreview, setShowPreview] = useState(false);

    const getFileIcon = (language) => {
        const icons = {
            javascript: '📜',
            typescript: '📘',
            python: '🐍',
            html: '🌐',
            css: '🎨',
            json: '📋',
            markdown: '📝',
        };
        return icons[language] || '📄';
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden shadow-xl">
            {/* File Tabs */}
            <div className="flex items-center bg-[#252526] border-b border-[#3e3e42] overflow-x-auto">
                {localFiles.map((file, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveFileIndex(index)}
                        className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap
              transition-colors border-r border-[#3e3e42]
              ${activeFileIndex === index
                                ? 'bg-[#1e1e1e] text-white'
                                : 'bg-[#2d2d30] text-gray-400 hover:bg-[#323233]'
                            }
            `}
                    >
                        <span>{getFileIcon(file.language)}</span>
                        <span>{file.name}</span>
                    </button>
                ))}
                <button
                    onClick={addNewFile}
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#323233] transition-colors"
                    title="New file"
                >
                    +
                </button>

                {/* Preview Button */}
                <button
                    onClick={() => setShowPreview(true)}
                    className="ml-auto px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-colors flex items-center gap-2"
                    title="Preview page"
                >
                    <span>👁️</span>
                    <span>Preview</span>
                </button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={activeFile?.language || 'javascript'}
                    value={activeFile?.content || ''}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={{
                        fontSize: 14,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        automaticLayout: true,
                        tabSize: 2,
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                />
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1 bg-[#007acc] text-white text-xs">
                <div className="flex items-center gap-4">
                    <span>{activeFile?.language?.toUpperCase()}</span>
                    <span>UTF-8</span>
                </div>
                <div>
                    Monaco Editor
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Preview</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium"
                            >
                                Close
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <iframe
                                srcDoc={`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        html { scroll-behavior: smooth; }
    </style>
</head>
<body>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <!-- Hero Section -->
        <section class="relative h-screen flex items-center justify-center">
            <div class="absolute inset-0 bg-black/30 z-10"></div>
            <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920')"></div>
            
            <div class="relative z-20 text-center text-white px-4">
                <h1 class="text-6xl font-bold mb-4 animate-fade-in">Discover Paradise</h1>
                <p class="text-2xl mb-8 opacity-90">Your dream vacation awaits</p>
                <button class="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
                    Explore Destinations
                </button>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-20 px-4">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Us</h2>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                        <div class="text-5xl mb-4">🏖️</div>
                        <h3 class="text-2xl font-bold mb-3 text-gray-800">Best Beaches</h3>
                        <p class="text-gray-600">Pristine beaches with crystal clear waters.</p>
                    </div>

                    <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                        <div class="text-5xl mb-4">🏨</div>
                        <h3 class="text-2xl font-bold mb-3 text-gray-800">Luxury Hotels</h3>
                        <p class="text-gray-600">5-star accommodations with world-class amenities.</p>
                    </div>

                    <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                        <div class="text-5xl mb-4">✈️</div>
                        <h3 class="text-2xl font-bold mb-3 text-gray-800">Easy Booking</h3>
                        <p class="text-gray-600">Simple and secure booking in just a few clicks.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="bg-cyan-600 py-16 px-4">
            <div class="max-w-4xl mx-auto text-center text-white">
                <h2 class="text-4xl font-bold mb-4">Ready for Your Adventure?</h2>
                <p class="text-xl mb-8 opacity-90">Book now and get 20% off your first vacation package</p>
                <button class="bg-white text-cyan-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl">
                    Book Now
                </button>
            </div>
        </section>
    </div>
</body>
</html>
                                `}
                                className="w-full h-full border-0"
                                title="Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
