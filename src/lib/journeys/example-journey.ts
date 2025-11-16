import type { Journey } from '$lib/types/journey';

export const exampleJourney: Journey = {
	id: 'apply-for-passport',
	name: 'Apply for a passport',
	startPage: 'start',
	checkYourAnswersPage: 'check-answers',
	completionPage: 'confirmation',
	pages: {
		start: {
			id: 'start',
			title: 'Apply for a passport',
			components: [
				{
					type: 'paragraph',
					props: {
						text: 'Use this service to apply for, renew, replace or update your passport and pay online.',
						lead: true
					}
				},
				{
					type: 'heading',
					props: {
						text: 'What you need',
						level: 'm',
						tag: 'h2'
					}
				},
				{
					type: 'paragraph',
					props: {
						text: 'To apply online you will need:'
					}
				},
				{
					type: 'insetText',
					props: {
						text: 'This service takes around 10 minutes to complete.'
					}
				}
			],
			nextPage: 'personal-details'
		},
		'personal-details': {
			id: 'personal-details',
			title: 'Your personal details',
			components: [
				{
					type: 'textInput',
					props: {
						id: 'firstName',
						name: 'firstName',
						label: 'First name',
						autocomplete: 'given-name'
					}
				},
				{
					type: 'textInput',
					props: {
						id: 'lastName',
						name: 'lastName',
						label: 'Last name',
						autocomplete: 'family-name'
					}
				},
				{
					type: 'textInput',
					props: {
						id: 'dateOfBirth',
						name: 'dateOfBirth',
						label: 'Date of birth',
						hint: 'For example, 31 3 1980',
						width: '10'
					}
				}
			],
			nextPage: 'contact-details',
			previousPage: 'start',
			validation: (data) => {
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
			}
		},
		'contact-details': {
			id: 'contact-details',
			title: 'Your contact details',
			components: [
				{
					type: 'textInput',
					props: {
						id: 'email',
						name: 'email',
						label: 'Email address',
						type: 'email',
						autocomplete: 'email',
						hint: 'We will use this to send you updates about your application'
					}
				},
				{
					type: 'textInput',
					props: {
						id: 'phone',
						name: 'phone',
						label: 'Phone number',
						type: 'tel',
						autocomplete: 'tel',
						width: '20'
					}
				},
				{
					type: 'radios',
					props: {
						id: 'contactPreference',
						name: 'contactPreference',
						legend: 'How would you prefer to be contacted?',
						options: [
							{ value: 'email', text: 'Email' },
							{ value: 'phone', text: 'Phone' },
							{ value: 'text', text: 'Text message' }
						]
					}
				}
			],
			nextPage: 'address',
			previousPage: 'personal-details',
			validation: (data) => {
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
			}
		},
		address: {
			id: 'address',
			title: 'Your address',
			components: [
				{
					type: 'textInput',
					props: {
						id: 'addressLine1',
						name: 'addressLine1',
						label: 'Address line 1',
						autocomplete: 'address-line1'
					}
				},
				{
					type: 'textInput',
					props: {
						id: 'addressLine2',
						name: 'addressLine2',
						label: 'Address line 2 (optional)',
						autocomplete: 'address-line2'
					}
				},
				{
					type: 'textInput',
					props: {
						id: 'city',
						name: 'city',
						label: 'Town or city',
						autocomplete: 'address-level2',
						width: '20'
					}
				},
				{
					type: 'textInput',
					props: {
						id: 'postcode',
						name: 'postcode',
						label: 'Postcode',
						autocomplete: 'postal-code',
						width: '10'
					}
				}
			],
			nextPage: 'check-answers',
			previousPage: 'contact-details',
			validation: (data) => {
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
			}
		}
	}
};
