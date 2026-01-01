"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Badge, Menu } from "@mantine/core";

interface RatingOption {
  label: string;
  points: number;
}

interface RatingCriteriaRowProps {
  criterion: {
    id: string;
    label: string;
    options: RatingOption[];
  };
  selectedOption: RatingOption | null;
  onSelect: (option: RatingOption) => void;
  className?: string;
}

export function RatingCriteriaRow({
  criterion,
  selectedOption,
  onSelect,
  className,
}: RatingCriteriaRowProps) {
  const handleOptionSelect = (option: RatingOption) => {
    onSelect(option);
  };

  return (
    <Menu
      shadow="md"
      width={300}
      position="bottom-end"
      withArrow
      classNames={{
        dropdown: "max-h-[300px] overflow-y-auto",
      }}
    >
      <Menu.Target>
        <div
          className={cn(
            "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all",
            "bg-white hover:bg-teal-50",
            "dark:bg-gray-800 dark:border-gray-700 dark:hover:border-teal-500 dark:hover:bg-teal-900/10"
          , className)}
        >
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {criterion.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedOption ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedOption.label}
                </span>
                <Badge
                  size="sm"
                  className="bg-teal-500 text-white"
                >
                  {selectedOption.points}
                </Badge>
              </>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">
                Sélectionner
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </Menu.Target>

      <Menu.Dropdown>
       
        {criterion.options.map((option, index) => (
          <Menu.Item
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={cn(
              "flex items-center justify-between",
              selectedOption?.label === option.label &&
                "bg-teal-50 dark:bg-teal-900/20"
            )}
          >
            <div className="flex items-center gap-2">
            <span>{option.label}</span>
             <p className="text-sm text-gray-600 dark:text-gray-400">({option.points})</p> 
            </div>

          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
