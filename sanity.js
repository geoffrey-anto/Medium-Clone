import {
    // createCurrentUserHook,
    createClient,
} from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url'

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hkvzxpf1',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '1',
    useCdn: process.env.NODE_ENV === 'production',
};

export const sanityClient = createClient(config);

export const urlFor = (source) => {
    return createImageUrlBuilder(config).image(source);
}