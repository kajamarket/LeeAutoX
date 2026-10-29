import React from 'react';
import { Check, X } from 'lucide-react';
import { appearanceOptions, type AppearanceMode } from './appearance';

interface AppearanceMenuProps {
  mode: AppearanceMode;
  selected: string;
  loaded: Set<string>;
  unavailable: Set<string>;
  waiting: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function AppearanceMenu({
  mode,
  selected,
  loaded,
  unavailable,
  waiting,
  onSelect,
  onClose,
}: AppearanceMenuProps) {
  const options = appearanceOptions[mode];
  const current = options.find((option) => option.id === selected) || options[0];

  return (
    <div
      className={`appearance-menu ${mode}`}
      id={`appearance-${mode}`}
      role="group"
      aria-label={mode === 'paint' ? 'Body colour' : 'Wheel design'}
    >
      <div className="appearance-heading">
        <span>{mode === 'paint' ? 'Paint' : 'Wheels'}</span>
        <button
          type="button"
          className="appearance-close"
          onClick={onClose}
          aria-label="Close and restore original vehicle"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>

      <div className="appearance-options">
        {options.map((option) => {
          const isSelected = option.id === selected;
          const isLoaded = loaded.has(option.image);
          const isFailed = unavailable.has(option.image);

          return (
            <button
              type="button"
              key={option.id}
              className={`appearance-option ${isSelected ? 'selected' : ''}`}
              disabled={waiting || !isLoaded}
              aria-label={`${option.label}${isFailed ? ' — unavailable' : ''}`}
              aria-pressed={isSelected}
              title={option.label}
              onClick={() => onSelect(option.id)}
            >
              {mode === 'paint' ? (
                <span
                  className="paint-chip"
                  style={{
                    backgroundColor: option.color,
                    color: option.id === 'graphite' ? '#fff' : '#111',
                  }}
                >
                  {isSelected && <Check size={14} />}
                </span>
              ) : (
                <span
                  className="wheel-chip"
                  style={{ backgroundImage: `url("${option.image}")` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="appearance-caption" aria-live="polite">
        {waiting ? 'Returning to exterior…' : current.label}
        <small>
          {unavailable.size ? 'Some options could not load' : 'Close to explore other options'}
        </small>
      </div>
    </div>
  );
}
