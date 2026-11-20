import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        {/* 404 illustration (animated) with the big 404 on top */}
        <div className="relative">
          <div
            className="h-[280px] bg-contain bg-center bg-no-repeat sm:h-[400px] bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')]"
            role="img"
            aria-label="404 illustration"
          />
          <h1 className="pointer-events-none absolute inset-x-0 top-4 text-center text-6xl font-extrabold tracking-tight text-foreground/90 sm:text-8xl">
            404
          </h1>
        </div>

        <div className="-mt-8 sm:-mt-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Looks like you&apos;re lost
          </h2>
          <p className="mt-2 text-muted-foreground">
            The page you are looking for isn&apos;t available.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-[#39ac31] px-6 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#2f9129] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ac31] focus-visible:ring-offset-2"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
