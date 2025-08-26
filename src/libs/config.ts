export const config = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-2',
    accessKey: process.env.NEXT_PUBLIC_AWS_KEY || process.env.AWS_KEY,
  }
};
