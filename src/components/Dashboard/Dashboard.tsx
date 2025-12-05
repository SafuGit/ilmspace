'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import StatCard from './StatCard';
import BookCard from './BookCard';
import ContinueReading from './ContinueReading';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Book } from '../../../prisma-generated';
import { alert } from '@/lib/alert';

// Sample data - replace with real data from your database
const continueReadingBook = {
  title: 'Sahih al-Bukhari',
  author: 'Imam al-Bukhari',
  coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjfb36eXIf2LDSh9F5-I52NEz53adDzlOwtZE1Ru4iCl6qj9gSZ8QsrUDLIrlvp5WfxCwnUxXIfvcAjRyBag3V97As3EAoemWsPga8fJNgEI8tl6MAn8FIhE5Bqzo8AkShs7uSSRcmKMbVTFF-PWv-AkhGAsMcEJdUIsO-5bqgkFiKUpeXZWW886sMJhbDt-AKIA9qT56RzvkovupDTRSQazbDQvElltjq5XMT-7sENNAEcfOZclZG7jaHG6owfTNGU-82eHyBdu8',
  progress: 75,
  lastPage: 452,
};

const libraryStats = [
  { icon: 'menu_book', value: 12, label: 'Total Books' },
  { icon: 'edit_note', value: 256, label: 'Total Notes' },
  { icon: 'bookmark', value: 5, label: 'Books Finished' },
  { icon: 'hourglass_top', value: '42h', label: 'Study Time' },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {console.log(data); setUserId(data.userId)})
      .catch(err => console.error('Failed to fetch user ID:', err));
  }, []);

  const {data: allBooks, error, isLoading, mutate: refreshBooks} = useSWR(
    userId ? `/api/books/user/${userId}` : null,
    fetcher
  )

  const handleResume = () => {
    console.log('Resume reading');
    // Navigate to the book reader page
  };

  const handleBookClick = (bookId: string) => {
    console.log('Open book:', bookId);
    // Navigate to the book detail or reader page
  };

  const deleteBook = async (bookId: string) => {
    const isConfirmed = await alert.confirm('Are you sure you want to delete this book?');
    if (!isConfirmed) return;
    try {
      const response = await fetch(`/api/books/delete/${bookId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      if (response.ok) {
        await refreshBooks();
        alert.success('Book deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  }

  const filteredBooks = allBooks?.filter((book: Book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    return (
      <main className="flex-1 px-10 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <p className="text-red-500">Failed to load books. Please try again.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-10 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Library</h2>
            <p className="mt-1 text-text-muted">An overview of your Islamic study collection.</p>
          </div>
          <div className="flex w-full items-center gap-4 md:w-auto">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Search books..."
            />
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-border px-4 text-sm font-medium text-white transition-colors hover:bg-border/80"
            >
              <span className="material-symbols-outlined text-lg">filter_list</span>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Continue Reading Section */}
          <div className="lg:col-span-2">
            <ContinueReading book={continueReadingBook} onResume={handleResume} />
          </div>

          {/* Library Stats Section */}
          <div className="lg:col-span-1">
            <h3 className="mb-4 text-xl font-semibold">Library Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {libraryStats.map((stat, index) => (
                <StatCard 
                  key={index}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Books Section */}
        <div className="mt-12">
          <h3 className="mb-4 text-xl font-semibold">All Books</h3>
          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-text-muted">Loading books...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredBooks.map((book: Book) => (
                  <BookCard
                    key={book.id}
                    title={book.title}
                    coverUrl={book.thumbnailUrl || ""}
                    // notes={book.notes}
                    // progress={book.progress}
                    // progressColor={book.progressColor}
                    onClick={() => handleBookClick(book.id)}
                    onDelete={() => deleteBook(book.id)}
                  />
                ))}
              </div>
              {filteredBooks.length === 0 && !isLoading && (
                <div className="py-12 text-center">
                  <p className="text-text-muted">
                    {searchQuery 
                      ? `No books found matching "${searchQuery}"` 
                      : 'No books in your library yet.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
