import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Mock data for demonstration
const mockEntries = [
  {
    id: "1",
    title: "Introduction to TypeScript",
    date: "2023-11-01",
    excerpt: "Today I learned about TypeScript basics, including types, interfaces, and how to set up a TypeScript project.",
    tags: ["typescript", "javascript", "programming"],
  },
  {
    id: "2",
    title: "CSS Grid Layout",
    date: "2023-11-02",
    excerpt: "Explored CSS Grid and how it can be used to create complex layouts with minimal HTML markup.",
    tags: ["css", "web-design", "frontend"],
  },
  {
    id: "3",
    title: "React Hooks",
    date: "2023-11-03",
    excerpt: "Learned about React hooks like useState, useEffect, and useContext and how they simplify state management.",
    tags: ["react", "javascript", "frontend"],
  },
];

export default function EntriesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Learning Entries</h1>
        <Button asChild>
          <Link href="/new-entry">New Entry</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {mockEntries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{entry.title}</CardTitle>
                <span className="text-sm text-muted-foreground">{entry.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{entry.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-muted rounded-md text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild size="sm">
                <Link href={`/entries/${entry.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {mockEntries.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No entries yet</h3>
          <p className="text-muted-foreground mb-6">Start documenting your learning journey today</p>
          <Button asChild>
            <Link href="/new-entry">Create Your First Entry</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 