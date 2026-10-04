import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-start justify-center py-24">
      <Eyebrow>404</Eyebrow>
      <h1 className="my-6 max-w-[20ch] text-[clamp(42px,7vw,80px)] leading-[0.95] tracking-[-0.055em]">
        This page hasn’t been built yet.
      </h1>
      <p className="lead">
        The page you are looking for does not exist or has been moved. Head back to the homepage or
        tell us what you want to build.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/" variant="primary">
          Back to home <span aria-hidden="true">→</span>
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          Contact us
        </ButtonLink>
      </div>
    </Container>
  );
}