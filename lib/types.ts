export interface Album {
  id: number
  userId: number
  title: string
}

export interface Photo {
  id: number
  albumId: number
  title: string
  url: string
  thumbnailUrl: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}
