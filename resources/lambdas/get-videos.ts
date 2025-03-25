// resources/lambdas/get-videos.ts
import { Construct } from 'constructs';
import { Runtime, Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export function setupGetVideosLambda(scope: Construct, videoTable: Table): LambdaFunction {
    const fn = new NodejsFunction(scope, 'GetVideosLambda', {
        entry: path.join(__dirname, '../../lambdas/get-videos-handler.ts'),
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        environment: {
            VIDEO_TABLE_NAME: videoTable.tableName,
        },
    });

    videoTable.grantReadData(fn);
    return fn;
}