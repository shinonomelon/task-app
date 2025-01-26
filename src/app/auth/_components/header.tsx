import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export const Header = ({ type }: { type: 'signin' | 'signup' }) => {
  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold">Task App</span>
      </Link>
      <Link
        href={{
          pathname: '/auth',
          query: { type: type === 'signin' ? 'signup' : 'signin' }
        }}
        className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 font-bold text-gray-600 shadow-sm transition-colors duration-150 ease-in hover:text-gray-900"
      >
        {type === 'signin' ? 'はじめての方はこちら' : 'アカウントをお持ちの方'}
        <ArrowRightIcon className="size-4" />
      </Link>
    </header>
  );
};
