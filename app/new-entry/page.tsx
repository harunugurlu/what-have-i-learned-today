import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function NewEntryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Entry</h1>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>What did you learn today?</CardTitle>
          <CardDescription>Document your learning experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Give your entry a title" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              placeholder="Describe what you learned today. You can use markdown for formatting." 
              className="min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              Supports markdown: **bold**, *italic*, `code`, etc.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder="Add tags separated by commas (e.g., javascript, react, css)" />
            <p className="text-xs text-muted-foreground">
              Tags help you organize and find your entries later
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resources">Resources (Optional)</Label>
            <Textarea 
              id="resources" 
              placeholder="Add links to resources you used (articles, videos, books, etc.)" 
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save Entry</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 