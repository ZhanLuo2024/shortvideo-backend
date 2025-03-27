import { Construct } from 'constructs';
import { RestApi, LambdaIntegration, Cors, MethodOptions } from 'aws-cdk-lib/aws-apigateway';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';

interface LambdaRoute {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    lambda: LambdaFunction;
}

export function setupApiGateway(
    scope: Construct,
    routes: Record<string, LambdaRoute>
    ): RestApi {
    const api = new RestApi(scope, 'ShortVideoApi', {
        restApiName: 'ShortVideoApi',
        defaultCorsPreflightOptions: {
            allowOrigins: Cors.ALL_ORIGINS,
            allowMethods: Cors.ALL_METHODS,
        },
    });

    // auto register all lambda functions
    for (const [path, route] of Object.entries(routes)) {
        const resource = api.root.addResource(path);
        resource.addMethod(route.method, new LambdaIntegration(route.lambda));
    }

    return api;
}
