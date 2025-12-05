import React, { useState } from 'react';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  onZoomChange?: (scale: number) => void;
}

const ZoomControls = ({
  scale,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onZoomChange,
}: ZoomControlsProps) => {
  const zoomPercentage = Math.round(scale * 100);
  const [inputValue, setInputValue] = useState(zoomPercentage.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const percentage = parseInt(inputValue);
    if (!isNaN(percentage) && percentage >= 50 && percentage <= 300) {
      onZoomChange?.(percentage / 100);
    }
    setInputValue(zoomPercentage.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      e.currentTarget.blur();
    }
  };

  // Update input value when scale changes externally
  React.useEffect(() => {
    setInputValue(zoomPercentage.toString());
  }, [zoomPercentage]);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Zoom Controls */}
      <div className="hidden items-center rounded-lg bg-card-bg md:flex">
        <button 
          onClick={onZoomOut}
          className="flex size-10 items-center justify-center text-[#d1d5db] transition-colors hover:bg-border hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          disabled={scale <= 0.5}
          aria-label="Zoom out"
        >
          <span className="material-symbols-outlined text-xl">zoom_out</span>
        </button>
        <div className="flex w-20 items-center justify-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-10 bg-transparent text-center text-sm font-medium outline-none"
            aria-label="Zoom percentage"
          />
          <span className="text-sm font-medium">%</span>
        </div>
        <button 
          onClick={onZoomIn}
          className="flex size-10 items-center justify-center text-[#d1d5db] transition-colors hover:bg-border hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          disabled={scale >= 3}
          aria-label="Zoom in"
        >
          <span className="material-symbols-outlined text-xl">zoom_in</span>
        </button>
      </div>
      
      {/* Fit Screen Button */}
      <button 
        onClick={onFitScreen}
        className="hidden h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-card-bg px-3 text-sm font-medium text-white transition-colors hover:bg-border lg:flex"
        aria-label="Fit to screen"
      >
        <span className="material-symbols-outlined text-xl">fit_screen</span>
      </button>
      
      {/* More Actions Menu */}
      <div className="relative">
        <button 
          className="flex size-10 items-center justify-center rounded-lg bg-card-bg text-[#d1d5db] transition-colors hover:bg-[#D4AF37] hover:text-background-dark cursor-pointer"
          aria-label="More actions"
        >
          <span className="material-symbols-outlined text-xl">more_vert</span>
        </button>
      </div>
    </div>
  );
};

export default ZoomControls;
