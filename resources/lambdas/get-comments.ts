// resources/lambdas/get-comments.ts
import { Construct } from 'constructs';
import { Runtime, Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export function setupGetCommentsLambda(scope: Construct, commentTable: Table): LambdaFunction {
    const fn = new NodejsFunction(scope, 'GetCommentsLambda', {
        entry: path.join(__dirname, '../../lambdas/get-comments-handler.ts'),
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        environment: {
            COMMENT_TABLE_NAME: commentTable.tableName,
        },
    });

    commentTable.grantReadData(fn);
    return fn;
}
