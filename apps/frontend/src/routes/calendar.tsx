import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Calendar,
  CalendarFilterPanel,
  CreateEventModal,
  EventDetailDrawer,
  type CalendarEvent,
} from "@/features/calendar";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // Simulate loading events
    setTimeout(() => {
      setEvents([
        {
          id: "1",
          title: "Meeting with Client A",
          start: new Date(2024, 6, 10, 10, 0, 0),
          end: new Date(2024, 6, 10, 11, 0, 0),
        },
        {
          id: "2",
          title: "Vehicle 2 Maintenance",
          start: new Date(2024, 6, 12, 14, 0, 0),
          end: new Date(2024, 6, 12, 15, 0, 0),
        },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleEventSelect = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateEvent = (data: any) => {
    console.log("New event data:", data);
    const newEvent: CalendarEvent = {
      id: String(events.length + 1),
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
    };
    setEvents([...events, newEvent]);
    toast.success("Event created successfully");
    handleModalClose();
  };

  return (
    <div className="flex h-full">
      <CalendarFilterPanel />
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <button
            onClick={handleModalOpen}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create Event
          </button>
        </div>
        <Calendar
          events={events}
          isLoading={isLoading}
          onSelectEvent={handleEventSelect}
        />
      </div>
      <EventDetailDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
}