'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import StatCard from './StatCard';
import BookCard from './BookCard';
import ContinueReading from './ContinueReading';

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

const allBooks = [
  {
    id: 1,
    title: 'Riyadh as-Salihin',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrIP8svMBTaeMSK8Nuuz6JAMaiU9sVtfCycXtqludq8I6pcZnkdwP16943tp2bb8GJikCSCz8MuDFjpIlYZHb59UfQrxbqGjGFn989ZM_Vsl_sNEdHZKmDlAxOFfIz21FGkN_LFqiSzq1YVokR374XOtFqg4ubyUxXoY4k92AYJ6SJyEaok0W6lsUXxy4Lvm6sQs22IHhVzf5w2Lp8PttNqxyR2zrkkbehyzOjZY6MmOdwtuHFMBj-oXd7z_ow4CRcZVRZ0XUwEcA',
    notes: 24,
    progress: 45,
    progressColor: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Al-Adab al-Mufrad',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGlsK8rvhf8cI_fGRDZT1DtDsjFx2hHH01YlN-L1bK_lcbyuKmTXsm_P7zWgT4dakzAq30UB4TE2VTjnAZijXz7QI9fRYoNxVyXZpGDHevcae_kE_bJynx11JdcW2CZiHseRXJNmLfHFlFhVLs7xFN1NTDcvuUMrsSxngv8hfdMiyGCtQAFryLZvdyZBuI1IaD-aPi6nUboV1NF0NGxezz3kxupV99NZdIoTsXTuciGzPDcYyIWkhWMkp4sQOuTXgN0eosW6OX7Lk',
    notes: 78,
    progress: 100,
    progressColor: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Tafsir Ibn Kathir',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHmg6RiLsfNP9oFrpougzFj_C07VKwOjAS66zedID1zwsN__L5u8cbkGRU7Yd1hPk5K9cVlw8ekgIkx4L9pfTmWwrdWvcERcUanqSQO1EiNBpRAvt55_FsG93DY2VcdS8BpQjlpqN15a8E-i9hmKoWEbsfWdEqkZBk_WlKzAg4W0lRXrEpCOgHp1B6XSrvXN_eh0uFPeNOmW7YIjCQGe8mYlsatG2qlyNNQCtqWEq2s-F3HmC07eIYddCiIUWFoJpVe4lULBmIGtk',
    notes: 52,
    progress: 20,
    progressColor: 'bg-yellow-500',
  },
  {
    id: 4,
    title: 'The Sealed Nectar',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOT6OoD9RPeX45ngD0EfBzFFhfwieHdE-HP1ouIyct63aGsMOmJrOWW92WTKoNIng9D1rzxDcjH5DNOFRVZGoLjGNKUD41qzHYxcQsjeVHxb_pIb4VxnnCFGsQwHyPwFlO6XFaFHpJY7pd3MBAt_F5VSFqMg_S8WIx_Uq9x0UtdQ4XS3GnXMfy3TS4E_X8cMRTh1yShHQHO_1ssIpeXYmv_F9ewNbaj9slPEQqTjR5aL5E-uuTnGjrlUJVBXCnQ9AxljowWCEiBvU',
    notes: 15,
    progress: 90,
    progressColor: 'bg-purple-500',
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleResume = () => {
    console.log('Resume reading');
    // Navigate to the book reader page
  };

  const handleBookClick = (bookId: number) => {
    console.log('Open book:', bookId);
    // Navigate to the book detail or reader page
  };

  const filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                title={book.title}
                coverUrl={book.coverUrl}
                notes={book.notes}
                progress={book.progress}
                progressColor={book.progressColor}
                onClick={() => handleBookClick(book.id)}
              />
            ))}
          </div>
          {filteredBooks.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-text-muted">No books found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
