import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

const client = new DynamoDBClient({});

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
    const command = new ScanCommand({
        TableName: process.env.VIDEO_TABLE_NAME,
        Limit: 10,
    });

    const result = await client.send(command);

    const items = result.Items?.map(item => unmarshall(item)) || [];

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
    };
};
