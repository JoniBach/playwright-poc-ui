import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Simple validation test to check if our schemas work with existing journey files
 * This uses plain JavaScript to avoid TypeScript compilation issues
 */

// Simple validation function to test component structure
function validateComponentStructure(component) {
	if (!component.type) {
		return { valid: false, error: 'Component missing type' };
	}
	
	if (!component.props) {
		return { valid: false, error: 'Component missing props' };
	}
	
	// Check common component types and their required props
	switch (component.type) {
		case 'textInput':
			if (!component.props.id || !component.props.name || !component.props.label) {
				return { valid: false, error: 'textInput missing required props (id, name, label)' };
			}
			break;
		case 'heading':
			if (!component.props.text && !component.props.content) {
				return { valid: false, error: 'heading missing text or content prop' };
			}
			break;
		case 'paragraph':
			if (!component.props.text && !component.props.content) {
				return { valid: false, error: 'paragraph missing text or content prop' };
			}
			break;
		case 'radios':
			if (!component.props.id || !component.props.name || !component.props.legend || !component.props.items) {
				return { valid: false, error: 'radios missing required props (id, name, legend, items)' };
			}
			break;
		case 'dateInput':
			if (!component.props.id || !component.props.name || !component.props.legend) {
				return { valid: false, error: 'dateInput missing required props (id, name, legend)' };
			}
			break;
	}
	
	return { valid: true };
}

function validateJourneyStructure(journey) {
	const errors = [];
	
	// Check required top-level properties
	if (!journey.id) errors.push('Journey missing id');
	if (!journey.name) errors.push('Journey missing name');
	if (!journey.startPage) errors.push('Journey missing startPage');
	if (!journey.pages) errors.push('Journey missing pages');
	
	if (journey.pages) {
		// Check each page
		Object.entries(journey.pages).forEach(([pageId, page]) => {
			if (!page.id) errors.push(`Page ${pageId} missing id`);
			if (!page.title) errors.push(`Page ${pageId} missing title`);
			if (!page.components) errors.push(`Page ${pageId} missing components`);
			
			if (page.components) {
				page.components.forEach((component, index) => {
					const result = validateComponentStructure(component);
					if (!result.valid) {
						errors.push(`Page ${pageId}, component ${index}: ${result.error}`);
					}
				});
			}
		});
		
		// Check if startPage exists
		if (journey.startPage && !journey.pages[journey.startPage]) {
			errors.push(`Start page "${journey.startPage}" does not exist`);
		}
	}
	
	return errors;
}

async function testExistingJourneys() {
	console.log('🧪 Testing existing journey files for compatibility...\n');
	
	try {
		// Load journey index
		const indexPath = join(process.cwd(), 'static/journeys/index.json');
		const journeyIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));
		
		console.log(`📁 Found ${journeyIndex.journeys.length} journeys in index\n`);
		
		let totalJourneys = 0;
		let validJourneys = 0;
		let totalErrors = 0;
		const componentTypes = {};
		
		// Test each journey
		for (const journeyMeta of journeyIndex.journeys) {
			totalJourneys++;
			console.log(`🔍 Testing ${journeyMeta.id}...`);
			
			try {
				const journeyPath = join(process.cwd(), `static/journeys/${journeyMeta.id}.json`);
				const journey = JSON.parse(readFileSync(journeyPath, 'utf-8'));
				
				const errors = validateJourneyStructure(journey);
				
				if (errors.length === 0) {
					validJourneys++;
					console.log(`  ✅ Valid`);
				} else {
					totalErrors += errors.length;
					console.log(`  ❌ ${errors.length} errors:`);
					errors.forEach(error => console.log(`     - ${error}`));
				}
				
				// Count component types
				if (journey.pages) {
					Object.values(journey.pages).forEach(page => {
						if (page.components) {
							page.components.forEach(component => {
								componentTypes[component.type] = (componentTypes[component.type] || 0) + 1;
							});
						}
					});
				}
				
			} catch (error) {
				console.log(`  ❌ Failed to load: ${error.message}`);
				totalErrors++;
			}
		}
		
		// Summary
		console.log('\n' + '='.repeat(50));
		console.log('📊 VALIDATION SUMMARY');
		console.log('='.repeat(50));
		console.log(`Journeys: ${validJourneys}/${totalJourneys} valid`);
		console.log(`Total errors: ${totalErrors}`);
		
		if (Object.keys(componentTypes).length > 0) {
			console.log('\n📋 Component types found:');
			Object.entries(componentTypes)
				.sort(([,a], [,b]) => b - a)
				.forEach(([type, count]) => {
					console.log(`  ${type}: ${count}`);
				});
		}
		
		if (validJourneys === totalJourneys && totalErrors === 0) {
			console.log('\n✅ All journeys are structurally valid!');
			console.log('🎯 Ready for strict schema validation');
		} else {
			console.log('\n⚠️  Some journeys have structural issues');
			console.log('💡 These need to be fixed before applying strict schemas');
		}
		
	} catch (error) {
		console.error('❌ Test failed:', error.message);
		process.exit(1);
	}
}

// Run the test
testExistingJourneys();
