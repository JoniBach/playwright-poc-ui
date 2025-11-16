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
	},

	// Driving licence personal details validation
	'driving-licence-personal': (data) => {
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

	// MOT search validation
	'mot-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.registration) {
			errors.registration = 'Enter a vehicle registration number';
		} else if (!/^[A-Z]{2}\d{2}\s?[A-Z]{3}$/i.test(data.registration) && !/^[A-Z]\d{1,3}\s?[A-Z]{3}$/i.test(data.registration)) {
			errors.registration = 'Enter a valid registration number, like CU57ABC';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// NHS personal details validation
	'nhs-personal-details': (data) => {
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

	// NHS records search validation
	'nhs-records-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.nhsNumber) {
			errors.nhsNumber = 'Enter your NHS number';
		} else if (!/^\d{3}\s?\d{3}\s?\d{4}$/.test(data.nhsNumber)) {
			errors.nhsNumber = 'Enter a valid NHS number, like 485 777 3456';
		}
		if (!data.dateOfBirth) {
			errors.dateOfBirth = 'Enter your date of birth';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// DWP personal details validation
	'dwp-personal-details': (data) => {
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
		if (!data.nationalInsurance) {
			errors.nationalInsurance = 'Enter your National Insurance number';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Bank details validation
	'bank-details': (data) => {
		const errors: Record<string, string> = {};

		if (!data.accountName) {
			errors.accountName = 'Enter the name on the account';
		}
		if (!data.sortCode) {
			errors.sortCode = 'Enter a sort code';
		} else if (!/^\d{6}$/.test(data.sortCode.replace(/[\s-]/g, ''))) {
			errors.sortCode = 'Sort code must be 6 digits';
		}
		if (!data.accountNumber) {
			errors.accountNumber = 'Enter an account number';
		} else if (!/^\d{6,8}$/.test(data.accountNumber)) {
			errors.accountNumber = 'Account number must be between 6 and 8 digits';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Pension forecast search validation
	'pension-forecast-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.nationalInsurance) {
			errors.nationalInsurance = 'Enter your National Insurance number';
		}
		if (!data.dateOfBirth) {
			errors.dateOfBirth = 'Enter your date of birth';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// HMRC taxpayer details validation
	'hmrc-taxpayer-details': (data) => {
		const errors: Record<string, string> = {};

		if (!data.utr) {
			errors.utr = 'Enter your Unique Taxpayer Reference';
		} else if (!/^\d{10}$/.test(data.utr)) {
			errors.utr = 'UTR must be 10 digits';
		}
		if (!data.nationalInsurance) {
			errors.nationalInsurance = 'Enter your National Insurance number';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Tax summary search validation
	'tax-summary-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.utr) {
			errors.utr = 'Enter your Unique Taxpayer Reference';
		} else if (!/^\d{10}$/.test(data.utr)) {
			errors.utr = 'UTR must be 10 digits';
		}
		if (!data.nationalInsurance) {
			errors.nationalInsurance = 'Enter your National Insurance number';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Student finance personal details validation
	'student-finance-personal': (data) => {
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
		if (!data.nationalInsurance) {
			errors.nationalInsurance = 'Enter your National Insurance number';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Student loan search validation
	'student-loan-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.customerReference) {
			errors.customerReference = 'Enter your customer reference number';
		}
		if (!data.dateOfBirth) {
			errors.dateOfBirth = 'Enter your date of birth';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Visa personal details validation
	'visa-personal-details': (data) => {
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
		if (!data.nationality) {
			errors.nationality = 'Enter your nationality';
		}
		if (!data.passportNumber) {
			errors.passportNumber = 'Enter your passport number';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Visa status search validation
	'visa-status-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.reference) {
			errors.reference = 'Enter your application reference number';
		}
		if (!data.dateOfBirth) {
			errors.dateOfBirth = 'Enter your date of birth';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Probate deceased details validation
	'probate-deceased': (data) => {
		const errors: Record<string, string> = {};

		if (!data.deceasedFirstName) {
			errors.deceasedFirstName = 'Enter the first name';
		}
		if (!data.deceasedLastName) {
			errors.deceasedLastName = 'Enter the last name';
		}
		if (!data.dateOfDeath) {
			errors.dateOfDeath = 'Enter the date of death';
		}
		if (!data.lastAddress) {
			errors.lastAddress = 'Enter the last known address';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Probate search validation
	'probate-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.firstName) {
			errors.firstName = 'Enter a first name';
		}
		if (!data.lastName) {
			errors.lastName = 'Enter a last name';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Armed forces personal details validation
	'armed-forces-personal': (data) => {
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
		if (!data.nationalInsurance) {
			errors.nationalInsurance = 'Enter your National Insurance number';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Service records search validation
	'service-records-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.serviceNumber) {
			errors.serviceNumber = 'Enter your service number';
		}
		if (!data.dateOfBirth) {
			errors.dateOfBirth = 'Enter your date of birth';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Money claim claimant details validation
	'money-claim-claimant': (data) => {
		const errors: Record<string, string> = {};

		if (!data.claimantName) {
			errors.claimantName = 'Enter your full name';
		}
		if (!data.claimantAddress) {
			errors.claimantAddress = 'Enter your address';
		}
		if (!data.claimantEmail) {
			errors.claimantEmail = 'Enter your email address';
		}
		if (!data.claimantPhone) {
			errors.claimantPhone = 'Enter your phone number';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Money claim defendant details validation
	'money-claim-defendant': (data) => {
		const errors: Record<string, string> = {};

		if (!data.defendantName) {
			errors.defendantName = "Enter the defendant's name";
		}
		if (!data.defendantAddress) {
			errors.defendantAddress = "Enter the defendant's address";
		}

		return Object.keys(errors).length > 0 ? errors : null;
	},

	// Court case search validation
	'court-case-search': (data) => {
		const errors: Record<string, string> = {};

		if (!data.caseNumber) {
			errors.caseNumber = 'Enter your case number';
		}
		if (!data.postcode) {
			errors.postcode = 'Enter your postcode';
		}

		return Object.keys(errors).length > 0 ? errors : null;
	}
};

// Helper to get validation function by ID
export function getValidationRule(ruleId?: string): ValidationRule | undefined {
	if (!ruleId) return undefined;
	return validationRules[ruleId];
}
