import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col h-full w-full items-center justify-center text-center">
      <h2 className="text-5xl text-primary">Whoops!</h2>
      <p className="text-muted-foreground">
        We could not find the page you were looking for
      </p>
      <Link href="/" className="hover:underline">
        <p>Go to landing page instead?</p>
      </Link>
    </main>
  );
}
