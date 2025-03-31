import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as path from 'path';
import {Duration} from "aws-cdk-lib";

export function setupPostVideoLambda(scope: Construct, videoTable: Table, bucket: Bucket): NodejsFunction {
    const fn = new NodejsFunction(scope, 'PostVideoLambda', {
        entry: path.join(__dirname, '../../lambdas/post-video-handler.ts'),
        runtime: Runtime.NODEJS_18_X,
        timeout: Duration.seconds(30),
        environment: {
            VIDEO_TABLE_NAME: videoTable.tableName,
            BUCKET_NAME: bucket.bucketName,
        },
    });

    videoTable.grantWriteData(fn);
    bucket.grantPut(fn);

    return fn;
}
