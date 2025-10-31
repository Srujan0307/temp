import { useState, useEffect } from "react";

type NotificationPreference = {
  title: string;
  description: string;
  enabled: boolean;
  critical?: boolean;
};

type NotificationPreferences = {
  [key: string]: NotificationPreference;
};

const mockPreferences: NotificationPreferences = {
  "new-comment": {
    title: "New Comments",
    description: "Notify me when someone comments on my posts.",
    enabled: true,
  },
  "new-follower": {
    title: "New Followers",
    description: "Notify me when someone follows me.",
    enabled: true,
  },
  "critical-alerts": {
    title: "Critical Alerts",
    description: "Notify me about critical security and account alerts.",
    enabled: true,
    critical: true,
  },
};

export function useNotificationPreferences() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate initial fetch
    setTimeout(() => {
      setPreferences(mockPreferences);
    }, 500);
  }, []);

  const updatePreferences = async (
    newPreferences: Partial<NotificationPreferences>
  ) => {
    if (!preferences) return;

    const originalPreferences = { ...preferences };
    const updatedPreferences = { ...preferences, ...newPreferences };

    // Optimistic update
    setPreferences(updatedPreferences);
    setIsUpdating(true);
    setError(null);

    // Simulate API call
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate a random failure
          if (Math.random() > 0.8) {
            reject(new Error("Failed to update settings"));
          } else {
            resolve(null);
          }
        }, 1000);
      });
    } catch (e) {
      // Rollback on error
      setPreferences(originalPreferences);
      setError(e as Error);
    } finally {
      setIsUpdating(false);
    }
  };

  return { preferences, updatePreferences, isUpdating, error };
}
