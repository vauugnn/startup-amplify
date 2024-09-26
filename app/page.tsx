import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Acme Inc.</h1>
          <Link href="/auth">
            <Button variant="outline">Login</Button>
          </Link>
        </nav>
      </header>

      <main className="container my-auto mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personal Note-Taking Solution
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Capture your thoughts, organize your files, and boost your
            productivity.
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8 py-4">
              Get Started for Free
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Easy Note-Taking"
            description="Quickly jot down your ideas with our intuitive interface."
          />
          <FeatureCard
            title="File Storage"
            description="Securely store and organize all your important documents."
          />
          <FeatureCard
            title="Access Anywhere"
            description="Sync across all your devices for seamless productivity."
          />
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2023 Acme Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
