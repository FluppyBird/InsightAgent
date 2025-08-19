import React from "react";
import Transcriber from "./component/Transcriber";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">🎧 InsightAgent: Audio Transcription</h1>
        <nav className="space-x-4 text-gray-600 text-sm">
          <a href="#" className="hover:text-black">Overview</a>
          <a href="#" className="hover:text-black">About Us</a>
        </nav>
      </header>

      <main className="flex-1 flex justify-center items-start pt-10 px-4">
        <Transcriber />
      </main>

      <footer className="bg-gray-900 text-white text-sm p-6 text-center mt-10">
        <h2 className="font-semibold mb-2">InsightAgent - Meetings Summarizer</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          InsightAgent is adaptable to various use cases and industries, supporting everything from internal meetings and sales calls to knowledge sharing and training
        </p>
        <hr className="my-4 border-gray-700" />
        <p className="text-gray-500 text-xs">© 2025 InsightAgent. All rights reserved.</p>
      </footer>
    </div>
  );
}
