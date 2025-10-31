import { useState } from 'react';

import { checklist } from './filing-checklist.data';

export const FilingChecklist = () => {
  const [items, setItems] = useState(checklist);

  const totalItems = items.flatMap((section) => section.items).length;
  const completedItems = items
    .flatMap((section) => section.items)
    .filter((item) => item.checked).length;
  const progress = (completedItems / totalItems) * 100;

  const handleToggle = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      }))
    );
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Checklist</h2>
      <div>
        <progress value={progress} max="100" />
        <span>{Math.round(progress)}%</span>
      </div>
      {items.map((section) => (
        <div key={section.title}>
          <h3 className="font-bold">{section.title}</h3>
          <ul>
            {section.items.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggle(item.id)}
                  />
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
