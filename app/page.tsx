import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">What Have I Learned Today</h1>
        <p className="text-muted-foreground">Track and reflect on your daily learning journey</p>
      </header>

      <main className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Entry</CardTitle>
            <CardDescription>Document what you've learned today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Capture your learning experiences, insights, and new knowledge in a structured format.</p>
            <p className="text-sm text-muted-foreground">Use tags to organize your entries and markdown to format your content.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/new-entry">Start Writing</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browse Entries</CardTitle>
            <CardDescription>Review your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Explore your past entries, filter by tags, or search for specific topics.</p>
            <p className="text-sm text-muted-foreground">Reinforce your learning by regularly reviewing what you've documented.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/entries">View All Entries</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Streak</CardTitle>
            <CardDescription>Build consistency in learning</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Track your daily learning habit and maintain your streak.</p>
            <div className="flex items-center justify-center h-20">
              <span className="text-4xl font-bold">0</span>
              <span className="ml-2 text-muted-foreground">days</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">Last entry: Never</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
            <CardDescription>Explore topics you're learning about</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">See the categories and topics you're focusing on most.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-muted rounded-md text-sm">No tags yet</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" asChild>
              <Link href="/tags">View All Tags</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
