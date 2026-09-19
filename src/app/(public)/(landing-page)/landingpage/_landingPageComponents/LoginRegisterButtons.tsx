'use client';

import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/useModalStore';

const LoginRegisterButtons = () => {
  const { onOpen } = useModalStore();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        type="button"
        onClick={() => onOpen({ type: 'auth-modal', actionId: 'login' })}
        className="relative cursor-pointer rounded-full text-black max-md:bg-black max-md:text-white max-md:hover:bg-black max-md:hover:text-white"
      >
        Sign In
      </Button>
      <Button
        type="button"
        onClick={() => onOpen({ type: 'auth-modal', actionId: 'register' })}
        className="relative cursor-pointer rounded-full bg-blue-700 hover:bg-blue-800"
      >
        Sign Up
      </Button>
    </div>
  );
};

export default LoginRegisterButtons;
