/**
 * Auto-fill utilities for populating form fields with test data
 */

import { getFieldMetadata } from '$lib/validation/field-metadata';
import type { JourneyPage } from '$lib/types/journey';

/**
 * Generate test data for all fields on a page based on field metadata
 */
export function generateTestData(page: JourneyPage): Record<string, any> {
	const testData: Record<string, any> = {};

	page.components.forEach((component) => {
		const fieldId = component.props.id || component.props.name;
		if (!fieldId) return;

		// Get field metadata
		const metadata = getFieldMetadata(fieldId);

		// Generate test data based on component type
		switch (component.type) {
			case 'textInput':
			case 'textarea':
				// Use example from metadata if available
				if (metadata?.example) {
					testData[fieldId] = metadata.example;
				} else {
					// Generate generic test data based on field name
					testData[fieldId] = generateGenericValue(fieldId, component.props.label);
				}
				break;

			case 'dateInput':
				// Use example from metadata or generate a valid date
				if (metadata?.example) {
					const parts = metadata.example.split(' ');
					testData[fieldId] = {
						day: parts[0] || '1',
						month: parts[1] || '1',
						year: parts[2] || '1990'
					};
				} else {
					testData[fieldId] = {
						day: '1',
						month: '1',
						year: '1990'
					};
				}
				break;

			case 'select':
			case 'radios':
				// Select the first non-empty option (skip placeholder options with empty values)
				const items = component.props.items || [];
				const firstValidOption = items.find((item: any) => item.value && item.value !== '');
				if (firstValidOption) {
					testData[fieldId] = firstValidOption.value;
				}
				break;

			case 'checkboxes':
				// Select the first checkbox
				const checkboxItems = component.props.items || [];
				if (checkboxItems.length > 0 && checkboxItems[0].value) {
					testData[fieldId] = [checkboxItems[0].value];
				}
				break;
		}
	});

	return testData;
}

/**
 * Generate a generic test value based on field ID or label
 */
function generateGenericValue(fieldId: string, label?: string): string {
	const id = fieldId.toLowerCase();
	const labelLower = (label || '').toLowerCase();

	// Common patterns
	if (id.includes('name') || labelLower.includes('name')) {
		if (id.includes('first') || labelLower.includes('first')) return 'John';
		if (id.includes('last') || labelLower.includes('last')) return 'Smith';
		if (id.includes('account')) return 'John Smith';
		return 'Test Name';
	}

	if (id.includes('email') || labelLower.includes('email')) {
		return 'test@example.com';
	}

	if (id.includes('phone') || labelLower.includes('phone') || labelLower.includes('telephone')) {
		return '07700900000';
	}

	if (id.includes('postcode') || labelLower.includes('postcode')) {
		return 'SW1A 1AA';
	}

	if (id.includes('address')) {
		if (id.includes('line1') || id.includes('1')) return '10 Downing Street';
		if (id.includes('line2') || id.includes('2')) return '';
		return '10 Downing Street';
	}

	if (id.includes('city') || labelLower.includes('city') || labelLower.includes('town')) {
		return 'London';
	}

	if (id.includes('income') || labelLower.includes('income')) {
		return '25000';
	}

	if (id.includes('account') && id.includes('number')) {
		return '12345678';
	}

	if (id.includes('sort') && id.includes('code')) {
		return '12-34-56';
	}

	if (id.includes('university') || labelLower.includes('university')) {
		return 'University of Example';
	}

	if (id.includes('course')) {
		if (labelLower.includes('name')) return 'Computer Science';
		if (labelLower.includes('length')) return '3';
		return 'Test Course';
	}

	// Default generic value
	return 'Test Value';
}
