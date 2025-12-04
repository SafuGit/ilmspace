import Image from 'next/image';

interface BookCardProps {
  title: string;
  coverUrl: string;
  notes?: number | undefined;
  progress?: number | undefined;
  progressColor?: string | undefined;
  onClick?: () => void;
}

export default function BookCard({ 
  title, 
  coverUrl, 
  notes, 
  progress, 
  progressColor = 'bg-blue-500',
  onClick 
}: BookCardProps) {
  return (
    <div 
      className="group flex flex-col items-center text-center cursor-pointer"
      onClick={onClick}
    >
      <Image
        alt={`Book cover of ${title}`}
        className="mb-3 h-56 w-40 rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:-translate-y-2"
        src={coverUrl}
        width={160}
        height={224}
      />
      <h4 className="font-semibold">{title}</h4>
      <p className="text-xs text-text-muted">{notes} Notes</p>
      <div className="mt-2 h-1 w-full max-w-[160px] rounded-full bg-border">
        <div className={`h-1 rounded-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
