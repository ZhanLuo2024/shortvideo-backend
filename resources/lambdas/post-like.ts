import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as path from 'path';

export function setupPostLikeLambda(scope: Construct, videoTable: Table): NodejsFunction {
    const fn = new NodejsFunction(scope, 'PostLikeLambda', {
        entry: path.join(__dirname, '../../lambdas/post-like-handler.ts'),
        runtime: Runtime.NODEJS_18_X,
        environment: {
            VIDEO_TABLE_NAME: videoTable.tableName,
        },
    });

    videoTable.grantWriteData(fn);

    return fn;
}
