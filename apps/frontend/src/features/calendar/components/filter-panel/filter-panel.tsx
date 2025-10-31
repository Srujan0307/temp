import { useNavigate, useSearch } from '@tanstack/react-router';
import { MultiSelect } from '../multi-select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function SlaLegend() {
  const slaColors = [
    { name: 'On Time', color: 'bg-green-500' },
    { name: 'At Risk', color: 'bg-yellow-500' },
    { name: 'Overdue', color: 'bg-red-500' },
  ];

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">SLA Legend</h3>
      <div className="flex flex-col space-y-2">
        {slaColors.map(sla => (
          <div key={sla.name} className="flex items-center">
            <span
              className={`h-4 w-4 rounded-full mr-2 ${sla.color}`}
            ></span>
            <span>{sla.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarFilterPanel() {
  const navigate = useNavigate({ from: '/calendar' });
  const {
    clients: selectedClients = [],
    vehicles: selectedVehicles = [],
    eventTypes: selectedEventTypes = [],
    slaStatuses: selectedSlaStatuses = [],
  } = useSearch({
    from: '/calendar',
  });

  function handleFilterChange(filterName: string, value: string[]) {
    navigate({
      search: prev => ({
        ...prev,
        [filterName]: value,
      }),
    });
  }

  // TODO: Replace with actual filter data
  const clients = ['Client A', 'Client B', 'Client C'];
  const vehicles = ['Vehicle 1', 'Vehicle 2', 'Vehicle 3'];
  const eventTypes = ['Type X', 'Type Y', 'Type Z'];
  const slaStatuses = ['On Time', 'At Risk', 'Overdue'];

  return (
    <div className="p-4 border-r w-72">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
      {/* Client Filter */}
      <div>
        <h3 className="font-semibold mb-2">Client</h3>
        <MultiSelect
          options={clients}
          selected={selectedClients}
          onChange={value => {
            handleFilterChange('clients', value);
          }}
          placeholder="Select clients"
        />
      </div>
      {/* Vehicle Filter */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Vehicle</h3>
        <MultiSelect
          options={vehicles}
          selected={selectedVehicles}
          onChange={value => {
            handleFilterChange('vehicles', value);
          }}
          placeholder="Select vehicles"
        />
      </div>
      {/* Event Type Filter */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Event Type</h3>
        <MultiSelect
          options={eventTypes}
          selected={selectedEventTypes}
          onChange={value => {
            handleFilterChange('eventTypes', value);
          }}
          placeholder="Select event types"
        />
      </div>
      {/* SLA Status Filter */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">SLA Status</h3>
        <div className="flex flex-wrap gap-2">
          {slaStatuses.map(status => (
            <Button
              key={status}
              variant={
                selectedSlaStatuses.includes(status) ? 'secondary' : 'outline'
              }
              size="sm"
              onClick={() => {
                const newStatuses = selectedSlaStatuses.includes(status)
                  ? selectedSlaStatuses.filter(s => s !== status)
                  : [...selectedSlaStatuses, status];
                handleFilterChange('slaStatuses', newStatuses);
              }}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>
      <SlaLegend />
    </div>
  );
}