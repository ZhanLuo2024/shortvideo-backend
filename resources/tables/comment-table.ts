// resources/tables/comment-table.ts
import { Construct } from 'constructs';
import { AttributeType, Table, BillingMode, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';

export function createCommentTable(scope: Construct): Table {
    const table = new Table(scope, 'CommentTable', {
        tableName: 'comment_table',
        partitionKey: { name: 'comment_id', type: AttributeType.STRING },
        billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // GSI for querying all comments under one video
    table.addGlobalSecondaryIndex({
        indexName: 'video_id-index',
        partitionKey: { name: 'video_id', type: AttributeType.STRING },
        projectionType: ProjectionType.ALL,
    });

    return table;
}
