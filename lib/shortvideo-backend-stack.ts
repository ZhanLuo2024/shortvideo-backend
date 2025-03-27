import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createVideoTable } from '../resources/tables/video-table';
import { createCommentTable } from '../resources/tables/comment-table';
import { setupGetVideosLambda } from '../resources/lambdas/get-videos';
import { setupPostCommentLambda } from "../resources/lambdas/post-comment";
import { setupGetCommentsLambda } from "../resources/lambdas/get-comments"
// import { createCognitoResources } from '../resources/auth/cognito';
import { setupApiGateway } from '../resources/api/api-gateway';
import { setupVideoBucket } from '../resources/s3/video-assets';


export class ShortvideoBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create DynamoDB tables
    const videoTable = createVideoTable(this);
    const commentTable = createCommentTable(this);

    // create s3 bucket
    const videoBucket = setupVideoBucket(this);

    // create Lambda
    const getVideosLambda = setupGetVideosLambda(this, videoTable);
    const postCommentLambda = setupPostCommentLambda(this, commentTable);
    const getCommentsLambda = setupGetCommentsLambda(this, commentTable);

    // create API Gateway and binding Lambda
    const api = setupApiGateway(this, {
      videos: {
        GET: { lambda: getVideosLambda },
      },
      comments: {
        POST: { lambda: postCommentLambda },
        GET: { lambda: getCommentsLambda },
      },

    });

  }
}
