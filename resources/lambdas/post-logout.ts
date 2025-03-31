import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as path from 'path';

export function setupPostLogoutLambda(scope: Construct, userTable: Table): NodejsFunction {
    const fn = new NodejsFunction(scope, 'PostLogoutLambda', {
        entry: path.join(__dirname, '../../lambdas/post-logout-handler.ts'),
        runtime: Runtime.NODEJS_18_X,
        environment: {
            USER_TABLE_NAME: userTable.tableName,
        },
    });

    userTable.grantWriteData(fn);

    return fn;
}

