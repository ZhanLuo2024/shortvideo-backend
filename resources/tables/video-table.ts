// resources/tables/video-table.ts
import { Construct } from 'constructs';
import { AttributeType, Table, BillingMode } from 'aws-cdk-lib/aws-dynamodb';

export function createVideoTable(scope: Construct): Table {
    return new Table(scope, 'VideoTable', {
        tableName: 'video_table',
        partitionKey: { name: 'video_id', type: AttributeType.STRING },
        billingMode: BillingMode.PAY_PER_REQUEST,
    });
}
