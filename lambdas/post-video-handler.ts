import * as multipart from 'lambda-multipart-parser';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { APIGatewayProxyHandler } from 'aws-lambda';

const s3 = new S3Client({});
const dynamodb = new DynamoDBClient({});

const BUCKET_NAME = process.env.BUCKET_NAME!;
const VIDEO_TABLE_NAME = process.env.VIDEO_TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const result = await multipart.parse(event);
        const file = result.files[0];
        const { title, user } = result;

        if (!file || !title || !user) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
        }

        const videoId = uuidv4();
        const fileKey = `videos/${videoId}.mp4`;

        // Upload to S3
        await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
            Body: file.content,
            ContentType: file.contentType,
        }));

        // Write to DynamoDB
        await dynamodb.send(new PutItemCommand({
            TableName: VIDEO_TABLE_NAME,
            Item: {
                video_id: { S: videoId },
                title: { S: title },
                user: { S: user },
                video_url: { S: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}` },
                created_at: { N: `${Date.now()}` },
                views: { N: '0' },
                likes: { N: '0' },
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Video uploaded successfully',
                video_id: videoId,
            }),
        };
    } catch (err) {
        console.error('Upload error:', err);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
