import { z } from 'zod';
import type { JourneyPage } from '$lib/types/journey';

/**
 * Builds a Zod validation schema dynamically from a journey page's components.
 * This ensures validation is always in sync with the actual form fields.
 */
export function buildPageValidationSchema(page: JourneyPage): z.ZodObject<any> {
	const fields: Record<string, z.ZodType> = {};

	page.components.forEach((component) => {
		const fieldId = component.props.id || component.props.name;
		if (!fieldId) return;

		// Check if field is optional (based on label or hint text)
		const label = component.props.label || component.props.legend || '';
		const hint = component.props.hint || '';
		const isOptional =
			label.toLowerCase().includes('optional') || hint.toLowerCase().includes('optional');

		// Build schema based on component type
		switch (component.type) {
			case 'textInput':
			case 'textarea':
				if (component.props.type === 'email') {
					// Email validation
					fields[fieldId] = isOptional
						? z.string().email({ message: 'Enter a valid email address' }).optional().or(z.literal(''))
						: z.string().min(1, { message: 'Enter your email address' }).email({
								message: 'Enter a valid email address'
							});
				} else if (component.props.type === 'tel') {
					// Phone number validation
					fields[fieldId] = isOptional
						? z.string().optional().or(z.literal(''))
						: z.string().min(1, { message: `Enter ${label.toLowerCase() || 'your phone number'}` });
				} else {
					// Generic text input
					const fieldName = label.toLowerCase() || 'this field';
					fields[fieldId] = isOptional
						? z.string().optional().or(z.literal(''))
						: z.string().min(1, { message: `Enter ${fieldName}` });
				}
				break;

			case 'dateInput':
				// Date input requires day, month, and year
				fields[fieldId] = z.object({
					day: z.string().min(1, { message: 'Enter a day' }),
					month: z.string().min(1, { message: 'Enter a month' }),
					year: z.string().min(1, { message: 'Enter a year' })
				});
				break;

			case 'select':
			case 'radios':
				// Select and radio buttons require a selection
				const selectLabel = component.props.legend || component.props.label || 'an option';
				fields[fieldId] = isOptional
					? z.string().optional().or(z.literal(''))
					: z.string().min(1, { message: `Select ${selectLabel.toLowerCase()}` });
				break;

			case 'checkboxes':
				// Checkboxes can be optional arrays
				fields[fieldId] = z.array(z.string()).optional();
				break;

			default:
				// For unknown component types, make them optional
				fields[fieldId] = z.any().optional();
				break;
		}
	});

	return z.object(fields);
}

/**
 * Validates data against a Zod schema and returns errors in the format expected by the journey store.
 */
export function validateWithSchema(
	schema: z.ZodObject<any>,
	data: Record<string, any>
): Record<string, string> | null {
	const result = schema.safeParse(data);

	if (!result.success) {
		const errors: Record<string, string> = {};

		result.error.issues.forEach((issue) => {
			// Handle nested paths (e.g., dateOfBirth.day)
			const path = issue.path.join('.');
			errors[path] = issue.message;
		});

		return errors;
	}

	return null;
}
