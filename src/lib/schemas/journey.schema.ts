import { z } from 'zod';

// Component configuration schema
export const ComponentConfigSchema = z.object({
	type: z.string(),
	props: z.record(z.string(), z.any())
});

// Journey page schema
export const JourneyPageSchema = z.object({
	id: z.string(),
	title: z.string(),
	components: z.array(ComponentConfigSchema),
	nextPage: z.string().optional(),
	previousPage: z.string().optional(),
	validation: z.string().optional() // Validation rule ID
});

// Landing page section schema
export const LandingPageSectionSchema = z.object({
	type: z.enum(['paragraph', 'heading', 'list', 'insetText', 'warningText', 'details']),
	content: z.union([z.string(), z.array(z.string())]),
	level: z.enum(['s', 'm', 'l', 'xl']).optional(),
	summary: z.string().optional(),
	listType: z.enum(['bullet', 'number']).optional()
});

// Landing page schema
export const LandingPageSchema = z.object({
	title: z.string(),
	lead: z.string(),
	sections: z.array(LandingPageSectionSchema),
	startButtonText: z.string().optional(),
	startButtonHref: z.string()
});

// Journey schema
export const JourneySchema = z.object({
	id: z.string(),
	name: z.string(),
	landingPage: LandingPageSchema.optional(),
	startPage: z.string(),
	pages: z.record(z.string(), JourneyPageSchema),
	checkYourAnswersPage: z.string().optional(),
	completionPage: z.string().optional()
});

// Export types inferred from schemas
export type ComponentConfigJson = z.infer<typeof ComponentConfigSchema>;
export type JourneyPageJson = z.infer<typeof JourneyPageSchema>;
export type LandingPageJson = z.infer<typeof LandingPageSchema>;
export type JourneyJson = z.infer<typeof JourneySchema>;
