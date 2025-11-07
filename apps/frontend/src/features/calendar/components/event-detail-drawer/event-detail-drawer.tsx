import { useState } from "react";

export function EventDetailDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Event Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          Close
        </button>
      </div>
      <div>
        {/* Placeholder for event details */}
        <p>Event details will be displayed here.</p>
        {/* Placeholder for related filings and documents */}
        <div className="mt-4">
          <h3 className="font-semibold">Related Filings</h3>
          <ul>
            <li>Filing 123</li>
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Documents</h3>
          <ul>
            <li>Document.pdf</li>
          </ul>
        </div>
        {/* Placeholder for quick actions */}
        <div className="mt-4 space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Open Filing
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded">
            Add Note
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}