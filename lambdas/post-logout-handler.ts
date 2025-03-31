import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});
const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const email = body.email;

        if (!email) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing email' }) };
        }

        await client.send(new UpdateItemCommand({
            TableName: USER_TABLE_NAME,
            Key: { user_id: { S: email } },
            UpdateExpression: 'SET isLogin = :val',
            ExpressionAttributeValues: {
                ':val': { BOOL: false }
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Logout success', email })
        };
    } catch (err) {
        console.error('Logout error:', err);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
