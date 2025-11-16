import { JourneySchema, type JourneyJson } from '$lib/schemas/journey.schema';
import type { Journey, JourneyPage } from '$lib/types/journey';
import { getValidationRule } from '$lib/validation/rules';

/**
 * Load and parse a journey from JSON
 */
export async function loadJourney(journeyId: string): Promise<Journey> {
	try {
		// Fetch the JSON file from static folder
		const response = await fetch(`/journeys/${journeyId}.json`);
		
		if (!response.ok) {
			throw new Error(`Failed to load journey: ${journeyId}`);
		}

		const jsonData = await response.json();

		// Validate with Zod
		const validatedData: JourneyJson = JourneySchema.parse(jsonData);

		// Convert to Journey type with validation functions
		const journey: Journey = {
			id: validatedData.id,
			name: validatedData.name,
			landingPage: validatedData.landingPage,
			startPage: validatedData.startPage,
			checkYourAnswersPage: validatedData.checkYourAnswersPage,
			completionPage: validatedData.completionPage,
			pages: Object.fromEntries(
				Object.entries(validatedData.pages).map(([pageId, page]) => {
					const convertedPage: JourneyPage = {
						id: page.id,
						title: page.title,
						components: page.components as any, // Type assertion needed for dynamic JSON loading
						nextPage: page.nextPage,
						previousPage: page.previousPage,
						validation: page.validation ? getValidationRule(page.validation) : undefined
					};
					return [pageId, convertedPage];
				})
			)
		};

		return journey;
	} catch (error) {
		console.error('Error loading journey:', error);
		throw error;
	}
}

/**
 * Load the journey index
 */
export async function loadJourneyIndex() {
	try {
		const response = await fetch('/journeys/index.json');
		
		if (!response.ok) {
			throw new Error('Failed to load journey index');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error loading journey index:', error);
		return { journeys: [] };
	}
}

/**
 * Load all available journeys
 */
export async function loadAllJourneys(): Promise<Journey[]> {
	const index = await loadJourneyIndex();
	const enabledJourneys = index.journeys.filter((j: any) => j.enabled);
	
	const journeys = await Promise.all(
		enabledJourneys.map((meta: any) => loadJourney(meta.id).catch(() => null))
	);

	return journeys.filter((j): j is Journey => j !== null);
}

/**
 * Validate journey JSON without loading
 */
export function validateJourneyJson(jsonData: unknown): { valid: boolean; errors?: string[] } {
	try {
		JourneySchema.parse(jsonData);
		return { valid: true };
	} catch (error: any) {
		return {
			valid: false,
			errors: error.errors?.map((e: any) => `${e.path.join('.')}: ${e.message}`)
		};
	}
}
