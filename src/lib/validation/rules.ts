// Validation rule functions that can be referenced by ID from JSON
export type ValidationRule = (data: Record<string, any>) => Record<string, string> | null;

export const validationRules: Record<string, ValidationRule> = {
	// Personal details validation
	'personal-details': (data) => {
		const errors: Record<string, string> = {};

		if (!data.firstName) {
			errors.firstName = 'Enter your first name';
		}
		if (!data.lastName) {
			errors.lastName = 'Enter your last name';
		}
		if (!data.dateOfBirth) {
			errors.dateOfBirth = 'Enter your date of birth';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Contact details validation
	'contact-details': (data) => {
		const errors: Record<string, string> = {};

		if (!data.email) {
			errors.email = 'Enter your email address';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			errors.email = 'Enter a valid email address';
		}

		if (!data.contactPreference) {
			errors.contactPreference = 'Select how you would prefer to be contacted';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Address validation
	'address': (data) => {
		const errors: Record<string, string> = {};

		if (!data.addressLine1) {
			errors.addressLine1 = 'Enter address line 1';
		}
		if (!data.city) {
			errors.city = 'Enter a town or city';
		}
		if (!data.postcode) {
			errors.postcode = 'Enter a postcode';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Generic required field validation
	'required': (data) => {
		const errors: Record<string, string> = {};
		
		for (const [key, value] of Object.entries(data)) {
			if (!value || (typeof value === 'string' && value.trim() === '')) {
				errors[key] = `${key} is required`;
			}
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Passport status search validation
	'passport-status-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.reference) {
			errors.reference = 'Enter your application reference number';
		} else if (!/^[A-Z]{3}\d{6}$/i.test(data.reference)) {
			errors.reference = 'Enter a valid reference number, like ABC123456';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	}
};

// Helper to get validation function by ID
export function getValidationRule(ruleId?: string): ValidationRule | undefined {
	if (!ruleId) return undefined;
	return validationRules[ruleId];
}
