// scripts/seed-videos.ts
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { readdirSync } from 'fs';
import { join } from 'path';

const REGION = 'eu-west-1';
const TABLE_NAME = 'video_table';
const BUCKET_NAME = 'short-video-assets-481665112261';
const VIDEO_FOLDER = join(__dirname, '../assets/videos');

const client = new DynamoDBClient({ region: REGION });

async function seed() {
    const files = readdirSync(VIDEO_FOLDER).filter(f => f.endsWith('.mp4'));

    for (const file of files) {
        const videoId = file.replace('.mp4', '');
        const videoUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/videos/${file}`;
        const title = `Sample Video ${videoId.split('_')[1]}`;
        const views = Math.floor(Math.random() * 1000);
        const createdAt = Math.floor(Date.now() / 1000);

        const cmd = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                video_id: { S: videoId },
                title: { S: title },
                video_url: { S: videoUrl },
                views: { N: views.toString() },
                created_at: { N: createdAt.toString() },
            },
        });

        await client.send(cmd);
        console.log(`✅ Inserted ${videoId}`);
    }

    console.log('🎉 All videos inserted!');
}

seed().catch(console.error);
