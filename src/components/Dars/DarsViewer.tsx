"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Loading from "../shared/Loading";
import { useRouter } from "next/navigation";
import { Playlist } from "../Dashboard/PlaylistsSection";
import ReactPlayer from "react-player";

interface DarsViewerProps {
  playlistId: string;
}

interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

interface Video {
  playlistId: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: number;
}

export interface Notebook {
  id: string;
  userId: string;
  playlistId: string;
  name: string;
  description: string;
}

const getInitialNotes = (): Note[] => {
  const now = Date.now();
  return [
    {
      id: "1",
      timestamp: 260,
      content:
        "Key point regarding the first principle: Knowledge is knowing Allah, His Prophet, and the religion of Islam with evidence.",
      createdAt: new Date(now - 120000),
    },
    {
      id: "2",
      timestamp: 495,
      content:
        "Evidence from the Quran regarding the four matters mentioned in Surah Al-Asr.",
      createdAt: new Date(now - 600000),
    },
    {
      id: "3",
      timestamp: 690,
      content:
        "Remember to cross-reference this with the explanation of Sheikh Ibn Baz.",
      createdAt: new Date(now - 900000),
    },
  ];
};

export default function DarsViewer({ playlistId }: DarsViewerProps) {
  // TODO: Use playlistId to fetch playlist data from API
  const [activeTab, setActiveTab] = useState<"notes" | "playlist">("notes");
  const [notes, setNotes] = useState<Note[]>(() => getInitialNotes());
  const [currentNote, setCurrentNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // 12:45
  const [duration, setDuration] = useState(0); // 45:00
  const [showControls, setShowControls] = useState(false);
  const [isSynced, setIsSynced] = useState<boolean | null>(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const pollRef = useRef<number | null>(null);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoQueue, setVideoQueue] = useState<Video[]>([]);
  const router = useRouter();
  const currentVideo = videoQueue[currentIndex];
  const nextVideo = videoQueue[currentIndex + 1];
  const [showFullDesc, setShowFullDesc] = useState(false);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimeoutRef = useRef<number | null>(null);

  const handleNext = () => {
    if (currentIndex < videoQueue.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    hideControlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2500); // 👈 2.5s like YouTube
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      const timeout = setTimeout(() => setShowControls(false), 0);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
      }
    };
  }, [isFullscreen]);

  useEffect(() => {
    try {
      fetch(`/api/playlists/${playlistId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched user playlists:", data);
          setPlaylist(data);
          try {
            const sortedVideos = data.videos.reverse();
            setVideoQueue(sortedVideos);
          } catch (error) {
            console.error("Error setting videos:", error);
          }
        })
        .catch((err) => console.error("Failed to fetch user playlists:", err));
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  }, [playlistId]);

  useEffect(() => {
    if (videoQueue.length > 0) {
      const timer = setTimeout(() => setCurrentIndex(0), 0);
      return () => clearTimeout(timer);
    }
  }, [videoQueue]);

  useEffect(() => {
    const checkIfSynced = async () => {
      try {
        const response = await fetch(
          `/api/playlists/check-if-synced/${playlistId}`
        );
        const data = await response.json();
        setIsSynced(data.isSynced);
      } catch (error) {
        console.error("Failed to check if playlist is synced:", error);
      }
    };
    checkIfSynced();
  }, [playlistId]);

  useEffect(() => {
    // If the playlist is not synced and we are not already syncing, start the sync
    if (!isSynced && !isSyncing) {
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts * interval(2000ms) = 60s
      const startSync = async () => {
        setIsSyncing(true);
        try {
          const response = await fetch(
            `/api/playlists/sync-videos/${playlistId}`,
            { method: "POST" }
          );
          const data = await response.json();
          console.log("Sync started:", data);

          // Poll for sync status until it becomes true or we reach maxAttempts
          pollRef.current = window.setInterval(async () => {
            attempts += 1;
            try {
              const res = await fetch(
                `/api/playlists/check-if-synced/${playlistId}`
              );
              const json = await res.json();
              if (json?.isSynced) {
                setIsSynced(true);
                setIsSyncing(false);
                if (pollRef.current) {
                  clearInterval(pollRef.current);
                  pollRef.current = null;
                }
                // Refresh the app router data to reflect synced videos
                router.refresh();
              } else if (attempts >= maxAttempts) {
                // Stop polling after a timeout period
                setIsSyncing(false);
                if (pollRef.current) {
                  clearInterval(pollRef.current);
                  pollRef.current = null;
                }
                console.warn("Sync polling timed out");
              }
            } catch (error) {
              console.error("Error polling sync status:", error);
            }
          }, 2000);
        } catch (error) {
          console.error("Failed to start sync:", error);
          setIsSyncing(false);
        }
      };

      startSync();
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isSynced, playlistId, isSyncing, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
        createdAt: new Date(),
      };
      setNotes([newNote, ...notes]);
      setCurrentNote("");
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const progress = (currentTime / duration) * 100;

  if (!isSynced) return <Loading />;
  if (!playlist) return <Loading />;

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <header className="relative z-20 flex h-16 w-full shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-b-border bg-background-dark px-4 shadow-md sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            className="flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-card-bg px-3 text-sm font-medium text-white transition-colors hover:bg-border"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white leading-tight">
              {playlist!.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="text-accent-gold">
                Total Eps {playlist.numberOfEpisodes}
              </span>
              <span>•</span>
              <span>On Ep {currentIndex + 1}</span>
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
              <span className="material-symbols-outlined text-xl">
                account_circle
              </span>
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
              onMouseEnter={() => !isFullscreen && setShowControls(true)}
              onMouseLeave={() => !isFullscreen && setShowControls(false)}
              onMouseMove={() => {
                if (isFullscreen) showControlsTemporarily();
              }}
              ref={containerRef}
            >
              {currentVideo && (
                <ReactPlayer
                  ref={playerRef}
                  src={currentVideo.videoUrl}
                  playing={isPlaying}
                  controls={false}
                  width="100%"
                  height="100%"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    if (currentIndex < videoQueue.length - 1) {
                      setCurrentIndex((i) => i + 1);
                      setIsPlaying(true);
                    }
                  }}
                  onTimeUpdate={(e) => {
                    setCurrentTime(e.currentTarget.currentTime);
                  }}
                  volume={volume}
                  onDurationChange={(e) => {
                    setDuration(e.currentTarget.duration);
                  }}
                />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30"></div>

              {/* Play/Pause Button */}
              {showControls && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    className="h-20 w-20 rounded-full bg-accent-gold/90 flex items-center justify-center pl-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-sm transition-transform hover:scale-110"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <span className="material-symbols-outlined text-5xl text-background-dark">
                      {isPlaying ? "pause" : "play_arrow"}
                    </span>
                  </button>
                </div>
              )}

              {/* Top Controls */}
              <div
                className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-start transition-opacity duration-300 bg-linear-to-b from-black/80 to-transparent ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-white/90 text-shadow font-medium">
                  {currentVideo?.title || "Loading..."}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 text-white backdrop-blur-sm">
                    <span className="material-symbols-outlined">cast</span>
                  </button>
                  <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 text-white backdrop-blur-sm">
                    <span className="material-symbols-outlined">
                      closed_caption
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 transition-opacity duration-300 bg-linear-to-t from-black via-black/80 to-transparent ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Progress Bar */}
                <div
                  className="relative w-full h-1 bg-white/20 rounded cursor-pointer"
                  onClick={(e) => {
                    if (!playerRef.current || !duration) return;

                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = clickX / rect.width;
                    const seekTime = percent * duration;

                    playerRef.current.currentTime = seekTime;
                  }}
                >
                  {/* Filled (yellow) progress */}
                  <div
                    className="absolute top-0 left-0 h-full bg-accent-gold rounded"
                    style={{ width: `${progress}%` }}
                  />

                  {/* Scrubber */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-accent-gold rounded-full shadow"
                    style={{ left: `calc(${progress}% - 6px)` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white mt-1">
                  <div className="flex items-center gap-4">
                    <button
                      className="hover:text-accent-gold"
                      onClick={handlePrev}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        skip_previous
                      </span>
                    </button>
                    <button
                      className="hover:text-accent-gold"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {isPlaying ? "pause" : "play_arrow"}
                      </span>
                    </button>
                    <button
                      className="hover:text-accent-gold"
                      onClick={handleNext}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        skip_next
                      </span>
                    </button>
                    <div className="flex items-center gap-2 group/vol">
                      <button className="hover:text-accent-gold">
                        <span className="material-symbols-outlined text-2xl">
                          volume_up
                        </span>
                      </button>
                      <div className="w-0 overflow-hidden group-hover/vol:w-full transition-all duration-300">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={volume}
                          onChange={(e) =>
                            setVolume(parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <span className="text-sm font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="hover:text-accent-gold">
                      <span className="material-symbols-outlined text-2xl">
                        settings
                      </span>
                    </button>
                    <button
                      className="hover:text-accent-gold"
                      onClick={toggleFullscreen}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        fullscreen
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info & Actions */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-20">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col items-start gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {currentVideo?.title || "Loading..."}
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-border text-accent-gold text-xs font-bold border border-accent-gold/20">
                    Episode {currentIndex + 1}
                  </span>
                </div>
                {(() => {
                  const MAX_LENGTH = 180;
                  const desc =
                    currentVideo?.description ||
                    "No description available for this video.";
                  const isLong = desc.length > MAX_LENGTH;
                  const displayText =
                    showFullDesc || !isLong
                      ? desc
                      : desc.slice(0, MAX_LENGTH) + "...";
                  return (
                    <>
                      <p className="text-text-muted text-concat text-sm leading-relaxed mb-6 max-w-2xl">
                        {displayText}
                        {isLong && (
                          <button
                            className="ml-2 text-accent-gold underline text-xs font-bold focus:outline-none cursor-pointer"
                            onClick={() => setShowFullDesc((v) => !v)}
                          >
                            {showFullDesc ? "See less" : "See more..."}
                          </button>
                        )}
                      </p>
                    </>
                  );
                })()}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/dashboard/personal-notebook/${playlist.notebook.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-accent-gold text-background-dark rounded-lg font-bold text-sm hover:bg-[#bfa030] transition-colors shadow-lg shadow-[#d4af37]/10 group"
                  >
                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                      menu_book
                    </span>
                    Open Notebook
                  </Link>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-card-bg text-white rounded-lg font-medium text-sm border border-border hover:bg-border transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      file_download
                    </span>
                    Resources
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-card-bg text-white rounded-lg font-medium text-sm border border-border hover:bg-border transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      share
                    </span>
                    Share
                  </button>
                </div>
              </div>

              {/* Up Next */}
              <div className="w-full md:w-80 shrink-0 bg-card-bg/50 rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-card-bg border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Up Next
                  </span>
                  <button className="text-xs text-accent-gold hover:underline">
                    View Playlist
                  </button>
                </div>
                <div className="p-2">
                  {nextVideo && (
                    <div
                      className="flex gap-3 p-2 rounded-lg hover:bg-border cursor-pointer transition-colors group"
                      onClick={() => {
                        setCurrentIndex(currentIndex + 1);
                        setIsPlaying(true);
                      }}
                    >
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-sm font-medium text-white truncate group-hover:text-accent-gold">
                          {nextVideo.title}
                        </span>
                      </div>
                    </div>
                  )}
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
              <span className="material-symbols-outlined text-lg">
                edit_note
              </span>
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
              <span className="material-symbols-outlined text-lg">
                video_library
              </span>
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
                      <span className="material-symbols-outlined text-accent-gold text-lg">
                        timer
                      </span>
                      <span className="text-sm font-mono text-accent-gold">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                        Auto-Sync
                      </span>
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
                      <button
                        className="p-1 hover:text-white rounded hover:bg-border transition-colors"
                        title="Bold"
                      >
                        <span className="material-symbols-outlined text-lg">
                          format_bold
                        </span>
                      </button>
                      <button
                        className="p-1 hover:text-white rounded hover:bg-border transition-colors"
                        title="List"
                      >
                        <span className="material-symbols-outlined text-lg">
                          format_list_bulleted
                        </span>
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
                        <span className="material-symbols-outlined text-lg">
                          sort
                        </span>
                      </button>
                      <button className="text-text-muted hover:text-white">
                        <span className="material-symbols-outlined text-lg">
                          download
                        </span>
                      </button>
                    </div>
                  </div>

                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="relative pl-4 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-0.5 before:bg-border"
                    >
                      <div className="group relative rounded-lg bg-card-bg p-3 transition-all hover:bg-[#252a33] hover:shadow-md border border-transparent hover:border-border">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 rounded bg-border px-1.5 py-0.5 text-[11px] font-mono text-accent-gold hover:bg-background-dark border border-transparent hover:border-accent-gold transition-all">
                              <span className="material-symbols-outlined text-[12px]">
                                play_arrow
                              </span>
                              {formatTime(note.timestamp)}
                            </button>
                            <span className="text-[10px] text-text-muted">
                              {getRelativeTime(note.createdAt)}
                            </span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-text-muted hover:text-white">
                              <span className="material-symbols-outlined text-[16px]">
                                edit
                              </span>
                            </button>
                            <button
                              className="p-1 text-text-muted hover:text-red-400"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-[#d1d5db] leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "playlist" && (
              <div className="text-center text-text-muted py-8">
                <span className="material-symbols-outlined text-5xl mb-2">
                  video_library
                </span>
                <p>Playlist view coming soon</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-[#1a1d24]">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-[#5f6368] text-text-muted hover:border-accent-gold hover:text-accent-gold transition-all text-sm group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                add_circle
              </span>
              Create New Tag
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
