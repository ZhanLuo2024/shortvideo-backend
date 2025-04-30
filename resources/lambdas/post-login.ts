// /resources/lambdas/post-login.ts
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { IUserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function setupPostLoginLambda(
    scope: Construct,
    userPool: IUserPool,
    userPoolClient: UserPoolClient
): LambdaFunction {
    const fn = new NodejsFunction(scope, 'PostLoginLambda', {
        runtime: Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../../lambdas/post-login-handler.ts'),
        handler: 'handler',
        environment: {
            USER_POOL_ID: userPool.userPoolId,
            CLIENT_ID: userPoolClient.userPoolClientId,
        },
    });

    fn.addToRolePolicy(new PolicyStatement({
        actions: ['cognito-idp:AdminInitiateAuth'],
        resources: ['*'],
        effect: Effect.ALLOW,
    }));

    return fn;
}
