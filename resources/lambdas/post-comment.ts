//
import { Construct } from 'constructs';
import { Runtime, Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export function setupPostCommentLambda(scope: Construct, commentTable: Table): LambdaFunction {
    const fn = new NodejsFunction(scope, 'PostCommentLambda', {
        entry: path.join(__dirname, '../../lambdas/post-comment-handler.ts'),
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        environment: {
            COMMENT_TABLE_NAME: commentTable.tableName,
        },
    });

    commentTable.grantWriteData(fn);
    return fn;
}

