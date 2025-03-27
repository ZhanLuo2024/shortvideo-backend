import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import {randomUUID} from "node:crypto";

const client = new DynamoDBClient({});
const COMMENT_TABLE_NAME = process.env.COMMENT_TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body || '{}');

        const { video_id, user, text, created_at } = body;

        const command = new PutItemCommand({
            TableName: COMMENT_TABLE_NAME,
            Item: marshall({
                comment_id: randomUUID(),
                video_id,
                user,
                text,
                created_at: created_at || Date.now(),
            }),
        });

        await client.send(command);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Comment added successfully' }),
        };
    } catch (err) {
        console.error('Error inserting comment:', err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to add comment' }),
        };
    }
};
