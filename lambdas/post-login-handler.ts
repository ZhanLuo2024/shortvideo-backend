import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({});
const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;
const ALLOWED_EMAIL = 'demo@example.com';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const email = body.email;

        if (!email || email !== ALLOWED_EMAIL) {
            return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized user' }) };
        }

        // Check if the user already exists
        const existing = await client.send(new GetItemCommand({
            TableName: USER_TABLE_NAME,
            Key: { user_id: { S: email } }
        }));

        if (!existing.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found in system' })
            };
        }

        // status update
        await client.send(new UpdateItemCommand({
            TableName: USER_TABLE_NAME,
            Key: { user_id: { S: email } },
            UpdateExpression: 'SET isLogin = :val',
            ExpressionAttributeValues: {
                ':val': { BOOL: true }
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Login success', email })
        };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
