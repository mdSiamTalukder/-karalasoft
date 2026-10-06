import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { getAdminSession } from '@/lib/admin-session';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default async function AdminLoginPage() {
  // Already signed in — skip the form.
  const session = await getAdminSession();
  if (session) redirect('/admin');

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="container-x flex flex-1 items-center justify-center py-14">
        <LoginForm />
      </div>

      <footer className="container-x pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-white"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to karalasoft.com
        </Link>
      </footer>
    </div>
  );
}