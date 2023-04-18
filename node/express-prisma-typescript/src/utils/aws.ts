import * as aws from 'aws-sdk';

const s3 = new aws.S3({
    region: "sa-east-1",
    accessKeyId: "AKIA4O6QTD3AWQRT5NN4",
    secretAccessKey: "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",
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