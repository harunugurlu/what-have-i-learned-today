import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Mock data for demonstration
const mockTags = [
  { name: "javascript", count: 15 },
  { name: "react", count: 12 },
  { name: "typescript", count: 8 },
  { name: "css", count: 7 },
  { name: "html", count: 6 },
  { name: "node", count: 5 },
  { name: "python", count: 4 },
  { name: "git", count: 4 },
  { name: "design", count: 3 },
  { name: "algorithms", count: 3 },
  { name: "database", count: 2 },
  { name: "api", count: 2 },
];

export default function TagsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Tags</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
          <CardDescription>Browse entries by topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {mockTags.map((tag) => (
              <Link 
                key={tag.name} 
                href={`/tags/${tag.name}`}
                className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm flex items-center gap-2 transition-colors"
              >
                <span>{tag.name}</span>
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
          
          {mockTags.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tags yet. Start adding tags to your entries.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Popular Tags</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTags.slice(0, 6).map((tag) => (
            <Card key={tag.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{tag.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tag.count} {tag.count === 1 ? 'entry' : 'entries'}
                </p>
                <Link 
                  href={`/tags/${tag.name}`}
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  View entries →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 