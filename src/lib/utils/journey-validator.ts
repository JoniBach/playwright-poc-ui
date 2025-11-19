import { JourneySchema } from '../schemas/journey.schema.js';
import { JourneyIndexSchema } from '../schemas/journey-index.schema.js';
import { ComponentSchema, validateComponent } from '../schemas/component.schema.js';
import { fieldSchemas } from '../validation/field-schemas.js';
import type { JourneyJson } from '../schemas/journey.schema.js';
import type { JourneyIndex } from '../schemas/journey-index.schema.js';

/**
 * Comprehensive journey validation utility for startup validation and AI readiness.
 * Validates journey configurations against strict schemas and provides detailed error reporting.
 */

export interface ValidationError {
	type: 'schema' | 'reference' | 'logic';
	severity: 'error' | 'warning';
	journeyId?: string;
	pageId?: string;
	componentIndex?: number;
	message: string;
	suggestion?: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
	warnings: ValidationError[];
	summary: {
		totalJourneys: number;
		validJourneys: number;
		totalPages: number;
		totalComponents: number;
		componentTypes: Record<string, number>;
	};
}

/**
 * Validate a single journey configuration
 */
export function validateJourney(journey: unknown, journeyId?: string): ValidationError[] {
	const errors: ValidationError[] = [];
	
	// Schema validation
	const schemaResult = JourneySchema.safeParse(journey);
	if (!schemaResult.success) {
		errors.push({
			type: 'schema',
			severity: 'error',
			journeyId,
			message: `Journey schema validation failed: ${schemaResult.error.message}`,
			suggestion: 'Check the journey structure matches the expected schema'
		});
		return errors; // Can't continue without valid schema
	}
	
	const validJourney = schemaResult.data;
	
	// Validate each page
	Object.entries(validJourney.pages).forEach(([pageId, page]) => {
		// Validate page components
		page.components.forEach((component, index) => {
			try {
				validateComponent(component);
			} catch (error) {
				errors.push({
					type: 'schema',
					severity: 'error',
					journeyId,
					pageId,
					componentIndex: index,
					message: `Component validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
					suggestion: 'Check component props match the expected schema for this component type'
				});
			}
			
			// Check for duplicate title in heading components
			if (component.type === 'heading' && page.title) {
				const props = component.props as any;
				const headingText = props?.text || props?.content;
				if (headingText && headingText === page.title) {
					errors.push({
						type: 'logic',
						severity: 'error',
						journeyId,
						pageId,
						componentIndex: index,
						message: `Heading component duplicates the page title "${page.title}". The page title is automatically rendered as an <h1> by GovUKPage, so this heading component creates duplicate <h1> elements.`,
						suggestion: 'Remove this heading component or change its text to be different from the page title'
					});
				}
			}
		});
		
		// Validate page references
		if (page.nextPage && !validJourney.pages[page.nextPage]) {
			errors.push({
				type: 'reference',
				severity: 'error',
				journeyId,
				pageId,
				message: `Next page reference "${page.nextPage}" does not exist`,
				suggestion: `Create page "${page.nextPage}" or update the reference`
			});
		}
		
		if (page.previousPage && !validJourney.pages[page.previousPage]) {
			errors.push({
				type: 'reference',
				severity: 'error',
				journeyId,
				pageId,
				message: `Previous page reference "${page.previousPage}" does not exist`,
				suggestion: `Create page "${page.previousPage}" or update the reference`
			});
		}
		
		// Validate field schema references
		page.components.forEach((component, index) => {
			if ('props' in component && component.props && typeof component.props === 'object') {
				const props = component.props as any;
				if (props.name && !fieldSchemas[props.name]) {
					errors.push({
						type: 'reference',
						severity: 'warning',
						journeyId,
						pageId,
						componentIndex: index,
						message: `Field "${props.name}" has no validation schema defined`,
						suggestion: `Add a validation schema for "${props.name}" in field-schemas.ts`
					});
				}
			}
		});
	});
	
	// Validate start page exists
	if (!validJourney.pages[validJourney.startPage]) {
		errors.push({
			type: 'reference',
			severity: 'error',
			journeyId,
			message: `Start page "${validJourney.startPage}" does not exist`,
			suggestion: `Create page "${validJourney.startPage}" or update the startPage reference`
		});
	}
	
	// Validate check answers page exists (if specified)
	if (validJourney.checkYourAnswersPage && !validJourney.pages[validJourney.checkYourAnswersPage]) {
		errors.push({
			type: 'reference',
			severity: 'error',
			journeyId,
			message: `Check answers page "${validJourney.checkYourAnswersPage}" does not exist`,
			suggestion: `Create page "${validJourney.checkYourAnswersPage}" or remove the checkYourAnswersPage reference`
		});
	}
	
	// Validate completion page exists (if specified)
	if (validJourney.completionPage && !validJourney.pages[validJourney.completionPage]) {
		errors.push({
			type: 'reference',
			severity: 'error',
			journeyId,
			message: `Completion page "${validJourney.completionPage}" does not exist`,
			suggestion: `Create page "${validJourney.completionPage}" or remove the completionPage reference`
		});
	}
	
	return errors;
}

/**
 * Validate journey index configuration
 */
export function validateJourneyIndex(index: unknown): ValidationError[] {
	const errors: ValidationError[] = [];
	
	const schemaResult = JourneyIndexSchema.safeParse(index);
	if (!schemaResult.success) {
		errors.push({
			type: 'schema',
			severity: 'error',
			message: `Journey index schema validation failed: ${schemaResult.error.message}`,
			suggestion: 'Check the journey index structure matches the expected schema'
		});
	}
	
	return errors;
}

/**
 * Validate all journeys in a collection
 */
export function validateAllJourneys(
	journeys: Record<string, unknown>,
	journeyIndex?: unknown
): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];
	const componentTypes: Record<string, number> = {};
	let totalPages = 0;
	let totalComponents = 0;
	let validJourneys = 0;
	
	// Validate journey index if provided
	if (journeyIndex) {
		const indexErrors = validateJourneyIndex(journeyIndex);
		errors.push(...indexErrors.filter(e => e.severity === 'error'));
		warnings.push(...indexErrors.filter(e => e.severity === 'warning'));
	}
	
	// Validate each journey
	Object.entries(journeys).forEach(([journeyId, journey]) => {
		const journeyErrors = validateJourney(journey, journeyId);
		const journeyErrorsOnly = journeyErrors.filter(e => e.severity === 'error');
		const journeyWarningsOnly = journeyErrors.filter(e => e.severity === 'warning');
		
		errors.push(...journeyErrorsOnly);
		warnings.push(...journeyWarningsOnly);
		
		if (journeyErrorsOnly.length === 0) {
			validJourneys++;
		}
		
		// Count components and pages if journey is valid
		const schemaResult = JourneySchema.safeParse(journey);
		if (schemaResult.success) {
			const validJourney = schemaResult.data;
			totalPages += Object.keys(validJourney.pages).length;
			
			Object.values(validJourney.pages).forEach(page => {
				totalComponents += page.components.length;
				page.components.forEach(component => {
					componentTypes[component.type] = (componentTypes[component.type] || 0) + 1;
				});
			});
		}
	});
	
	return {
		isValid: errors.length === 0,
		errors,
		warnings,
		summary: {
			totalJourneys: Object.keys(journeys).length,
			validJourneys,
			totalPages,
			totalComponents,
			componentTypes
		}
	};
}

/**
 * Format validation results for console output
 */
export function formatValidationResults(result: ValidationResult): string {
	const lines: string[] = [];
	
	lines.push('🔍 Journey Validation Results');
	lines.push('═'.repeat(50));
	
	// Summary
	lines.push(`📊 Summary:`);
	lines.push(`   Journeys: ${result.summary.validJourneys}/${result.summary.totalJourneys} valid`);
	lines.push(`   Pages: ${result.summary.totalPages}`);
	lines.push(`   Components: ${result.summary.totalComponents}`);
	
	if (Object.keys(result.summary.componentTypes).length > 0) {
		lines.push(`   Component Types:`);
		Object.entries(result.summary.componentTypes)
			.sort(([,a], [,b]) => b - a)
			.forEach(([type, count]) => {
				lines.push(`     ${type}: ${count}`);
			});
	}
	
	// Errors
	if (result.errors.length > 0) {
		lines.push('');
		lines.push(`❌ Errors (${result.errors.length}):`);
		result.errors.forEach((error, index) => {
			lines.push(`   ${index + 1}. ${error.message}`);
			if (error.journeyId) lines.push(`      Journey: ${error.journeyId}`);
			if (error.pageId) lines.push(`      Page: ${error.pageId}`);
			if (error.componentIndex !== undefined) lines.push(`      Component: ${error.componentIndex}`);
			if (error.suggestion) lines.push(`      💡 ${error.suggestion}`);
		});
	}
	
	// Warnings
	if (result.warnings.length > 0) {
		lines.push('');
		lines.push(`⚠️  Warnings (${result.warnings.length}):`);
		result.warnings.forEach((warning, index) => {
			lines.push(`   ${index + 1}. ${warning.message}`);
			if (warning.journeyId) lines.push(`      Journey: ${warning.journeyId}`);
			if (warning.pageId) lines.push(`      Page: ${warning.pageId}`);
			if (warning.componentIndex !== undefined) lines.push(`      Component: ${warning.componentIndex}`);
			if (warning.suggestion) lines.push(`      💡 ${warning.suggestion}`);
		});
	}
	
	if (result.isValid) {
		lines.push('');
		lines.push('✅ All journeys are valid!');
	}
	
	return lines.join('\n');
}

/**
 * Load and validate all journey files from the static directory
 */
export async function validateJourneyFiles(journeysPath: string): Promise<ValidationResult> {
	try {
		// This would be implemented to load files from the filesystem
		// For now, return a placeholder result
		return {
			isValid: true,
			errors: [],
			warnings: [],
			summary: {
				totalJourneys: 0,
				validJourneys: 0,
				totalPages: 0,
				totalComponents: 0,
				componentTypes: {}
			}
		};
	} catch (error) {
		return {
			isValid: false,
			errors: [{
				type: 'schema',
				severity: 'error',
				message: `Failed to load journey files: ${error instanceof Error ? error.message : 'Unknown error'}`
			}],
			warnings: [],
			summary: {
				totalJourneys: 0,
				validJourneys: 0,
				totalPages: 0,
				totalComponents: 0,
				componentTypes: {}
			}
		};
	}
}
