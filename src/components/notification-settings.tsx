"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useNotificationPreferences } from "@/hooks/use-notification-preferences";

type PreferenceKey = string;

export function NotificationSettings() {
  const { preferences, updatePreferences, isUpdating, error } =
    useNotificationPreferences();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [pendingChange, setPendingChange] = React.useState<{
    key: PreferenceKey;
    newValue: boolean;
  } | null>(null);

  const handleCheckedChange = (key: PreferenceKey, checked: boolean) => {
    const preference = preferences?.[key];
    if (preference?.critical && !checked) {
      setPendingChange({ key, newValue: checked });
      setDialogOpen(true);
    } else {
      updatePreferences({ [key]: { ...preference, enabled: checked } });
    }
  };

  const confirmChange = () => {
    if (pendingChange) {
      const preference = preferences?.[pendingChange.key];
      updatePreferences({
        [pendingChange.key]: { ...preference, enabled: pendingChange.newValue },
      });
    }
    setDialogOpen(false);
    setPendingChange(null);
  };

  const cancelChange = () => {
    setDialogOpen(false);
    setPendingChange(null);
  };

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (!preferences) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-row items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <Label htmlFor={key} className="text-base">
                  {value.title}
                </Label>
                <p
                  id={`${key}-description`}
                  className="text-sm text-muted-foreground"
                >
                  {value.description}
                </p>
              </div>
              <Switch
                id={key}
                checked={value.enabled}
                onCheckedChange={(checked) => handleCheckedChange(key, checked)}
                aria-describedby={`${key}-description`}
                disabled={isUpdating}
              />
            </div>
          ))}
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Disabling this notification may prevent you from receiving
              important alerts about your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelChange}>
              Cancel
            </Button>
            <Button onClick={confirmChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
