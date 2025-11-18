import { z } from 'zod';

/**
 * Schema for validation rules that can be applied to journey pages.
 * These define which fields are required and how they should be validated.
 */

// Individual field validation rule
export const FieldValidationSchema = z.object({
	fieldId: z.string(),
	required: z.boolean().default(true),
	schema: z.string(), // Reference to field schema in field-schemas.ts
	customMessage: z.string().optional(),
	dependsOn: z.array(z.object({
		fieldId: z.string(),
		value: z.string(),
		condition: z.enum(['equals', 'not_equals', 'contains', 'not_contains']).default('equals')
	})).optional()
});

// Page validation rule (collection of field validations)
export const PageValidationSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	fields: z.array(FieldValidationSchema),
	customValidation: z.object({
		function: z.string(), // Name of custom validation function
		message: z.string()
	}).optional()
});

// Complete validation rules configuration
export const ValidationRulesSchema = z.object({
	rules: z.record(z.string(), PageValidationSchema) // rule_id -> validation_rule
});

// Conditional routing schema
export const ConditionalRouteSchema = z.object({
	condition: z.object({
		fieldId: z.string(),
		operator: z.enum(['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than']),
		value: z.union([z.string(), z.number(), z.boolean()])
	}),
	nextPage: z.string(),
	priority: z.number().default(0) // Higher priority routes are checked first
});

export const PageRoutingSchema = z.object({
	pageId: z.string(),
	defaultNextPage: z.string().optional(),
	conditionalRoutes: z.array(ConditionalRouteSchema).optional()
});

// Export inferred types
export type FieldValidation = z.infer<typeof FieldValidationSchema>;
export type PageValidation = z.infer<typeof PageValidationSchema>;
export type ValidationRules = z.infer<typeof ValidationRulesSchema>;
export type ConditionalRoute = z.infer<typeof ConditionalRouteSchema>;
export type PageRouting = z.infer<typeof PageRoutingSchema>;

/**
 * Validate a validation rules configuration
 */
export function validateValidationRules(rules: unknown): ValidationRules {
	const result = ValidationRulesSchema.safeParse(rules);
	if (!result.success) {
		throw new Error(`Invalid validation rules: ${result.error.message}`);
	}
	return result.data;
}

/**
 * Get validation rule by ID
 */
export function getValidationRule(rules: ValidationRules, ruleId: string): PageValidation | undefined {
	return rules.rules[ruleId];
}
