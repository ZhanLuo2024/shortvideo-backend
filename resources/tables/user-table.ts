import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export function createUserTable(scope: Construct): Table {
    const table = new Table(scope, 'UserTable', {
        partitionKey: { name: 'user_id', type: AttributeType.STRING },
        tableName: 'user_table',
    });

    return table;
}
