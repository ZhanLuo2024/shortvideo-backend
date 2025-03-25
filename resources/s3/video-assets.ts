import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
import { Stack } from 'aws-cdk-lib';

export function setupVideoBucket(scope: Construct): Bucket {

    const bucket = new Bucket(scope, 'ShortVideoAssetsBucket', {
        bucketName: `short-video-assets-${Stack.of(scope).account}`,
    });

    return bucket;
}
