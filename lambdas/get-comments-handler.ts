import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({});
const COMMENT_TABLE_NAME = process.env.COMMENT_TABLE_NAME!;
const VIDEO_ID_INDEX_NAME = 'video_id-index';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
    try {
        const videoId = event.queryStringParameters?.video_id;
        if (!videoId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing video_id' }),
            };
        }

        const command = new QueryCommand({
            TableName: COMMENT_TABLE_NAME,
            IndexName: VIDEO_ID_INDEX_NAME,
            KeyConditionExpression: 'video_id = :v',
            ExpressionAttributeValues: {
                ':v': { S: videoId },
            },
        });

        const result = await client.send(command);
        const comments = result.Items?.map((item) => unmarshall(item)) || [];

        return {
            statusCode: 200,
            body: JSON.stringify(comments),
        };
    } catch (err) {
        console.error('Error querying comments:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve comments' }),
        };
    }
};
