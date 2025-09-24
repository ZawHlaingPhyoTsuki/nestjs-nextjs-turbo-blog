# 🌐 Full-Stack Blog Application with Next.js & NestJS

A full-stack blog application built using **Next.js** (frontend) and **NestJS** (backend) with a **GraphQL API**.

---

## 📋 Project Overview

This project serves as a learning experience to master contemporary web technologies. It features:

- **Authentication** (email/password + OAuth 2.0)
- **File storage** via Supabase
- **CRUD operations** for posts, comments, tags, and users
- **Like system** and **commenting**
- **Pagination** and **aggregation counts**
- **JWT-based session management**
- **Monorepo architecture** with Turborepo

---

## 🚀 Tech Stack

### Frontend
- **Next.js** (App Router)
- **shadcn/ui** – Beautiful, accessible UI components
- **TanStack Query** – Server state management
- **jose** – JWT handling for sessions
- **GraphQL Client** – Apollo Client or URQL
- **Turborepo** – High-performance monorepo orchestration

### Backend
- **NestJS** – Scalable Node.js framework
- **GraphQL** with **Apollo Server**
- **Passport.js** – Authentication strategies
- **OAuth 2.0** – Social login support
- **Argon2** – Secure password hashing
- **Supabase** – Cloud storage for avatars and thumbnails

---

## 🏗️ GraphQL API Overview

The backend exposes a comprehensive GraphQL schema for managing all application data.

### Core Entities

#### `User`
```graphql
type User {
  id: Int!
  name: String!
  email: String!
  bio: String
  avatar: String
  posts: [Post!]!
  comments: [CommentEntity!]!
}
```

#### `Post`
```graphql
type Post {
  id: Int!
  title: String!
  slug: String
  thumbnail: String!
  content: String!
  published: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  author: User!
  tags: [Tag!]!
  comments: [CommentEntity!]!
  _count: Count!
}

type Count {
  likes: Int!
  comments: Int!
}
```

#### `CommentEntity`
```graphql
type CommentEntity {
  id: Int!
  content: String!
  post: Post!
  author: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### `Tag`
```graphql
type Tag {
  id: Int!
  name: String!
  posts: [Post!]!
}
```

#### `Auth Payload`
```graphql
type AuthPayload {
  id: Float!
  name: String!
  avatar: String
  accessToken: String!  # JWT for authenticated requests
}
```

#### `Sign In Mutation`
```graphql
input SignInInput {
  email: String!
  password: String!
}
```

### 📝 Post Management

#### `Queries`
```graphql
type Query {
  posts(skip: Float, take: Float): [Post!]!
  postCount: Int!
  getPostById(id: Int!): Post!
  getUserPosts(skip: Int, take: Int): [Post!]!
  userPostCount: Int!
}
```

#### `Mutations`
```graphql
input CreatePostInput {
  title: String!
  content: String!
  thumbnail: String
  tags: [String!]!
  published: Boolean!
}

input UpdatePostInput {
  title: String
  content: String
  thumbnail: String
  tags: [String!]
  published: Boolean
  postId: Int!
}

type Mutation {
  createPost(createPostInput: CreatePostInput!): Post!
  updatePost(updatePostInput: UpdatePostInput!): Post!
  deletePost(postId: Int!): Boolean!
}
```

### 💬 Comment System

#### `Queries`
```graphql
type Query {
  getPostComments(postId: Int!, take: Int = 12, skip: Int = 0): [CommentEntity!]!
  postCommentCount(postId: Int!): Int!
}
```

#### `Mutations`
```graphql
input CreateCommentInput {
  postId: Int!
  content: String!
}

type Mutation {
  createComment(createCommentInput: CreateCommentInput!): CommentEntity!
}

📊 Default pagination: take: 12, skip: 0 
```

### ❤️ Like System

#### `Queries`
```graphql
type Query {
  postLikesCount(postId: Int!): Int!
  userLikedPost(postId: Int!): Boolean!
}
```

#### `Mutations`
```graphql
type Mutation {
  likePost(postId: Int!): Boolean!
  unlikePost(postId: Int!): Boolean!
}
```

### 👥 User Management

#### `Mutations`
```graphql
input CreateUserInput {
  name: String!
  password: String!  # Hashed with Argon2
  email: String!
  bio: String
  avatar: String
}

type Mutation {
  createUser(createUserInput: CreateUserInput!): User!
}
```
