import { FormEvent, useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/use-auth';

export const LoginRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = value.trim() || crypto.randomUUID();
    login(token);

    const redirectPath =
      (location.state as { from?: Location } | undefined)?.from?.pathname ??
      '/';
    navigate(redirectPath, { replace: true });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="token">Personal access token</Label>
        <Input
          id="token"
          name="token"
          placeholder="Paste or generate a token"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Provide any string to simulate authentication in this environment.
        </p>
      </div>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
};
