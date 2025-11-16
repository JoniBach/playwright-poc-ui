import { z } from 'zod';

export const JourneyMetadataSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	slug: z.string(),
	department: z.string(),
	departmentSlug: z.string(),
	enabled: z.boolean().default(true)
});

export const JourneyIndexSchema = z.object({
	journeys: z.array(JourneyMetadataSchema)
});

export type JourneyMetadata = z.infer<typeof JourneyMetadataSchema>;
export type JourneyIndex = z.infer<typeof JourneyIndexSchema>;
