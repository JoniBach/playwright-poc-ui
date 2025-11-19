import { z } from 'zod';
import { ComponentSchema } from './component.schema.js';

// Use the strict component schema instead of loose configuration
export const ComponentConfigSchema = ComponentSchema;

// Journey page schema
export const JourneyPageSchema = z.object({
	id: z.string(),
	title: z.string(),
	components: z.array(ComponentSchema),
	nextPage: z.string().optional(),
	previousPage: z.string().optional(),
	validation: z.string().optional(), // Validation rule ID
	conditionalRouting: z.record(z.string(), z.string()).optional() // field_value -> next_page mapping
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
		.refine(
			(href) => {
				// Must start with /
				if (!href.startsWith('/')) return false;
				
				// Must have format: /{dept}/{journey}/apply
				const parts = href.split('/').filter(p => p.length > 0);
				if (parts.length !== 3) return false;
				
				// Last part must be 'apply'
				if (parts[2] !== 'apply') return false;
				
				return true;
			},
			{
				message: "startButtonHref must follow format: /{departmentSlug}/{journeySlug}/apply (e.g., '/hmcts/register-a-plea/apply')"
			}
		)
});

// Journey schema with cross-validation
export const JourneySchema = z.object({
	id: z.string(),
	name: z.string(),
	landingPage: LandingPageSchema.optional(),
	startPage: z.string(),
	pages: z.record(z.string(), JourneyPageSchema),
	checkYourAnswersPage: z.string().optional(),
	completionPage: z.string().optional()
}).refine(
	(journey) => {
		// If landingPage exists, validate that startButtonHref matches journey id
		if (journey.landingPage) {
			const href = journey.landingPage.startButtonHref;
			const parts = href.split('/').filter(p => p.length > 0);
			
			// parts[1] should match journey.id (the journey slug)
			if (parts.length === 3 && parts[1] !== journey.id) {
				return false;
			}
		}
		return true;
	},
	{
		message: "landingPage.startButtonHref must include the journey id as the slug (second path segment)"
	}
);

// Export types inferred from schemas
export type ComponentConfigJson = z.infer<typeof ComponentConfigSchema>;
export type JourneyPageJson = z.infer<typeof JourneyPageSchema>;
export type LandingPageJson = z.infer<typeof LandingPageSchema>;
export type JourneyJson = z.infer<typeof JourneySchema>;
