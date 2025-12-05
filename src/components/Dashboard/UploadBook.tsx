"use client";

import { useState, useRef } from "react";

type Category =
  | "Quran"
  | "Tafsir"
  | "Hadith"
  | "Aqeedah"
  | "Fiqh"
  | "UsulFiqh"
  | "Arabic"
  | "Seerah"
  | "History"
  | "Tazkiyah"
  | "Adab"
  | "Duas"
  | "Prophets"
  | "Biography"
  | "ComparativeReligion"
  | "Family"
  | "Youth"
  | "Ethics"
  | "Spirituality"
  | "Dawah"
  | "Misc";

export default function UploadBook() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setFileWrapper = (selectedFile: File) => {
    if (selectedFile.type === "application/pdf") {
      if (selectedFile.size > 30000000) {
        setError("File size must be less than 30MB");
        return;
      }
      setFile(selectedFile);
      setUploadProgress(100);
      setError("");
    } else {
      setError("Please select a PDF file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileWrapper(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFileWrapper(droppedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file || !title || !author || !language || !category) {
      setError("Please fill in all required fields");
      return;
    }

    if (title.length > 255) {
      setError("Title must be less than 255 characters");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("author", author.trim());
    formData.append("language", language.trim());
    formData.append("category", category);
    if (description) formData.append("description", description.trim());

    try {
      const uploadResponse = await fetch("/api/books/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setError(uploadData.error || "Failed to upload book");
        return;
      }

      const bookId = uploadData.bookId;

      const thumbnailFormData = new FormData();
      thumbnailFormData.append("file", file);

      const thumbnailResponse = await fetch("/api/books/generate-thumbnail", {
        method: "POST",
        body: thumbnailFormData,
      });

      if (!thumbnailResponse.ok) {
        setError("Book uploaded but failed to generate thumbnail");
        return;
      }
e
      const thumbnailBlob = await thumbnailResponse.blob();
      const thumbnailFile = new File([thumbnailBlob], "thumbnail.png", {
        type: "image/png",
      });

      const uploadThumbnailFormData = new FormData();
      uploadThumbnailFormData.append("file", thumbnailFile);

      const uploadThumbnailResponse = await fetch(
        `/api/books/upload-thumbnail/${bookId}`,
        {
          method: "POST",
          body: uploadThumbnailFormData,
        }
      );

      if (!uploadThumbnailResponse.ok) {
        setError("Book uploaded but failed to upload thumbnail");
        return;
      }

      alert("Book uploaded successfully with thumbnail!");
      setFile(null);
      setTitle("");
      setAuthor("");
      setLanguage("");
      setCategory("");
      setDescription("");
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading book:", error);
      setError("An error occurred while uploading. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <main className="flex-1 px-10 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Upload New Book</h2>
          <p className="mt-1 text-text-muted">
            Add a new book to your personal Islamic library.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background-light/50 p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">
                  error
                </span>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                isDragging
                  ? "border-accent bg-accent/10"
                  : "border-border bg-background/50"
              }`}
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-border">
                <span className="material-symbols-outlined text-4xl text-accent">
                  upload_file
                </span>
              </div>
              <p className="mt-4 font-semibold text-white">
                Drag &amp; drop your PDF here
              </p>
              <p className="mt-1 text-sm text-text-muted">or</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleBrowseClick}
                className="mt-2 flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-border px-4 text-sm font-medium text-white transition-colors hover:bg-border/80"
              >
                Browse Files
              </button>
              <p className="mt-4 text-xs text-text-muted">
                Supported file type: PDF
              </p>
            </div>

            {/* File Preview & Form */}
            {file && (
              <div className="mt-8">
                <div className="mb-6 flex items-center gap-4">
                  <span className="material-symbols-outlined text-lg text-green-400">
                    picture_as_pdf
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-text-muted">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-border">
                      <div
                        className="h-2 rounded-full bg-accent transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-lg text-green-400">
                    check_circle
                  </span>
                </div>

                <div className="space-y-4 border-t border-border pt-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        className="mb-1.5 block text-sm font-medium text-text-secondary"
                        htmlFor="bookTitle"
                      >
                        Book Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        className="form-input w-full resize-none overflow-hidden rounded-lg border border-border bg-background-light py-2 px-4 text-white placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                        id="bookTitle"
                        placeholder="e.g., The Sealed Nectar"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={255}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="mb-1.5 block text-sm font-medium text-text-secondary"
                        htmlFor="author"
                      >
                        Author <span className="text-red-400">*</span>
                      </label>
                      <input
                        className="form-input w-full resize-none overflow-hidden rounded-lg border border-border bg-background-light py-2 px-4 text-white placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                        id="author"
                        placeholder="e.g., Safiur Rahman Mubarakpuri"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        className="mb-1.5 block text-sm font-medium text-text-secondary"
                        htmlFor="language"
                      >
                        Language <span className="text-red-400">*</span>
                      </label>
                      <input
                        className="form-input w-full resize-none overflow-hidden rounded-lg border border-border bg-background-light py-2 px-4 text-white placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                        id="language"
                        placeholder="e.g., English, Arabic, Urdu"
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="mb-1.5 block text-sm font-medium text-text-secondary"
                        htmlFor="category"
                      >
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        className="form-select w-full rounded-lg border border-border bg-background-light py-2 px-4 text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                        id="category"
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value as Category)
                        }
                        required
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        <option value="Quran">Quran</option>
                        <option value="Tafsir">Tafsir</option>
                        <option value="Hadith">Hadith</option>
                        <option value="Aqeedah">Aqeedah</option>
                        <option value="Fiqh">Fiqh</option>
                        <option value="UsulFiqh">Usul al-Fiqh</option>
                        <option value="Arabic">Arabic Language</option>
                        <option value="Seerah">Seerah</option>
                        <option value="History">History</option>
                        <option value="Tazkiyah">Tazkiyah</option>
                        <option value="Adab">Adab</option>
                        <option value="Duas">Duas</option>
                        <option value="Prophets">Prophets</option>
                        <option value="Biography">Biography</option>
                        <option value="ComparativeReligion">Comparative Religion</option>
                        <option value="Family">Family</option>
                        <option value="Youth">Youth</option>
                        <option value="Ethics">Ethics</option>
                        <option value="Spirituality">Spirituality</option>
                        <option value="Dawah">Dawah</option>
                        <option value="Misc">Miscellaneous</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium text-text-secondary"
                      htmlFor="description"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      className="form-textarea w-full resize-none overflow-hidden rounded-lg border border-border bg-background-light py-2 px-4 text-white placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                      id="description"
                      placeholder="Brief description of the book..."
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-accent px-6 text-base font-bold text-background transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">
                            refresh
                          </span>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">
                            add_circle
                          </span>
                          <span>Add to Library</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
