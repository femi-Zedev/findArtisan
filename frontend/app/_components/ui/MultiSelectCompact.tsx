"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Check } from "lucide-react";
import { Input } from "@mantine/core";
import { cn } from "@/app/lib/utils";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectCompactProps {
  label?: string;
  placeholder?: string;
  data: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  searchable?: boolean;
  required?: boolean;
  error?: string;
  classNames?: {
    label?: string;
    input?: string;
    dropdown?: string;
    option?: string;
  };
}

export function MultiSelectCompact({
  label,
  placeholder = "Choisir une ou plusieurs zones",
  data,
  value = [],
  onChange,
  searchable = false,
  required = false,
  error,
  classNames,
}: MultiSelectCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDisplayed, setMaxDisplayed] = useState(1);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const measurementContainerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const filteredData = searchable
    ? data.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : data;

  const selectedItems = data.filter((item) => value.includes(item.value));

  // Calculate how many tags can fit in the available width
  useLayoutEffect(() => {
    if (!tagsContainerRef.current || !measurementContainerRef.current || selectedItems.length === 0) {
      setMaxDisplayed(1);
      return;
    }

    // Wait for next frame to ensure all tags are rendered in measurement container
    requestAnimationFrame(() => {
      if (!tagsContainerRef.current || !measurementContainerRef.current) return;

      const container = tagsContainerRef.current;
      const containerWidth = container.offsetWidth;
      const clearButtonWidth = selectedItems.length > 0 ? 32 : 0; // Clear button width
      const chevronWidth = 24; // Chevron icon + gap
      const gap = 8; // Gap between tags
      const plusBadgeWidth = 50; // Approximate width of "+n" badge

      // Reserve space for clear button and chevron
      let availableWidth = containerWidth - clearButtonWidth - chevronWidth - gap;
      let count = 0;
      let totalWidth = 0;

      // Measure each tag from the measurement container
      for (let i = 0; i < selectedItems.length; i++) {
        const tagElement = tagRefs.current[i];
        if (tagElement) {
          const tagWidth = tagElement.offsetWidth;
          const isLastTag = i === selectedItems.length - 1;

          // If this is not the last tag, we need space for "+n" badge
          const needsPlusBadge = !isLastTag;
          const requiredWidth = totalWidth + tagWidth + gap + (needsPlusBadge ? plusBadgeWidth + gap : 0);

          if (requiredWidth <= availableWidth) {
            totalWidth += tagWidth + gap;
            count++;
          } else {
            break;
          }
        }
      }

      setMaxDisplayed(Math.max(1, count));
    });
  }, [selectedItems, isOpen]);

  const displayedItems = selectedItems.slice(0, maxDisplayed);
  const remainingCount = selectedItems.length - maxDisplayed;

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  // Calculate dropdown position using viewport coordinates (for portal)
  const updatePosition = useCallback(() => {
    if (!isOpen || !inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    
    setPosition({
      top: inputRect.bottom + 8, // 8px margin (mt-2 equivalent)
      left: inputRect.left,
      width: inputRect.width,
    });
  }, [isOpen]);

  // Update position when dropdown opens or window resizes/scrolls
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true); // Capture scroll events from all elements

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Input.Wrapper
      label={label}
      withAsterisk={required}
      error={error}
      classNames={{ label: classNames?.label, }}
    >
      <div className="relative">
        <div
          ref={inputRef}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "min-h-[50px] px-4 py-2 rounded-xl border cursor-pointer transition-all",
            "flex items-center gap-2 bg-white dark:bg-gray-800",
            "border-gray-300 dark:border-gray-600",
            "hover:border-teal-500 dark:hover:border-teal-500",
            "focus-within:border-teal-500 dark:focus-within:border-teal-500",
            error && "border-red-500 dark:border-red-500",
            classNames?.input
          )}
        >
          {/* Hidden measurement container */}
          <div
            ref={measurementContainerRef}
            className="absolute invisible flex items-center gap-2"
            aria-hidden="true"
          >
            {selectedItems.map((item, index) => (
              <span
                key={`measure-${item.value}`}
                ref={(el) => {
                  tagRefs.current[index] = el;
                }}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm shrink-0",
                  "bg-teal-100 dark:bg-teal-900/30",
                  "text-teal-700 dark:text-teal-300",
                  "border border-teal-300 dark:border-teal-700"
                )}
              >
                {item.label}
                <X size={12} />
              </span>
            ))}
          </div>

          <div
            ref={tagsContainerRef}
            className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden"
          >
            {selectedItems.length === 0 ? (
              <span className="text-gray-400 dark:text-gray-400 text-sm">
                {placeholder}
              </span>
            ) : (
              <>
                {/* Render only visible tags */}
                {displayedItems.map((item, index) => (
                  <span
                    key={item.value}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm shrink-0",
                      "bg-teal-100 dark:bg-teal-900/30",
                      "text-teal-700 dark:text-teal-300",
                      "border border-teal-300 dark:border-teal-700"
                    )}
                  >
                    {item.label}
                    <button
                      type="button"
                      onClick={(e) => removeOption(item.value, e)}
                      className="hover:bg-teal-200 dark:hover:bg-teal-900/50 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${item.label}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-md text-sm font-medium shrink-0",
                      "bg-teal-100 dark:bg-teal-900/30",
                      "text-teal-700 dark:text-teal-300",
                      "border border-teal-300 dark:border-teal-700"
                    )}
                  >
                    +{remainingCount}
                  </span>
                )}
              </>
            )}
          </div>
          {selectedItems.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className={cn(
                "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0",
                "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              )}
              aria-label="Clear all selections"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform shrink-0",
              isOpen && "transform rotate-180"
            )}
          />
        </div>

        {isOpen && position && typeof document !== 'undefined' && createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              zIndex: 500,
            }}
            className={cn(
              "rounded-lg border shadow-lg",
              "bg-white dark:bg-gray-900",
              "border-gray-300 dark:border-gray-800",
              "flex flex-col max-h-60",
              classNames?.dropdown
            )}
          >
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className={cn(
                    "w-full px-3 py-2 rounded-md border",
                    "bg-white dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-teal-500"
                  )}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="overflow-y-auto flex-1 min-h-0">
              <div className="p-1">
                {filteredData.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Aucun résultat
                  </div>
                ) : (
                  filteredData.map((item) => {
                    const isSelected = value.includes(item.value);
                    return (
                      <div
                        key={item.value}
                        onClick={() => toggleOption(item.value)}
                        className={cn(
                          "px-3 py-2 rounded-md cursor-pointer transition-colors",
                          "flex items-center gap-2",
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          isSelected && "bg-teal-50 dark:bg-teal-900/20",
                          classNames?.option
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                            isSelected
                              ? "bg-teal-500 border-teal-500 dark:bg-teal-400 dark:border-teal-400"
                              : "border-gray-300 dark:border-gray-600"
                          )}
                        >
                          {isSelected && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm",
                            isSelected
                              ? "text-teal-700 dark:text-teal-300 font-medium"
                              : "text-gray-900 dark:text-white"
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </Input.Wrapper>
  );
}

