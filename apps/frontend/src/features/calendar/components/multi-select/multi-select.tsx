import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selected.length > 0 ? selected.join(', ') : placeholder}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {options.map(option => (
          <DropdownMenuItem
            key={option}
            onSelect={e => {
              e.preventDefault();
              handleSelect(option);
            }}
          >
            <Checkbox
              className="mr-2"
              checked={selected.includes(option)}
              onCheckedChange={() => {
                handleSelect(option);
              }}
            />
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
