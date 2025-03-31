# Short Video App - Backend (CDK + TypeScript)

This is the backend for a mobile short video application built using AWS serverless architecture, with infrastructure defined using AWS CDK in TypeScript.

## 🛠️ Tech Stack

- **AWS CDK (TypeScript)** – Infrastructure as Code
- **Amazon API Gateway + Lambda** – REST API
- **Amazon DynamoDB** – Video, comment, and user data
- **Amazon S3** – Stores video files
- **Amazon Cognito** – User authentication (email + password)

## 🏗️ Architecture Overview

```
Mobile App
   │
   ▼
API Gateway
   │
   ▼
Lambda Functions
   ├── DynamoDB (video_table, comment_table, user_table)
   └── S3 (videos)
```

1. **Mobile App (Frontend)**
    - Sends HTTP requests to backend APIs
    - Displays videos, comments, and handles user actions (like, comment, login)

2. **API Gateway**
    - Exposes RESTful endpoints for frontend interaction
    - Routes requests to corresponding Lambda functions

3. **Lambda Functions**
    - Handle business logic for each API endpoint
    - Communicate with DynamoDB and return responses

4. **DynamoDB**
    - `video_table`: Stores video metadata (title, URL, view count, like count)
    - `comment_table`: Stores user comments for each video
    - `user_table`: Stores user login status (`isLogin = true` when "logged in")

5. **Amazon S3**
    - Stores uploaded video files and (optionally) thumbnails
    - Videos are pre-uploaded; API stores metadata with the file URL


## 📁 Features

- View videos on the homepage & discovery tab
- Add and view comments for each video
- Like videos (count-only, no user binding)
- Email-based login/logout via Cognito
- Upload video (multipart form upload to S3)

## 🔐 Authentication

- Cognito User Pool is deployed via CDK (`cognito-user-pool.ts`)
- Upon login, the system updates `user_table` with `isLogin = true` to track session state
- Commenting and liking actions require a valid login  


## 🔗 API Endpoints

| Method | Endpoint                   | Description               |
|--------|----------------------------|---------------------------|
| GET    | `/videos`                  | Get list of all videos    |
| POST   | `/videos`                  | Upload a new video (multipart) |
| POST   | `/comments`                | Add comment to a video    |
| GET    | `/comments?video_id=xx`   | Get comments for a specific video |
| POST   | `/login`                   | Login (status saved)      |
| POST   | `/logout`                  | Logout (clear login status) |
| POST   | `/likes`                   | Like a video (+1 like count) |

## 🧳 Deployment

Deploy the entire backend stack with:

```bash
cdk deploy
