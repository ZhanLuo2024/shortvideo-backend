// lambdas/post-like-handler.ts
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({});
const VIDEO_TABLE_NAME = process.env.VIDEO_TABLE_NAME!;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { video_id } = body;

        if (!video_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing video_id' }),
            };
        }

        await dynamodb.send(
            new UpdateItemCommand({
                TableName: VIDEO_TABLE_NAME,
                Key: { video_id: { S: video_id } },
                UpdateExpression: 'SET likes = if_not_exists(likes, :zero) + :incr',
                ExpressionAttributeValues: {
                    ':incr': { N: '1' },
                    ':zero': { N: '0' },
                },
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Like updated successfully', video_id }),
        };
    } catch (err) {
        console.error('Like update failed', err);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};
