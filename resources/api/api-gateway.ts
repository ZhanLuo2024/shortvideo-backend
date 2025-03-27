import { Construct } from 'constructs';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type LambdaRoute = {
    [method in HttpMethod]?: {
        lambda: LambdaFunction;
    };
};

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

    /**
     * auto register all lambda functions
     *
     * O(n²)
     */

    for (const [path, routeMethods] of Object.entries(routes)) {
        const resource = api.root.addResource(path);

        for (const method of Object.keys(routeMethods) as HttpMethod[]) {
            const lambda = routeMethods[method]?.lambda;
            if (lambda) {
                resource.addMethod(method, new LambdaIntegration(lambda));
            }
        }
    }

    return api;
}
