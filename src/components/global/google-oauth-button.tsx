'use client';

import { Button } from '@/components/ui/button';
import { useGoogleAuth } from '@/hooks/use-auth';
import { Google } from '@/icons';
import { Loader } from '../forms/loader';

type GoogleAuthButtonProps = {
  method: 'signup' | 'signin';
};

export const GoogleAuthButton = ({ method }: GoogleAuthButtonProps) => {
  const { signUpWith, signInWith } = useGoogleAuth();

  const handleClick = () => {
    const authFunction = method === 'signin' ? signInWith : signUpWith;
    authFunction('oauth_google');
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full rounded-2xl flex gap-3 bg-themeBlack border-themeGray"
      variant="outline"
    >
      <Loader loading={false}>
        <Google />
        Google
      </Loader>
    </Button>
  );
};
