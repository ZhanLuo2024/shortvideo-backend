import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as path from 'path';

export function createPostLoginLambda(scope: Construct, userTable: Table): NodejsFunction {
    const fn = new NodejsFunction(scope, 'PostLoginHandler', {
        entry: path.join(__dirname, '../../lambdas/post-login-handler.ts'),
        handler: 'handler',
        runtime: Runtime.NODEJS_18_X,
        environment: {
            USER_TABLE_NAME: userTable.tableName,
        },
    });

    // Grant Lambda permissions to access userTable
    userTable.grantReadWriteData(fn);

    return fn;
}
