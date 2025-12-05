import Image from "next/image";

interface BookCardProps {
  title: string;
  coverUrl: string;
  notes?: number | undefined;
  progress?: number | undefined;
  progressColor?: string | undefined;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function BookCard({
  title,
  coverUrl,
  notes,
  progress,
  progressColor = "bg-blue-500",
  onClick,
  onDelete,
}: BookCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className="group relative flex flex-col items-center text-center cursor-pointer"
      onClick={onClick}
    >
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-all duration-300 hover:bg-red-600 group-hover:opacity-100 cursor-pointer"
          aria-label="Delete book"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      )}
      {coverUrl != "" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`Book cover of ${title}`}
          className="mb-3 h-56 w-40 rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:-translate-y-2"
          src={coverUrl}
          width={160}
          height={224}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="placeholder"
          className="mb-3 h-56 w-40 rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:-translate-y-2"
          src={
            "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
          }
          width={160}
          height={224}
        />
      )}
      <h4 className="font-semibold">{title}</h4>
      <p className="text-xs text-text-muted">{notes} Notes</p>
      <div className="mt-2 h-1 w-full max-w-40 rounded-full bg-border">
        <div
          className={`h-1 rounded-full ${progressColor}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
