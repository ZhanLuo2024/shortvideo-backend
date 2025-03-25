import { Construct } from 'constructs';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';

export function setupApiGateway(scope: Construct, getVideosLambda: LambdaFunction): RestApi {
    const api = new RestApi(scope, 'ShortVideoApi', {
        restApiName: 'ShortVideoApi',
        defaultCorsPreflightOptions: {
            allowOrigins: Cors.ALL_ORIGINS,
            allowMethods: Cors.ALL_METHODS,
        },
    });

    const videos = api.root.addResource('videos');
    videos.addMethod('GET', new LambdaIntegration(getVideosLambda));

    return api;
}
