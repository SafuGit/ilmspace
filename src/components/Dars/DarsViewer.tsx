"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

interface DarsViewerProps {
  playlistId: string;
}

interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

const getInitialNotes = (): Note[] => {
  const now = Date.now();
  return [
    {
      id: "1",
      timestamp: 260,
      content: "Key point regarding the first principle: Knowledge is knowing Allah, His Prophet, and the religion of Islam with evidence.",
      createdAt: new Date(now - 120000)
    },
    {
      id: "2",
      timestamp: 495,
      content: "Evidence from the Quran regarding the four matters mentioned in Surah Al-Asr.",
      createdAt: new Date(now - 600000)
    },
    {
      id: "3",
      timestamp: 690,
      content: "Remember to cross-reference this with the explanation of Sheikh Ibn Baz.",
      createdAt: new Date(now - 900000)
    }
  ];
};

export default function DarsViewer({ playlistId }: DarsViewerProps) {
  // TODO: Use playlistId to fetch playlist data from API
  const [activeTab, setActiveTab] = useState<"notes" | "playlist">("notes");
  const [notes, setNotes] = useState<Note[]>(() => getInitialNotes());
  const [currentNote, setCurrentNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState(765); // 12:45
  const [duration] = useState(2700); // 45:00
  const [showControls, setShowControls] = useState(false);
  const [isSynced, setIsSynced] = useState(true);

  useEffect(() => {
    const checkIfSynced = async () => {
      try {
        const response = await fetch(`/api/playlists/check-if-synced/${playlistId}`);
        const data = await response.json();
        setIsSynced(data.isSynced);
      } catch (error) {
        console.error("Failed to check if playlist is synced:", error);
      }
    }
    checkIfSynced();
  }, [playlistId]);

  useEffect(() => {
    if (!isSynced) {
      
    }
  }, [isSynced]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRelativeTime = useMemo(() => {
    return (date: Date) => {
      const now = Date.now();
      const diff = now - date.getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "just now";
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
    };
  }, []);

  const handleAddNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        timestamp: currentTime,
        content: currentNote,
        createdAt: new Date()
      };
      setNotes([newNote, ...notes]);
      setCurrentNote("");
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <header className="relative z-20 flex h-16 w-full shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-b-border bg-background-dark px-4 shadow-md sm:px-6">
        <div className="flex items-center gap-4">
          <Link 
            className="flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-card-bg px-3 text-sm font-medium text-white transition-colors hover:bg-border" 
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white leading-tight">Al-Usool ath-Thalathah</h1>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="text-accent-gold">Foundations of Faith</span>
              <span>•</span>
              <span>Ep 4</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex h-10 items-center gap-2 rounded-lg bg-card-bg px-3 text-sm font-medium text-gray-300 shadow-sm transition-all hover:bg-border hover:text-white border border-border">
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="hidden lg:inline">Help</span>
          </button>
          <div className="relative">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-card-bg text-gray-300 transition-colors hover:bg-accent-gold hover:text-background-dark focus:bg-accent-gold focus:text-background-dark">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Video Section */}
        <div className="flex-1 flex flex-col relative bg-[#0c0e12] overflow-y-auto custom-scrollbar">
          <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none"></div>
          <div className="relative z-10 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
            {/* Video Player */}
            <div 
              className="w-full bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-border aspect-video relative group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <img 
                alt="Video content placeholder" 
                className="w-full h-full object-cover opacity-80" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDYS9YWACNyIwEvRxkZ-Eo-9Jx7s3QO1UVeXxosLZKc79sjLLLABmzxN1d2dn9czy9pSa1-T1vf1Zu-5g86onG5y-rqimOI_TwaTnV2dFU4RkIGYKM4eeO7-wUiTjRPyMSsEGv3lFLccxsiOFMXdy9dMaFCVRKXSxfFHUfZWVHZUecYSH8lpkdZxZfZ0Hpi2gBNxSfNVLNsbTbFhxz1blGFu7u2GY3DOQEYlP8nnizY8Mn-HevLOBkx4ukAkn4hufD33np02OF7Fk"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button 
                  className="h-20 w-20 rounded-full bg-accent-gold/90 flex items-center justify-center pl-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer pointer-events-auto"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <span className="material-symbols-outlined text-5xl text-background-dark">
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
              </div>

              {/* Top Controls */}
              <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-start transition-opacity duration-300 bg-linear-to-b from-black/80 to-transparent ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-white/90 text-shadow font-medium">Ep 4: Al-Usool ath-Thalathah</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 text-white backdrop-blur-sm">
                    <span className="material-symbols-outlined">cast</span>
                  </button>
                  <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 text-white backdrop-blur-sm">
                    <span className="material-symbols-outlined">closed_caption</span>
                  </button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 transition-opacity duration-300 bg-linear-to-t from-black via-black/80 to-transparent ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div className="relative w-full h-1 bg-white/20 rounded cursor-pointer group/progress">
                  <div 
                    className="absolute top-0 left-0 h-full bg-accent-gold rounded"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent-gold rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow"></div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white mt-1">
                  <div className="flex items-center gap-4">
                    <button 
                      className="hover:text-accent-gold"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {isPlaying ? "pause" : "play_arrow"}
                      </span>
                    </button>
                    <button className="hover:text-accent-gold">
                      <span className="material-symbols-outlined text-2xl">skip_next</span>
                    </button>
                    <div className="flex items-center gap-2 group/vol">
                      <button className="hover:text-accent-gold">
                        <span className="material-symbols-outlined text-2xl">volume_up</span>
                      </button>
                      <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                        <div className="h-1 bg-white/30 rounded w-16 my-auto ml-2">
                          <div className="h-full w-2/3 bg-white"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="hover:text-accent-gold">
                      <span className="material-symbols-outlined text-2xl">settings</span>
                    </button>
                    <button className="hover:text-accent-gold">
                      <span className="material-symbols-outlined text-2xl">fullscreen</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info & Actions */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-20">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">The Three Fundamental Principles</h2>
                  <span className="px-2 py-0.5 rounded bg-border text-accent-gold text-xs font-bold border border-accent-gold/20">
                    LESSON 4
                  </span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-2xl">
                  In this lesson, we cover the second fundamental principle regarding the knowledge of the religion of Islam with evidences. 
                  The Sheikh explains the levels of Islam: Islam, Iman, and Ihsan.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-accent-gold text-background-dark rounded-lg font-bold text-sm hover:bg-[#bfa030] transition-colors shadow-lg shadow-[#d4af37]/10 group">
                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                      menu_book
                    </span>
                    Open Companion Book
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-card-bg text-white rounded-lg font-medium text-sm border border-border hover:bg-border transition-colors">
                    <span className="material-symbols-outlined text-[20px]">file_download</span>
                    Resources
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-card-bg text-white rounded-lg font-medium text-sm border border-border hover:bg-border transition-colors">
                    <span className="material-symbols-outlined text-[20px]">share</span>
                    Share
                  </button>
                </div>
              </div>

              {/* Up Next */}
              <div className="w-full md:w-80 shrink-0 bg-card-bg/50 rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-card-bg border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Up Next</span>
                  <button className="text-xs text-accent-gold hover:underline">View Playlist</button>
                </div>
                <div className="p-2">
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-border cursor-pointer transition-colors group">
                    <div className="w-24 h-16 bg-black rounded-md overflow-hidden relative shrink-0 border border-border">
                      <img 
                        className="w-full h-full object-cover opacity-60" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDYS9YWACNyIwEvRxkZ-Eo-9Jx7s3QO1UVeXxosLZKc79sjLLLABmzxN1d2dn9czy9pSa1-T1vf1Zu-5g86onG5y-rqimOI_TwaTnV2dFU4RkIGYKM4eeO7-wUiTjRPyMSsEGv3lFLccxsiOFMXdy9dMaFCVRKXSxfFHUfZWVHZUecYSH8lpkdZxZfZ0Hpi2gBNxSfNVLNsbTbFhxz1blGFu7u2GY3DOQEYlP8nnizY8Mn-HevLOBkx4ukAkn4hufD33np02OF7Fk" 
                        alt="Next video"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-xl drop-shadow-md">play_circle</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-sm font-medium text-white truncate w-full group-hover:text-accent-gold transition-colors">
                        Ep 5: The Pillars of Islam
                      </span>
                      <span className="text-xs text-text-muted">42:15 • Sheikh Ibn Baz</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-[360px] lg:w-[420px] flex flex-col border-l border-border bg-[#13151a] shadow-xl z-20 shrink-0">
          {/* Tabs */}
          <div className="flex w-full border-b border-border bg-background-dark shrink-0">
            <button 
              className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === "notes" 
                  ? "border-accent-gold bg-card-bg/50 text-accent-gold" 
                  : "border-transparent text-text-muted hover:bg-card-bg hover:text-white"
              }`}
              onClick={() => setActiveTab("notes")}
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              Dars Notes
            </button>
            <button 
              className={`flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === "playlist" 
                  ? "border-accent-gold bg-card-bg/50 text-accent-gold" 
                  : "border-transparent text-text-muted hover:bg-card-bg hover:text-white"
              }`}
              onClick={() => setActiveTab("playlist")}
            >
              <span className="material-symbols-outlined text-lg">video_library</span>
              Playlist (12)
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#13151a] flex flex-col gap-6">
            {activeTab === "notes" && (
              <>
                {/* Add Note Section */}
                <div className="bg-[#1a1d24] rounded-xl border border-border p-3 shadow-lg ring-1 ring-white/5">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent-gold text-lg">timer</span>
                      <span className="text-sm font-mono text-accent-gold">{formatTime(currentTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Auto-Sync</span>
                    </div>
                  </div>
                  <textarea 
                    className="w-full resize-none rounded-lg bg-background-dark p-3 text-sm text-white placeholder-[#5f6368] outline-none focus:ring-1 focus:ring-accent-gold border border-border mb-3 transition-shadow custom-scrollbar" 
                    placeholder="Record your benefits here..." 
                    rows={4}
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 text-text-muted">
                      <button className="p-1 hover:text-white rounded hover:bg-border transition-colors" title="Bold">
                        <span className="material-symbols-outlined text-lg">format_bold</span>
                      </button>
                      <button className="p-1 hover:text-white rounded hover:bg-border transition-colors" title="List">
                        <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
                      </button>
                    </div>
                    <button 
                      className="flex items-center gap-1 rounded bg-accent-gold px-3 py-1.5 text-xs font-bold text-background-dark hover:bg-[#bfa030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddNote}
                      disabled={!currentNote.trim()}
                    >
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>

                {/* Notes List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Your Notes ({notes.length})
                    </h4>
                    <div className="flex gap-2">
                      <button className="text-text-muted hover:text-white">
                        <span className="material-symbols-outlined text-lg">sort</span>
                      </button>
                      <button className="text-text-muted hover:text-white">
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                    </div>
                  </div>

                  {notes.map((note) => (
                    <div key={note.id} className="relative pl-4 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-0.5 before:bg-border">
                      <div className="group relative rounded-lg bg-card-bg p-3 transition-all hover:bg-[#252a33] hover:shadow-md border border-transparent hover:border-border">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 rounded bg-border px-1.5 py-0.5 text-[11px] font-mono text-accent-gold hover:bg-background-dark border border-transparent hover:border-accent-gold transition-all">
                              <span className="material-symbols-outlined text-[12px]">play_arrow</span>
                              {formatTime(note.timestamp)}
                            </button>
                            <span className="text-[10px] text-text-muted">{getRelativeTime(note.createdAt)}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-text-muted hover:text-white">
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button 
                              className="p-1 text-text-muted hover:text-red-400"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-[#d1d5db] leading-relaxed">{note.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "playlist" && (
              <div className="text-center text-text-muted py-8">
                <span className="material-symbols-outlined text-5xl mb-2">video_library</span>
                <p>Playlist view coming soon</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-[#1a1d24]">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-[#5f6368] text-text-muted hover:border-accent-gold hover:text-accent-gold transition-all text-sm group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
              Create New Tag
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
