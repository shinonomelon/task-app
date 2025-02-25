'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useUser } from '@/lib/auth';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { signOut } from '@/actions/auth/sign-out';

export const UserMenu = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    const response = await signOut();

    if (response.success) {
      setUser(null);
      router.push('/');
      toast.success(response.message);
    } else {
      toast.error(response.message, {
        style: {
          background: 'red',
          color: 'white'
        }
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="hidden flex-1 items-center gap-2 md:flex">
        <Avatar>
          <AvatarImage
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.name || ''}
          />
          <AvatarFallback>
            {user.user_metadata.name?.[0] || user.user_metadata.email?.[0]}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[170px] truncate text-sm text-muted-foreground">
          {user.user_metadata.name || user.user_metadata.email?.split('@')[0]}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center md:hidden">
        <Avatar>
          <AvatarImage
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.name || ''}
          />
          <AvatarFallback>
            {user.user_metadata.name?.[0] || user.user_metadata.email?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="ログアウトする"
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
            >
              <LogOut className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">ログアウト</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
