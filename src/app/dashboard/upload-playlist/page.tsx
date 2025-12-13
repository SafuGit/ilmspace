/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { Command } from "cmdk";
import Fuse from "fuse.js";

interface UploadPlaylistFormData {
  name: string;
  description: string;
  playlistUrl: string;
  books: object[];
}

export default function UploadPlaylistPage() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
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

  const { data: userBooks, mutate: mutateUserBooks } = useSWR(
    userId ? `/api/books/user/${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  const [formData, setFormData] = useState<UploadPlaylistFormData>({
    name: "",
    description: "",
    playlistUrl: urlParam ? decodeURIComponent(urlParam) : "",
    books: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fuse.js setup for fuzzy search
  const fuse = useMemo(() => {
    if (!userBooks) return null;
    return new Fuse(userBooks, {
      keys: ["title", "author"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [userBooks]);

  // Search results with fuzzy matching
  const searchResults = useMemo(() => {
    if (!fuse || !searchQuery.trim()) return userBooks || [];
    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery, userBooks]);

  // Selected book IDs for duplicate check
  const selectedBookIds = useMemo(
    () => new Set(formData.books.map((b: any) => b.id)),
    [formData.books]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle playlist submission
    console.log(formData);
  };

  const updateFormData = (
    field: keyof UploadPlaylistFormData,
    value: string | object[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addBook = (book: any) => {
    if (selectedBookIds.has(book.id)) return;
    setFormData((prev) => ({
      ...prev,
      books: [...prev.books, book],
    }));
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const removeBook = (bookId: string) => {
    setFormData((prev) => ({
      ...prev,
      books: prev.books.filter((b: any) => b.id !== bookId),
    }));
  };

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <header className="relative z-20 flex h-16 w-full shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-b-border bg-background-dark px-4 shadow-md sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-card-bg px-3 text-sm font-medium text-white transition-colors hover:bg-border"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white leading-tight">
              Library Management
            </h1>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>Dars</span>
              <span>•</span>
              <span className="text-accent-gold">Upload Playlist</span>
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
        <div className="flex-1 flex flex-col relative bg-[#0c0e12] overflow-y-auto custom-scrollbar">
          <div className="fixed inset-0 islamic-pattern opacity-5 pointer-events-none"></div>
          <div className="relative z-10 w-full max-w-5xl mx-auto p-6 lg:p-10 flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 w-full">
              <div className="bg-card-bg border border-border rounded-xl shadow-2xl overflow-hidden relative">
                <div className="h-1 w-full bg-linear-to-r from-transparent via-accent-gold to-transparent opacity-50"></div>
                <div className="p-6 md:p-8">
                  <div className="mb-8 border-b border-border pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="p-2 bg-accent-gold/10 rounded-lg text-accent-gold">
                        <span className="material-symbols-outlined text-2xl">
                          playlist_add
                        </span>
                      </span>
                      Upload New Playlist
                    </h2>
                    <p className="text-text-muted mt-2 text-sm ml-12">
                      Add a YouTube playlist to your personal library for study
                      and annotation.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Playlist Name */}
                    <div className="group">
                      <label
                        className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-accent-gold transition-colors"
                        htmlFor="playlist-name"
                      >
                        Playlist Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative rounded-lg bg-background-dark border border-border transition-all focus-within:border-accent-gold focus-within:shadow-[0_0_0_1px] focus-within:shadow-accent-gold">
                        <input
                          className="w-full bg-transparent border-none rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-0 sm:text-sm"
                          id="playlist-name"
                          placeholder="e.g., Explanation of The Three Fundamental Principles"
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            updateFormData("name", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Playlist URL */}
                    <div className="group">
                      <label
                        className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-accent-gold transition-colors"
                        htmlFor="playlist-url"
                      >
                        Playlist URL <span className="text-red-400">*</span>
                      </label>
                      <div className="relative rounded-lg bg-background-dark border border-border transition-all flex items-center focus-within:border-accent-gold focus-within:shadow-[0_0_0_1px] focus-within:shadow-accent-gold">
                        <div className="pl-4 pr-2 text-gray-500">
                          <span className="material-symbols-outlined">
                            link
                          </span>
                        </div>
                        <input
                          className="w-full bg-transparent border-none rounded-r-lg py-3 pr-4 pl-2 text-white placeholder-gray-600 focus:ring-0 sm:text-sm font-mono"
                          id="playlist-url"
                          pattern="^https:\/\/(www\.)?youtube\.com\/(playlist\?list=|watch\?v=.+&list=).*$"
                          placeholder="https://www.youtube.com/playlist?list=... or watch?v=...&list=..."
                          required
                          type="url"
                          value={formData.playlistUrl}
                          onChange={(e) =>
                            updateFormData("playlistUrl", e.target.value)
                          }
                        />
                      </div>
                      <p className="mt-2 text-xs text-text-muted flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          info
                        </span>
                        Must be a valid YouTube playlist URL.
                      </p>
                    </div>

                    {/* Description */}
                    <div className="group">
                      <label
                        className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-accent-gold transition-colors"
                        htmlFor="description"
                      >
                        Description{" "}
                        <span className="text-xs text-gray-500 font-normal ml-1">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative rounded-lg bg-background-dark border border-border transition-all focus-within:border-accent-gold focus-within:shadow-[0_0_0_1px] focus-within:shadow-accent-gold">
                        <textarea
                          className="w-full bg-transparent border-none rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-0 sm:text-sm custom-scrollbar resize-none"
                          id="description"
                          placeholder="Enter a brief summary of the subjects covered in this dars..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) =>
                            updateFormData("description", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Associate Books */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Associate Books
                      </label>
                      <div className="bg-background-dark border border-border rounded-lg p-4 transition-all hover:border-gray-600">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {
                            formData.books.map((book: any) => (
                              <span
                                key={book.id}
                                className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded text-xs font-medium bg-card-bg text-accent-gold border border-accent-gold/30"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  menu_book
                                </span>
                                {book.title}
                                <button
                                  className="ml-1 text-accent-gold/60 hover:text-accent-gold focus:outline-none"
                                  type="button"
                                  onClick={() => removeBook(book.id)}
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    close
                                  </span>
                                </button>
                              </span>
                            ))
                          }
                        </div>
                        <Command
                          className="relative"
                          shouldFilter={false}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setIsSearchOpen(false);
                          }}
                        >
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none z-10">
                              <span className="material-symbols-outlined text-gray-500">
                                search
                              </span>
                            </span>
                            <Command.Input
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                              onFocus={() => setIsSearchOpen(true)}
                              placeholder="Search books in your library..."
                              className="w-full bg-transparent border-b border-border focus:border-accent-gold focus:ring-0 text-sm text-white pl-9 pb-2 placeholder-gray-600 transition-colors outline-none"
                            />
                          </div>

                          {isSearchOpen && searchResults.length > 0 && (
                            <Command.List className="absolute z-50 w-full mt-2 bg-card-bg border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                              {searchResults.map((book: any) => {
                                const isSelected = selectedBookIds.has(book.id);
                                return (
                                  <Command.Item
                                    key={book.id}
                                    value={book.id}
                                    onSelect={() => addBook(book)}
                                    disabled={isSelected}
                                    className={`px-4 py-3 cursor-pointer hover:bg-border transition-colors flex items-center gap-3 data-[selected=true]:bg-border ${
                                      isSelected ? "opacity-50" : ""
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-accent-gold text-base">
                                      {isSelected ? "check_circle" : "menu_book"}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">
                                        {book.title}
                                      </p>
                                      {book.author && (
                                        <p className="text-xs text-text-muted truncate">
                                          {book.author}
                                        </p>
                                      )}
                                    </div>
                                  </Command.Item>
                                );
                              })}
                            </Command.List>
                          )}

                          {isSearchOpen && searchQuery && searchResults.length === 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-card-bg border border-border rounded-lg shadow-xl p-4 text-center text-text-muted text-sm">
                              No books found
                            </div>
                          )}
                        </Command>
                        <p className="mt-2 text-xs text-[#5f6368]">
                          Linking a book allows you to open it side-by-side
                          while watching lectures.
                        </p>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 mt-2 border-t border-border">
                      <Link
                        href="/dashboard"
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-white hover:bg-border transition-colors"
                      >
                        Cancel
                      </Link>
                      <button
                        className="flex items-center gap-2 px-6 py-2.5 bg-accent-gold text-background-dark rounded-lg font-bold text-sm hover:bg-[#bfa030] transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                        type="submit"
                      >
                        <span className="material-symbols-outlined text-lg">
                          cloud_upload
                        </span>
                        Create Playlist
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Upload Tips */}
              <div className="bg-card-bg/80 backdrop-blur border border-border rounded-xl p-5 shadow-lg">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-gold">
                    lightbulb
                  </span>
                  Upload Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-text-muted">
                    <span className="material-symbols-outlined text-green-500 text-lg shrink-0">
                      check_circle
                    </span>
                    <span>
                      Ensure the playlist is set to Public or Unlisted on
                      YouTube.
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm text-text-muted">
                    <span className="material-symbols-outlined text-green-500 text-lg shrink-0">
                      check_circle
                    </span>
                    <span>
                      Accurate descriptions help you search your notes later.
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm text-text-muted">
                    <span className="material-symbols-outlined text-green-500 text-lg shrink-0">
                      check_circle
                    </span>
                    <span>
                      You can add more books to this playlist later from the
                      Settings menu.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Storage Quota */}
              <div className="bg-card-bg/80 backdrop-blur border border-border rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                    Storage Quota
                  </h3>
                  <span className="text-xs text-accent-gold cursor-pointer hover:underline">
                    Upgrade
                  </span>
                </div>
                <div className="w-full bg-background-dark rounded-full h-2 mb-2">
                  <div
                    className="bg-accent-gold h-2 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-text-muted">
                  <span>35% Used</span>
                  <span>12 / 30 Playlists</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111318;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #292e38;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a6c6f;
        }
        .islamic-pattern {
          background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuBDYS9YWACNyIwEvRxkZ-Eo-9Jx7s3QO1UVeXxosLZKc79sjLLLABmzxN1d2dn9czy9pSa1-T1vf1Zu-5g86onG5y-rqimOI_TwaTnV2dFU4RkIGYKM4eeO7-wUiTjRPyMSsEGv3lFLccxsiOFMXdy9dMaFCVRKXSxfFHUfZWVHZUecYSH8lpkdZxZfZ0Hpi2gBNxSfNVLNsbTbFhxz1blGFu7u2GY3DOQEYlP8nnizY8Mn-HevLOBkx4ukAkn4hufD33np02OF7Fk);
        }
        
        /* cmdk custom styles */
        [cmdk-root] {
          position: relative;
        }
        [cmdk-input] {
          outline: none;
        }
        [cmdk-list] {
          scrollbar-width: thin;
        }
        [cmdk-item] {
          cursor: pointer;
          outline: none;
        }
        [cmdk-item][aria-selected="true"] {
          background: #1a1d24;
        }
        [cmdk-item][aria-disabled="true"] {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
