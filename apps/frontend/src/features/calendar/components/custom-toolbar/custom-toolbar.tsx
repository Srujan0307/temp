import {
  Navigate,
  type ToolbarProps,
  type View,
} from 'react-big-calendar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type CustomToolbarView = 'month' | 'week';

const viewOptions: { value: CustomToolbarView; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
];

export function CalendarToolbar(props: ToolbarProps) {
  const { onNavigate, onView, date, view } = props;
  const currentViewOption =
    viewOptions.find(option => option.value === view) ?? viewOptions[0];

  function handleNavigate(action: 'PREV' | 'NEXT' | 'TODAY') {
    onNavigate(action);
  }

  function handleViewChange(newView: View) {
    onView(newView);
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            handleNavigate(Navigate.TODAY);
          }}
        >
          Today
        </Button>
        <div className="flex items-center">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => {
              handleNavigate(Navigate.PREVIOUS);
            }}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(date, 'MMMM yyyy')}
          </h2>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => {
              handleNavigate(Navigate.NEXT);
            }}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Select
          value={currentViewOption.value}
          onValueChange={value => {
            handleViewChange(value as CustomToolbarView);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue>{currentViewOption.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {viewOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
