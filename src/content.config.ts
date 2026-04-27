import {defineCollection, z} from 'astro:content';
import {docsLoader} from '@astrojs/starlight/loaders';
import {docsSchema} from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				headerTitle: z.string().optional(),
				button: z.object({label: z.string(), href: z.string()}).optional()
			}),
		}),
	}),
};