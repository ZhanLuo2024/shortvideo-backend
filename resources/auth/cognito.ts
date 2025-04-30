// /resources/auth/create-cognito.ts
import { Construct } from 'constructs';
import {
    UserPool,
    UserPoolClient,
    AccountRecovery,
    UserPoolClientIdentityProvider,
    VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';

export function createCognitoResources(scope: Construct) {
    const userPool = new UserPool(scope, 'ShortVideoUserPool', {
        selfSignUpEnabled: true,
        signInAliases: { email: true },
        autoVerify: { email: true },
        accountRecovery: AccountRecovery.EMAIL_ONLY,
        userVerification: {
            emailSubject: 'Verify your email for ShortVideoApp',
            emailBody: 'Thanks for signing up! Your verification code is {####}',
            emailStyle: VerificationEmailStyle.CODE,
        },
    });

    const userPoolClient = new UserPoolClient(scope, 'ShortVideoUserPoolClient', {
        userPool,
        authFlows: {
            adminUserPassword: true, // for backend login (adminInitiateAuth)
        },
        supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
    });

    return { userPool, userPoolClient };
}
