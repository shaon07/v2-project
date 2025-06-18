import type { Album, Photo, User, Post, Comment } from "./types"

const BASE_URL = "https://jsonplaceholder.typicode.com"

export async function fetchAlbums(): Promise<Album[]> {
  const response = await fetch(`${BASE_URL}/albums`)
  if (!response.ok) throw new Error("Failed to fetch albums")
  return response.json()
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`)
  if (!response.ok) throw new Error("Failed to fetch users")
  return response.json()
}

export async function fetchPhotos(albumId: number): Promise<Photo[]> {
  const response = await fetch(`${BASE_URL}/photos?albumId=${albumId}`)
  if (!response.ok) throw new Error("Failed to fetch photos")
  return response.json()
}

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`)
  if (!response.ok) throw new Error("Failed to fetch posts")
  return response.json()
}

export async function fetchComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`${BASE_URL}/comments?postId=${postId}`)
  if (!response.ok) throw new Error("Failed to fetch comments")
  return response.json()
}
