# Short Video App - Backend (CDK + TypeScript)

This is the backend for a mobile short video application built using AWS serverless architecture, with infrastructure defined using AWS CDK in TypeScript.

## 🛠️ Tech Stack

- **AWS CDK** (TypeScript)
- **Amazon DynamoDB** – video and comment storage
- **Amazon S3** – video and thumbnail file storage
- **API Gateway + Lambda** – RESTful APIs
- **Optional Cognito** – User authentication (CDK deployed, not integrated)

## 🏗️ Architecture Overview

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

6. **AWS Cognito** *(setup only)*
    - UserPool and Client created via CDK
    - Not fully integrated for token-based validation (optional extension)



## 📁 Features

- View short videos
- Add and view comments for videos
- Like videos (simple count only)
- Simulated login with backend state (`isLogin = true`)
- Upload video metadata (video manually uploaded to S3)
- Discovery page uses same API as homepage

## 🔐 Authentication

Authentication is handled via AWS Cognito, with user login status stored in DynamoDB for integration with application features. The Cognito setup is implemented using AWS CDK and can be extended to support full token-based authorization.

## 🔗 API Endpoints

| Method | Endpoint                | Description                      |
|--------|-------------------------|----------------------------------|
| GET    | `/videos`               | Get list of all videos           |
| POST   | `/videos`               | Upload video metadata            |
| POST   | `/comments`             | Add comment to a video           |
| GET    | `/comments?video_id=xx`| Get comments for a specific video|
| POST   | `/login`                | Simulate login (`isLogin = true`)|
| PATCH  | `/videos/{id}/like`     | Like a video (+1 like count)     |

## 🧳 Deployment

Deployed via AWS CDK. Simply run:

```bash
cdk deploy
