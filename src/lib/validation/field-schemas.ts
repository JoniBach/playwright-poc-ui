import { z } from 'zod';

/**
 * Common reusable Zod schemas for standard form fields.
 * These can be referenced by field ID in journey configurations.
 */

// Personal Information
export const firstName = z.preprocess(
	(val) => val || '',
	z.string().min(1, { message: 'Enter your first name' })
);

export const lastName = z.preprocess(
	(val) => val || '',
	z.string().min(1, { message: 'Enter your last name' })
);

export const dateOfBirth = z.object({
	day: z.string().min(1, { message: 'Enter a day' }).regex(/^\d{1,2}$/, { message: 'Day must be a number' }),
	month: z.string().min(1, { message: 'Enter a month' }).regex(/^\d{1,2}$/, { message: 'Month must be a number' }),
	year: z.string().min(1, { message: 'Enter a year' }).regex(/^\d{4}$/, { message: 'Year must be 4 digits' })
});

// Contact Information
export const email = z.preprocess(
	(val) => val || '',
	z
		.string()
		.min(1, { message: 'Enter your email address' })
		.email({ message: 'Enter a valid email address' })
);

export const phone = z.preprocess(
	(val) => val || '',
	z
		.string()
		.min(1, { message: 'Enter your phone number' })
		.regex(/^[0-9\s\-\+\(\)]+$/, { message: 'Enter a valid phone number' })
);

// Address Fields
export const addressLine1 = z.preprocess(
	(val) => val || '',
	z.string().min(1, { message: 'Enter address line 1' })
);

export const addressLine2 = z.preprocess((val) => val || '', z.string().optional().or(z.literal('')));

export const city = z.preprocess(
	(val) => val || '',
	z.string().min(1, { message: 'Enter a town or city' })
);

export const postcode = z.preprocess(
	(val) => val || '',
	z
		.string()
		.min(1, { message: 'Enter a postcode' })
		.regex(/^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i, {
			message: 'Enter a valid UK postcode, like SW1A 1AA'
		})
);

// UK-specific address fields (for visa applications, etc.)
export const ukAddressLine1 = addressLine1;
export const ukAddressLine2 = addressLine2;
export const ukCity = city;
export const ukPostcode = postcode;

// Government IDs
export const nhsNumber = z
	.string()
	.min(1, { message: 'Enter your NHS number' })
	.regex(/^\d{3}\s?\d{3}\s?\d{4}$/, {
		message: 'Enter a valid NHS number, like 485 777 3456'
	});

export const nationalInsurance = z
	.string()
	.min(1, { message: 'Enter your National Insurance number' })
	.regex(/^[A-Z]{2}\d{6}[A-Z]$/i, {
		message: 'Enter a valid National Insurance number, like QQ123456C'
	});

export const passportNumber = z
	.string()
	.min(1, { message: 'Enter your passport number' })
	.regex(/^[A-Z0-9]{6,9}$/i, {
		message: 'Enter a valid passport number'
	});

export const drivingLicence = z
	.string()
	.min(1, { message: 'Enter your driving licence number' })
	.regex(/^[A-Z0-9]{16}$/i, {
		message: 'Enter a valid UK driving licence number (16 characters)'
	});

// Vehicle Information
export const registration = z
	.string()
	.min(1, { message: 'Enter a vehicle registration number' })
	.regex(/^[A-Z]{2}\d{2}\s?[A-Z]{3}$|^[A-Z]\d{1,3}\s?[A-Z]{3}$/i, {
		message: 'Enter a valid registration number, like CU57ABC'
	});

// Reference Numbers
export const reference = z
	.string()
	.min(1, { message: 'Enter your application reference number' })
	.regex(/^[A-Z]{3}\d{6}$/i, {
		message: 'Enter a valid reference number, like ABC123456'
	});

export const caseNumber = z.string().min(1, { message: 'Enter your case number' });

export const serviceNumber = z.string().min(1, { message: 'Enter your service number' });

// Other Common Fields
export const nationality = z.string().min(1, { message: 'Enter your nationality' });

// Optional versions of common fields
export const firstNameOptional = firstName.optional().or(z.literal(''));
export const lastNameOptional = lastName.optional().or(z.literal(''));
export const emailOptional = email.optional().or(z.literal(''));
export const phoneOptional = phone.optional().or(z.literal(''));
export const nhsNumberOptional = nhsNumber.optional().or(z.literal(''));

/**
 * Map of field IDs to their Zod schemas.
 * This allows journey configs to reference schemas by field ID.
 */
export const fieldSchemas: Record<string, z.ZodType> = {
	// Personal Information
	firstName,
	lastName,
	dateOfBirth,
	
	// Contact Information
	email,
	phone,
	
	// Address Fields
	addressLine1,
	addressLine2,
	city,
	postcode,
	ukAddressLine1,
	ukAddressLine2,
	ukCity,
	ukPostcode,
	
	// Government IDs
	nhsNumber,
	nationalInsurance,
	passportNumber,
	drivingLicence,
	
	// Vehicle Information
	registration,
	
	// Reference Numbers
	reference,
	caseNumber,
	serviceNumber,
	
	// Other
	nationality,
	
	// Optional versions
	firstNameOptional,
	lastNameOptional,
	emailOptional,
	phoneOptional,
	nhsNumberOptional
};

/**
 * Get a field schema by field ID.
 * Returns undefined if no schema is defined for the field.
 */
export function getFieldSchema(fieldId: string): z.ZodType | undefined {
	return fieldSchemas[fieldId];
}
