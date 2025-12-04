import Image from 'next/image';

interface ContinueReadingProps {
  book: {
    title: string;
    author: string;
    coverUrl: string;
    progress: number;
    lastPage: number;
  };
  onResume: () => void;
}

export default function ContinueReading({ book, onResume }: ContinueReadingProps) {
  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold">Continue Reading</h3>
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card-bg/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <Image
            alt={`Book cover of ${book.title}`}
            className="h-40 w-28 shrink-0 rounded-lg object-cover shadow-lg"
            src={book.coverUrl}
            width={112}
            height={160}
          />
          <div className="flex-1">
            <h4 className="text-2xl font-bold">{book.title}</h4>
            <p className="text-sm text-text-muted">{book.author}</p>
            <div className="mt-4 space-y-3">
              <div className="w-full">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Progress</span>
                  <span>{book.progress}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-border">
                  <div 
                    className="h-2 rounded-full bg-accent-gold" 
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Last opened:</span> Page {book.lastPage}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={onResume}
          className="flex h-12 min-w-[84px] max-w-xs cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-accent-gold px-4 text-base font-bold text-background-dark transition-colors hover:bg-yellow-600"
        >
          <span className="material-symbols-outlined">play_arrow</span>
          <span className="truncate">Resume</span>
        </button>
      </div>
    </div>
  );
}
