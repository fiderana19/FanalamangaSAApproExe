import * as React from "react";
import { Check, ChevronDown, ExternalLink, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type SearchableSelectOption = string | { value: string; label: string };

interface SearchableSelectProps {
  value?: string | null;
  options: SearchableSelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
  customLabel?: string;
  customPlaceholder?: string;
  emptyMessage?: string;
  onCreate?: () => void;
  createLabel?: string;
  noCreateOptionsMessage?: string;
}

interface NormalizedOption {
  value: string;
  label: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  options,
  onValueChange,
  placeholder = "Sélectionner…",
  className,
  allowCustom,
  customLabel = "Nouveau lieu",
  customPlaceholder = "Saisir le nouveau lieu",
  emptyMessage = "Aucun résultat",
  onCreate,
  createLabel = "Créer un nouvel élément",
  noCreateOptionsMessage = "L'élément n'a pas encore été créé. Utilisez le lien ci-dessus pour le créer.",
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const normalized = React.useMemo<NormalizedOption[]>(
    () =>
      options.map((option) =>
        typeof option === "string"
          ? { value: option, label: option }
          : option,
      ),
    [options],
  );

  const allOptions = React.useMemo<NormalizedOption[]>(() => {
    if (value && !normalized.some((option) => option.value === value)) {
      const knownLabel = options.find(
        (option) => typeof option === "string" && option === value,
      );
      if (knownLabel !== undefined) {
        return [{ value, label: value }, ...normalized];
      }
    }
    return normalized;
  }, [normalized, options, value]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return allOptions;
    }
    return allOptions.filter((option) =>
      option.label.toLowerCase().includes(q),
    );
  }, [allOptions, query]);

  const selectedLabel = React.useMemo(
    () => normalized.find((option) => option.value === value)?.label,
    [normalized, value],
  );

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCreating(false);
      setQuery("");
    }
  };

  const pick = (option: NormalizedOption) => {
    onValueChange(option.value);
    setOpen(false);
    setCreating(false);
    setQuery("");
  };

  const commitCustom = () => {
    const customValue = query.trim();
    if (customValue) {
      onValueChange(customValue);
      setOpen(false);
      setCreating(false);
      setQuery("");
    }
  };

  const startCreate = () => {
    setQuery("");
    setCreating(true);
  };

  const handleCreate = () => {
    setOpen(false);
    onCreate?.();
  };

  const hasCreateAction = !!allowCustom || !!onCreate;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal min-w-0",
            value ? 'text-foreground' : 'text-muted-foreground',
            className,
          )}
        >
          <span className='flex-1 truncate text-left min-w-0'>
            {selectedLabel || value || placeholder}
          </span>
          <ChevronDown className='size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='p-1.5 space-y-1 min-w-0 overflow-hidden'
        style={{ width: 'min(var(--radix-popover-trigger-width), calc(100vw - 2rem))' }}
      >
        <div className='relative'>
          <Search className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400' />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && creating) {
                commitCustom();
              }
            }}
            placeholder={creating ? customPlaceholder : 'Rechercher…'}
            className='pl-8'
          />
        </div>

        {creating ? (
          <div className='space-y-1.5 px-1 pt-1 pb-0.5'>
            <div className='flex items-center gap-1.5 text-sm text-brand'>
              <Plus className='size-4 shrink-0' />
              <span>
                {customLabel} : « {query.trim() || '…'} »
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='brand'
                size='sm'
                className='flex-1'
                onClick={commitCustom}
                disabled={!query.trim()}
              >
                Ajouter
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setCreating(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <>
            {hasCreateAction && (
              <div className='border-b border-brand-border pb-1'>
                {allowCustom && (
                  <button
                    type='button'
                    onClick={startCreate}
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-left text-brand outline-none select-none hover:bg-accent hover:text-accent-foreground'
                  >
                    <Plus className='size-4 shrink-0' />
                    {customLabel}
                  </button>
                )}
                {onCreate && (
                  <button
                    type='button'
                    onClick={handleCreate}
                    className='flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-left text-brand outline-none select-none hover:bg-accent hover:text-accent-foreground'
                  >
                    <ExternalLink className='size-4 shrink-0' />
                    {createLabel}
                  </button>
                )}
              </div>
            )}
            <div className='max-h-48 overflow-y-auto'>
              {filtered.length > 0 ? (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => pick(option)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-left outline-none select-none hover:bg-accent hover:text-accent-foreground',
                      option.value === value &&
                        'bg-accent text-accent-foreground',
                    )}
                  >
                    <span className='flex-1 truncate'>{option.label}</span>
                    {option.value === value && (
                      <Check className='size-4 shrink-0' />
                    )}
                  </button>
                ))
              ) : (
                <div className='px-2 py-4 text-center text-sm text-muted-foreground space-y-1'>
                  <div>{emptyMessage}</div>
                  {hasCreateAction && (
                    <div className='text-xs'>{noCreateOptionsMessage}</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};