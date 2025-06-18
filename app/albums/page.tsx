"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlbumSkeleton, PhotoSkeleton } from "@/components/skeleton-card"
import { fetchAlbums, fetchUsers, fetchPhotos } from "@/lib/api"
import type { Album, User, Photo } from "@/lib/types"
import Image from "next/image"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

const ITEMS_PER_PAGE = 12

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [photosLoading, setPhotosLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [albumsData, usersData] = await Promise.all([fetchAlbums(), fetchUsers()])
        setAlbums(albumsData)
        setUsers(usersData)
      } catch (err) {
        setError("Failed to load albums. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAlbumClick = async (album: Album) => {
    setSelectedAlbum(album)
    setPhotosLoading(true)
    try {
      const photosData = await fetchPhotos(album.id)
      setPhotos(photosData.slice(0, 5)) // First 5 photos
    } catch (err) {
      setError("Failed to load photos")
    } finally {
      setPhotosLoading(false)
    }
  }

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || "Unknown User"
  }

  const totalPages = Math.ceil(albums.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedAlbums = albums.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Photo Albums</h1>
        <Badge variant="secondary">{albums.length} albums</Badge>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <AlbumSkeleton key={i} />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No albums found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedAlbums.map((album) => (
              <Card
                key={album.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAlbumClick(album)}
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{album.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {getUserName(album.userId)}</p>
                </CardHeader>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!selectedAlbum} onOpenChange={() => setSelectedAlbum(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAlbum?.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">by {selectedAlbum && getUserName(selectedAlbum.userId)}</p>
          </DialogHeader>

          {photosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <PhotoSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="space-y-2">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={photo.thumbnailUrl || "/placeholder.svg"}
                      alt={photo.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(photo.url, "_blank")}
                    />
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{photo.title}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
