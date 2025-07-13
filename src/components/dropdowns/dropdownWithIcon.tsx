import React, { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

interface Options {
  value: string;
  label: string;
  icon: string;
}

interface DropdownWithIconProps {
  options: Options[];
  placeholder?: string;
  className?: string;
  value?: string;
  setValue?: (value: string) => void;
}

export function DropdownWithIcon({
  options,
  placeholder = "Search",
  className = "",
  value,
  setValue,
}: DropdownWithIconProps) {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(defaultValue); // Set default value

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between border border-slate-900 ${className}`}
        >
          <div className="flex items-center">
            <img
              src={String(options.find((Basic) => Basic.value == value)?.icon)}
              className="w-3 mr-2 shrink-0"
              alt=""
            />
            <span>
              {value
                ? options.find((Basic) => Basic.value == value)?.label
                : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 border border-slate-900 ">
        <Command>
          <CommandInput
            placeholder={`${placeholder.toLowerCase()}...`}
            className="text-white border border-slate-900"
          />
          <CommandEmpty className="text-white border border-slate-900">
            No {placeholder.toLowerCase()} found.
          </CommandEmpty>
          <CommandGroup className="text-white border border-slate-900">
            {options.map((Basic) => (
              <CommandItem
                key={Basic.value}
                value={Basic.value}
                className="text-white py-2"
                onSelect={(currentValue) => {
                  setValue(currentValue);
                  setOpen(false);
                }}
              >
                <img src={Basic.icon} className="h-3 w-3 mr-3 shrink-0" />
                {Basic.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
