import { z } from 'zod';
import type { Component } from '$lib/schemas/component.schema';

/**
 * Dynamic Zod schema generator for journey form data validation
 * Generates runtime validators from journey JSON configuration
 */

/**
 * Generate a Zod schema for a single component's data
 */
export function generateComponentSchema(component: any): z.ZodTypeAny {
	// Extract field name from component
	const fieldName = component.props?.name || component.id || 'unknown';

	// Get validation rules if they exist (using any type for flexibility)
	const validation = (component as any).validation;

	switch (component.type) {
		case 'textInput':
		case 'email':
		case 'tel':
		case 'textarea': {
			let schema: z.ZodString = z.string();

			// Apply validation rules
			if (validation) {
				if (validation.required) {
					schema = schema.min(1, validation.errorMessages?.required || 'This field is required');
				} else {
					schema = schema.optional() as any;
				}

				if (validation.minLength) {
					schema = schema.min(
						validation.minLength,
						validation.errorMessages?.minLength || `Must be at least ${validation.minLength} characters`
					);
				}

				if (validation.maxLength) {
					schema = schema.max(
						validation.maxLength,
						validation.errorMessages?.maxLength || `Must be ${validation.maxLength} characters or less`
					);
				}

				// Pattern validation
				if (validation.pattern) {
					const patterns: Record<string, RegExp> = {
						email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
						phone: /^[\d\s\+\-\(\)]+$/,
						postcode: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
						url: /^https?:\/\/.+/,
						'ni-number': /^[A-Z]{2}\d{6}[A-Z]$/i
					};

					const regex = patterns[validation.pattern];
					if (regex) {
						schema = schema.regex(
							regex,
							validation.errorMessages?.pattern || `Invalid ${validation.pattern} format`
						);
					}
				}

				// Custom pattern
				if (validation.customPattern) {
					schema = schema.regex(
						new RegExp(validation.customPattern),
						validation.errorMessages?.pattern || 'Invalid format'
					);
				}
			}

			return schema;
		}

		case 'radios':
		case 'select': {
			// Get valid values from items
			const items = 'props' in component && component.props && 'items' in component.props
				? component.props.items
				: [];

			const validValues = items.map((item: any) => item.value);

			let schema = z.enum(validValues as [string, ...string[]]);

			if (validation && !validation.required) {
				return schema.optional();
			}

			return schema;
		}

		case 'checkboxes': {
			// Get valid values from items
			const items = 'props' in component && component.props && 'items' in component.props
				? component.props.items
				: [];

			const validValues = items.map((item: any) => item.value);

			let schema = z.array(z.enum(validValues as [string, ...string[]]));

			if (validation && !validation.required) {
				return schema.optional();
			}

			return schema;
		}

		case 'dateInput': {
			// Date input can be validated as a date string or object
			let schema = z.union([
				z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
				z.object({
					day: z.string(),
					month: z.string(),
					year: z.string()
				})
			]);

			if (validation && !validation.required) {
				return schema.optional();
			}

			return schema;
		}

		default:
			// For non-input components, return optional string
			return z.string().optional();
	}
}

/**
 * Generate a Zod schema for an entire page's form data
 */
export function generatePageSchema(components: any[]): z.ZodObject<any> {
	const schemaShape: Record<string, z.ZodTypeAny> = {};

	for (const component of components) {
		// Only process input components
		if (!['textInput', 'email', 'tel', 'textarea', 'radios', 'checkboxes', 'select', 'dateInput'].includes(component.type)) {
			continue;
		}

		const fieldName = component.props?.name || component.id || 'unknown';

		schemaShape[fieldName] = generateComponentSchema(component);
	}

	return z.object(schemaShape);
}

/**
 * Generate a Zod schema for an entire journey's form data
 */
export function generateJourneySchema(journey: any): z.ZodObject<any> {
	const schemaShape: Record<string, z.ZodTypeAny> = {};

	// Iterate through all pages
	for (const [pageId, page] of Object.entries(journey.pages || {})) {
		const pageData = page as any;
		const components = pageData.components || [];

		for (const component of components) {
			// Only process input components
			if (!['textInput', 'email', 'tel', 'textarea', 'radios', 'checkboxes', 'select', 'dateInput'].includes(component.type)) {
				continue;
			}

			const fieldName = 'props' in component && component.props && 'name' in component.props
				? component.props.name
				: component.id;

			// Skip if already added (in case of duplicate field names)
			if (schemaShape[fieldName]) {
				continue;
			}

			schemaShape[fieldName] = generateComponentSchema(component);
		}
	}

	return z.object(schemaShape).partial(); // Make all fields optional for partial submissions
}

/**
 * Validate form data against a page schema
 */
export function validatePageData(
	components: any[],
	data: Record<string, any>
): { success: boolean; errors?: Array<{ field: string; message: string }> } {
	const schema = generatePageSchema(components);
	const result = schema.safeParse(data);

	if (result.success) {
		return { success: true };
	}

	// Convert Zod errors to our error format
	const errors = result.error.issues.map((err: any) => ({
		field: err.path.join('.'),
		message: err.message
	}));

	return { success: false, errors };
}

/**
 * Validate form data against a journey schema
 */
export function validateJourneyData(
	journey: any,
	data: Record<string, any>
): { success: boolean; errors?: Array<{ field: string; message: string }> } {
	const schema = generateJourneySchema(journey);
	const result = schema.safeParse(data);

	if (result.success) {
		return { success: true };
	}

	// Convert Zod errors to our error format
	const errors = result.error.issues.map((err: any) => ({
		field: err.path.join('.'),
		message: err.message
	}));

	return { success: false, errors };
}

/**
 * Get validation schema for a specific page in a journey
 */
export function getPageValidationSchema(journey: any, pageId: string): z.ZodObject<any> | null {
	const page = journey.pages?.[pageId];
	if (!page) {
		return null;
	}

	return generatePageSchema(page.components || []);
}

/**
 * Validate specific page data
 */
export function validateSpecificPage(
	journey: any,
	pageId: string,
	data: Record<string, any>
): { success: boolean; errors?: Array<{ field: string; message: string }> } {
	const schema = getPageValidationSchema(journey, pageId);
	
	if (!schema) {
		return { success: false, errors: [{ field: '_page', message: 'Page not found' }] };
	}

	const result = schema.safeParse(data);

	if (result.success) {
		return { success: true };
	}

	// Convert Zod errors to our error format
	const errors = result.error.issues.map((err: any) => ({
		field: err.path.join('.'),
		message: err.message
	}));

	return { success: false, errors };
}

/**
 * Example usage:
 * 
 * // Generate schema from journey JSON
 * const journey = await loadJourney('register-a-plane');
 * const schema = generateJourneySchema(journey);
 * 
 * // Validate POST data
 * const result = schema.safeParse(formData);
 * if (!result.success) {
 *   return json({ errors: result.error.errors }, { status: 400 });
 * }
 * 
 * // Or use the helper function
 * const validation = validateJourneyData(journey, formData);
 * if (!validation.success) {
 *   return json({ errors: validation.errors }, { status: 400 });
 * }
 */
