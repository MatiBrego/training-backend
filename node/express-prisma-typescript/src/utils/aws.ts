import * as aws from 'aws-sdk';

const s3 = new aws.S3({
    region: "sa-east-1",
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
});

export const generateUploadURL = async (id: string) => {
    return await s3.getSignedUrlPromise('putObject', {
        Bucket: "twitterclonemati-media",
        Key: id,
        Expires: 60,
    });
};

export const generateDownloadUrl = async (id: string) => {
    return await s3.getSignedUrlPromise('getObject', {
        Bucket: "twitterclonemati-media",
        Key: id,
        Expires: 60,
    });
};