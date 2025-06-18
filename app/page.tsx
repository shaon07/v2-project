import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Albums & Blogs</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Explore photo albums and read blog posts from our community
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Albums</CardTitle>
            <CardDescription>Browse photo albums and view beautiful images from our collection</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/albums">View Albums</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Blogs</CardTitle>
            <CardDescription>Read interesting blog posts and discover new perspectives</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/blogs">Read Blogs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
