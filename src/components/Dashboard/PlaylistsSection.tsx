"use client";

import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface Playlist {
  id: string;
  name: string;
  description: string;
  playlistUrl: string;
  thumbnailUrl: string;
  numberOfEpisodes: number;
  books: object[];
}

export default function PlaylistsSection() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserId(data.userId);
      })
      .catch((err) => console.error("Failed to fetch user ID:", err));
  }, []);

  const { data: playlists, mutate: mutatePlaylists } = useSWR(
    userId ? `/api/playlists/user/${userId}` : null,
    fetcher
  );

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Video Playlists & Dars
          </h2>
          <p className="text-lg text-text-muted max-w-3xl mx-auto mb-6">
            Access curated Islamic lectures and courses from renowned scholars.
            Take notes in real-time, track your progress, and deepen your
            knowledge.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-gold text-background-dark rounded-lg font-semibold hover:bg-[#bfa030] transition-colors"
            >
              <span className="material-symbols-outlined">video_library</span>
              Browse Playlists
            </Link>
            <Link
              href="/dashboard/upload-playlist"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-accent-gold text-accent-gold rounded-lg font-semibold hover:bg-accent-gold hover:text-background-dark transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              Add from YouTube
            </Link>
          </div>
        </div>

        {/* Featured Playlists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {playlists?.slice(0, 3)?.map((playlist: Playlist) => (
            <div
              key={playlist.id}
              className="bg-card-bg rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-accent-gold/10 transition-all duration-300 border border-border group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-background-dark overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={playlist.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                  alt={playlist.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-mono">
                  {playlist.numberOfEpisodes} episodes
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-16 w-16 rounded-full bg-accent-gold/90 flex items-center justify-center pl-1 shadow-lg">
                    <span className="material-symbols-outlined text-4xl text-background-dark">
                      play_arrow
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">
                  {playlist.name}
                </h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-2">
                  {playlist.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="material-symbols-outlined text-base">
                      menu_book
                    </span>
                    {playlist.books?.length || 0} {playlist.books?.length === 1 ? 'book' : 'books'}
                  </div>
                  <Link
                    href={`/dashboard/dars/${playlist.id}`}
                    className="text-sm font-semibold text-accent-gold hover:text-[#bfa030] flex items-center gap-1"
                  >
                    Start Learning
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Your Own Section */}
        <div className="bg-linear-to-r from-serene-teal to-serene-teal/80 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-3">
                Add Your Favorite Playlists
              </h3>
              <p className="text-white/90 mb-4">
                Import video playlists from YouTube, Vimeo, or other platforms.
                IlmSpace will help you organize your Islamic learning journey
                with synchronized note-taking and progress tracking.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-gold">
                    check_circle
                  </span>
                  Auto-sync with YouTube playlists
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-gold">
                    check_circle
                  </span>
                  Time-stamped note taking
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-gold">
                    check_circle
                  </span>
                  Progress tracking across devices
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-gold">
                    check_circle
                  </span>
                  Download notes and transcripts
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="font-semibold mb-3">Quick Add Playlist</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Paste YouTube playlist URL..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                />
                <Link
                  href={
                    youtubeUrl
                      ? `/dashboard/upload-playlist?url=${encodeURIComponent(
                          youtubeUrl
                        )}`
                      : "/dashboard/upload-playlist"
                  }
                  className="w-full px-4 py-2.5 bg-accent-gold text-background-dark rounded-lg font-bold hover:bg-[#bfa030] transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add Playlist
                </Link>
              </div>
              <p className="text-xs text-white/70 mt-3 text-center">
                Supported: YouTube, Vimeo, Direct Video Links
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
