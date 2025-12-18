import * as React from "react";
import { createPortal } from "react-dom";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { cn } from "@/app/lib/utils";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    label?: string;
    error?: string;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, label, error, required, value, ...props }, ref) => {
      return (
        <div className={cn("flex flex-col", className)}>
          {label && (
            <label className="w-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          <RPNInput.default
            ref={ref}
            className={cn(
              "flex rounded-xl border border-gray-300 dark:border-gray-700",
              "bg-white dark:bg-gray-800",
              "focus-within:border-teal-500 dark:focus-within:border-teal-500",
              "min-h-[50px]",
              "transition-colors",
              error && "border-red-500 dark:border-red-500"
            )}
            flagComponent={FlagComponent}
            countrySelectComponent={CountrySelect}
            inputComponent={InputComponent}
            defaultCountry="BJ"
            international={false}
            value={value}
            onChange={(newValue) => onChange?.(newValue || "" as RPNInput.Value)}
            {...props}
          />
          
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
          )}
        </div>
      );
    }
  );

PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex-1 px-4 py-3 text-sm",
      "bg-transparent",
      "text-gray-900 dark:text-white",
      "placeholder:text-gray-400 dark:placeholder:text-gray-500",
      "border-none outline-none focus:outline-none focus:ring-0",
      className
    )}
    {...props}
    ref={ref}
  />
));

InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [position, setPosition] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const [openUpward, setOpenUpward] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownContentRef = React.useRef<HTMLDivElement>(null);

  // Calculate dropdown position using viewport coordinates (for portal)
  const updatePosition = React.useCallback(() => {
    if (!isOpen || !buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const dropdownHeight = 400; // max-h-[400px]

    // Open upward if there's not enough space below but enough space above
    const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    setOpenUpward(shouldOpenUpward);

    // Find the parent PhoneInput container to get its width
    let parentElement = buttonRef.current.parentElement;
    let parentWidth = buttonRect.width;
    while (parentElement) {
      // Look for the RPNInput container (usually has specific classes or structure)
      if (parentElement.classList.contains('PhoneInput') || 
          parentElement.querySelector('input[type="tel"]')) {
        const parentRect = parentElement.getBoundingClientRect();
        parentWidth = parentRect.width;
        break;
      }
      parentElement = parentElement.parentElement;
    }

    // Calculate position using viewport coordinates (for fixed positioning in portal)
    const top = shouldOpenUpward 
      ? buttonRect.top - dropdownHeight - 8 // 8px margin
      : buttonRect.bottom + 8; // 8px margin

    setPosition({
      top,
      left: buttonRect.left,
      width: parentWidth,
    });
  }, [isOpen]);

  // Update position when dropdown opens or window resizes/scrolls
  React.useEffect(() => {
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

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(target)
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

  const filteredOptions = React.useMemo(() => {
    return options
      .filter((x) => x.value)
      .filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [options, searchQuery]);

  const handleSelect = (country: RPNInput.Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchQuery("");
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 pl-3 pr-2 h-full py-3",
          "border-r border-gray-300 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-l-xl",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
        aria-label="Select country"
        aria-expanded={isOpen}
      >
        <FlagComponent country={value} countryName={value} />
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={cn(
            "text-gray-500 dark:text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        >
          <path d="M6 9L1 4h10z" fill="currentColor" />
        </svg>
      </button>

      {isOpen && position && typeof document !== 'undefined' && createPortal(
        <div
          ref={dropdownContentRef}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            zIndex: 500,
          }}
          className={cn(
            "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-[400px] overflow-hidden flex flex-col"
          )}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-gray-400"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un pays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Country List */}
          <div className="overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer",
                    value === option.value && "bg-teal-50 dark:bg-teal-900/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <FlagComponent country={option.value} countryName={option.label} />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    +{RPNInput.getCountryCallingCode(option.value)}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No countries found
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={''} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
