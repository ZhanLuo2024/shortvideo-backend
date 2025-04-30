// /lambdas/post-login-handler.ts
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import {
    CognitoIdentityProviderClient,
    AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});
const USER_POOL_ID = process.env.USER_POOL_ID!;
const CLIENT_ID = process.env.CLIENT_ID!;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { email, password } = body;

        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing email or password' }),
            };
        }

        const command = new AdminInitiateAuthCommand({
            AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
            UserPoolId: USER_POOL_ID,
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        });

        const response = await client.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login successful',
                idToken: response.AuthenticationResult?.IdToken,
            }),
        };
    } catch (err: any) {
        console.error('Login error:', err);
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: 'Login failed',
                error: err.message || 'Unknown error',
            }),
        };
    }
};
