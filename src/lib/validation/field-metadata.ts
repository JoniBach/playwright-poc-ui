/**
 * Field metadata including validation schemas, examples, and hints.
 * This provides a single source of truth for field configuration.
 */

import { z } from 'zod';
import * as schemas from './field-schemas';
import fieldMetadataJson from '$lib/data/field-metadata.json';

export interface FieldMetadata {
	/** Zod validation schema */
	schema: z.ZodType;
	/** Example value to show in hint text */
	example?: string;
	/** Full hint text (if different from just the example) */
	hint?: string;
	/** Autocomplete attribute value */
	autocomplete?: string;
	/** Input width (GOV.UK width class) */
	width?: string;
}

interface FieldMetadataJson {
	schema: string;
	example?: string;
	hint?: string;
	autocomplete?: string;
	width?: string;
}

/**
 * Map of schema names to actual Zod schemas
 */
const schemaMap: Record<string, z.ZodType> = {
	firstName: schemas.firstName,
	lastName: schemas.lastName,
	dateOfBirth: schemas.dateOfBirth,
	email: schemas.email,
	phone: schemas.phone,
	addressLine1: schemas.addressLine1,
	addressLine2: schemas.addressLine2,
	city: schemas.city,
	postcode: schemas.postcode,
	ukAddressLine1: schemas.ukAddressLine1,
	ukAddressLine2: schemas.ukAddressLine2,
	ukCity: schemas.ukCity,
	ukPostcode: schemas.ukPostcode,
	nhsNumber: schemas.nhsNumber,
	nationalInsurance: schemas.nationalInsurance,
	passportNumber: schemas.passportNumber,
	drivingLicence: schemas.drivingLicence,
	registration: schemas.registration,
	reference: schemas.reference,
	caseNumber: schemas.caseNumber,
	serviceNumber: schemas.serviceNumber,
	householdIncome: schemas.householdIncome,
	accountNumber: schemas.accountNumber,
	sortCode: schemas.sortCode,
	accountName: schemas.accountName,
	courseStartDate: schemas.courseStartDate,
	courseLength: schemas.courseLength,
	nationality: schemas.nationality
};

/**
 * Convert JSON metadata to TypeScript metadata with actual Zod schemas
 */
function buildFieldMetadata(): Record<string, FieldMetadata> {
	const result: Record<string, FieldMetadata> = {};
	
	for (const [fieldId, jsonMeta] of Object.entries(fieldMetadataJson as Record<string, FieldMetadataJson>)) {
		const schema = schemaMap[jsonMeta.schema];
		if (!schema) {
			console.warn(`No schema found for field: ${fieldId} (schema: ${jsonMeta.schema})`);
			continue;
		}
		
		result[fieldId] = {
			schema,
			example: jsonMeta.example,
			hint: jsonMeta.hint,
			autocomplete: jsonMeta.autocomplete,
			width: jsonMeta.width
		};
	}
	
	return result;
}

/**
 * Field metadata loaded from JSON and mapped to Zod schemas
 */
export const fieldMetadata: Record<string, FieldMetadata> = buildFieldMetadata();

/**
 * Get field metadata by field ID.
 */
export function getFieldMetadata(fieldId: string): FieldMetadata | undefined {
	return fieldMetadata[fieldId];
}

/**
 * Get hint text for a field.
 */
export function getFieldHint(fieldId: string): string | undefined {
	return fieldMetadata[fieldId]?.hint;
}

/**
 * Get example value for a field.
 */
export function getFieldExample(fieldId: string): string | undefined {
	return fieldMetadata[fieldId]?.example;
}
