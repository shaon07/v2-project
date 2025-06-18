"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BlogSkeleton } from "@/components/skeleton-card"
import { Separator } from "@/components/ui/separator"
import { fetchPosts, fetchUsers, fetchComments } from "@/lib/api"
import type { Post, User, Comment } from "@/lib/types"
import { Heart, MessageCircle, UserIcon, AlertCircle } from "lucide-react"

export default function BlogsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [postsData, usersData] = await Promise.all([fetchPosts(), fetchUsers()])
        setPosts(postsData)
        setUsers(usersData)

        // Load liked posts from localStorage
        const saved = localStorage.getItem("likedPosts")
        if (saved) {
          setLikedPosts(new Set(JSON.parse(saved)))
        }
      } catch (err) {
        setError("Failed to load blog posts. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post)
    setCommentsLoading(true)
    try {
      const commentsData = await fetchComments(post.id)
      setComments(commentsData)
    } catch (err) {
      setError("Failed to load comments")
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts)
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
    localStorage.setItem("likedPosts", JSON.stringify(Array.from(newLikedPosts)))
  }

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || "Unknown User"
  }

  const filteredPosts =
    selectedAuthor === "all" ? posts : posts.filter((post) => post.userId === Number.parseInt(selectedAuthor))

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found for the selected author.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle
                  className="text-lg line-clamp-2 cursor-pointer hover:text-primary"
                  onClick={() => handlePostClick(post)}
                >
                  {post.title}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {getUserName(post.userId)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.body.substring(0, 100)}...</p>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => handlePostClick(post)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Read More
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={likedPosts.has(post.id) ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                    Like
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedPost?.title}</DialogTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4 mr-1" />
                {selectedPost && getUserName(selectedPost.userId)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectedPost && handleLike(selectedPost.id)}
                className={selectedPost && likedPosts.has(selectedPost.id) ? "text-red-500" : ""}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${selectedPost && likedPosts.has(selectedPost.id) ? "fill-current" : ""}`}
                />
                {selectedPost && likedPosts.has(selectedPost.id) ? "Liked" : "Like"}
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <p className="text-base leading-relaxed">{selectedPost?.body}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Comments {commentsLoading ? "" : `(${comments.length})`}</h3>

              {commentsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <p className="text-muted-foreground">No comments yet.</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-muted pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{comment.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {comment.email}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
