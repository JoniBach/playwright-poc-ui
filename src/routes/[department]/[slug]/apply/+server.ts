import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadJourneyServer } from '$lib/loaders/journey-loader.server';
import { validateSpecificPage, validateAllJourneyData } from '$lib/validation/journey-data-validator';

/**
 * Dynamic server endpoint for journey form submissions
 * Handles POST requests for all journey pages
 * 
 * Route: /[department]/[slug]/apply
 * Example: /civil-aviation-authority/register-a-plane/apply
 */
export const POST: RequestHandler = async ({ params, request, url }) => {
	const { department, slug } = params;
	const journeyId = slug;

	try {
		// Get the journey configuration (server-side - reads from filesystem)
		const journey = loadJourneyServer(journeyId);
		
		if (!journey) {
			return json(
				{ 
					success: false, 
					error: 'Journey not found',
					journeyId 
				},
				{ status: 404 }
			);
		}

		// Parse the form data
		const formData = await request.formData();
		const data: Record<string, any> = {};
		
		for (const [key, value] of formData.entries()) {
			data[key] = value;
		}

		// Get the current page from query params or form data
		const currentPage = url.searchParams.get('page') || data._currentPage || 'unknown';

		// Log the submission (useful for debugging)
		console.log(`[Journey Submission] ${journeyId} - Page: ${currentPage}`);
		console.log('Form Data:', data);

		// Validate the submission using dynamic Zod schema
		// For check-your-answers, validate ALL collected data from all pages
		// For other pages, validate only the current page
		const validation = currentPage === 'check-your-answers' 
			? validateAllJourneyData(journey, data)
			: validateSpecificPage(journey, currentPage, data);
		const validationErrors = validation.success ? [] : (validation.errors || []);
		
		if (validationErrors.length > 0) {
			// Convert error array to object format for API compatibility
			// From: [{ field: 'email-address', message: '...' }]
			// To: { 'email-address': '...' }
			const errorsObject: Record<string, string> = {};
			for (const error of validationErrors) {
				errorsObject[error.field] = error.message;
			}
			
			return json(
				{
					success: false,
					errors: errorsObject,
					page: currentPage
				},
				{ status: 400 }
			);
		}

		// Determine the next page based on journey configuration
		const nextPage = determineNextPage(journey, currentPage, data);

		// Check if this is the final submission (completion page)
		const isComplete = currentPage === journey.checkYourAnswersPage || 
		                   nextPage === journey.completionPage;

		if (isComplete) {
			// Generate a reference number for completed journeys
			const referenceNumber = generateReferenceNumber();
			
			return json(
				{
					success: true,
					complete: true,
					referenceNumber,
					message: 'Application submitted successfully',
					data: data,
					nextPage: journey.completionPage
				},
				{ status: 200 }
			);
		}

		// Return success response with next page
		return json(
			{
				success: true,
				complete: false,
				nextPage,
				currentPage,
				data: data
			},
			{ status: 200 }
		);

	} catch (error) {
		console.error('[Journey Submission Error]', error);
		
		return json(
			{
				success: false,
				error: 'Internal server error',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};

/**
 * Validate form data against journey configuration
 */
function validateFormData(
	data: Record<string, any>,
	journey: any,
	currentPage: string
): Array<{ field: string; message: string }> {
	const errors: Array<{ field: string; message: string }> = [];

	// Get the page configuration
	const pageConfig = journey.pages?.[currentPage];
	if (!pageConfig) {
		return errors;
	}

	// Validate each component on the page
	for (const component of pageConfig.components || []) {
		// Skip non-input components
		if (!['textInput', 'email', 'tel', 'textarea', 'radios', 'checkboxes', 'select', 'dateInput'].includes(component.type)) {
			continue;
		}

		const fieldName = component.props?.name || component.id;
		const fieldValue = data[fieldName];

		// Check if field has validation rules
		if (component.validation) {
			// Required field validation
			if (component.validation.required && (!fieldValue || fieldValue.trim() === '')) {
				errors.push({
					field: fieldName,
					message: component.validation.errorMessages?.required || `${component.props?.label || fieldName} is required`
				});
			}

			// Pattern validation (if value exists)
			if (fieldValue && component.validation.pattern) {
				const isValid = validatePattern(fieldValue, component.validation.pattern);
				if (!isValid) {
					errors.push({
						field: fieldName,
						message: component.validation.errorMessages?.pattern || `Invalid ${component.validation.pattern} format`
					});
				}
			}

			// Length validation
			if (fieldValue) {
				if (component.validation.minLength && fieldValue.length < component.validation.minLength) {
					errors.push({
						field: fieldName,
						message: component.validation.errorMessages?.minLength || 
						         `Must be at least ${component.validation.minLength} characters`
					});
				}

				if (component.validation.maxLength && fieldValue.length > component.validation.maxLength) {
					errors.push({
						field: fieldName,
						message: component.validation.errorMessages?.maxLength || 
						         `Must be ${component.validation.maxLength} characters or less`
					});
				}
			}
		}
	}

	return errors;
}

/**
 * Validate field value against pattern
 */
function validatePattern(value: string, pattern: string): boolean {
	const patterns: Record<string, RegExp> = {
		email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		phone: /^[\d\s\+\-\(\)]+$/,
		postcode: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
		url: /^https?:\/\/.+/,
		'ni-number': /^[A-Z]{2}\d{6}[A-Z]$/i
	};

	const regex = patterns[pattern];
	return regex ? regex.test(value) : true;
}

/**
 * Determine the next page based on journey configuration and form data
 */
function determineNextPage(
	journey: any,
	currentPage: string,
	data: Record<string, any>
): string {
	const pageConfig = journey.pages?.[currentPage];
	
	if (!pageConfig) {
		return journey.completionPage || 'confirmation';
	}

	// Check for conditional routing
	if (pageConfig.conditionalRouting) {
		const routing = pageConfig.conditionalRouting;
		
		// Check each condition
		for (const condition of routing.conditions || []) {
			const fieldValue = data[condition.when.field];
			const conditionMet = evaluateCondition(
				fieldValue,
				condition.when.operator,
				condition.when.value
			);
			
			if (conditionMet) {
				return condition.goto;
			}
		}
		
		// Return default if no conditions met
		return routing.default || pageConfig.nextPage;
	}

	// Return simple next page
	return pageConfig.nextPage || journey.completionPage || 'confirmation';
}

/**
 * Evaluate a conditional routing condition
 */
function evaluateCondition(
	fieldValue: any,
	operator: string,
	expectedValue: any
): boolean {
	switch (operator) {
		case 'equals':
			return fieldValue === expectedValue;
		case 'notEquals':
			return fieldValue !== expectedValue;
		case 'contains':
			return String(fieldValue).includes(String(expectedValue));
		case 'greaterThan':
			return Number(fieldValue) > Number(expectedValue);
		case 'lessThan':
			return Number(fieldValue) < Number(expectedValue);
		case 'isEmpty':
			return !fieldValue || fieldValue.trim() === '';
		case 'isNotEmpty':
			return fieldValue && fieldValue.trim() !== '';
		default:
			return false;
	}
}

/**
 * Generate a unique reference number for completed applications
 */
function generateReferenceNumber(): string {
	const prefix = 'APP';
	const timestamp = Date.now().toString(36).toUpperCase();
	const random = Math.random().toString(36).substring(2, 7).toUpperCase();
	return `${prefix}-${timestamp}-${random}`;
}
