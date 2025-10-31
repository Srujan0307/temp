import { timeline } from './filing-timeline.data';

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day(s) ago`;
  }
  if (hours > 0) {
    return `${hours} hour(s) ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute(s) ago`;
  }
  return `${seconds} second(s) ago`;
};

export const FilingTimeline = () => {
  return (
    <div>
      <h2 className="text-lg font-bold">Timeline</h2>
      <ul>
        {timeline.map((event) => (
          <li key={event.id}>
            <strong>{event.actor}</strong> {event.action} -{' '}
            <span>{formatRelativeTime(event.timestamp)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
