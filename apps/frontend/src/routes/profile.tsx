
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';

// This is a placeholder for the actual API call
const updateUser = async (data: { password?: string; mfaEnabled?: boolean }) => {
  console.log('Updating user:', data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

export const ProfileRoute = () => {
  const [password, setPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateUser({ password, mfaEnabled }),
    onSuccess: () => {
      console.log('Profile updated successfully');
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mfa"
                checked={mfaEnabled}
                onChange={(e) => setMfaEnabled(e.target.checked)}
              />
              <Label htmlFor="mfa">Enable Multi-Factor Authentication</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
