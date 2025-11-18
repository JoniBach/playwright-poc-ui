import { readFileSync } from 'fs';
import { join } from 'path';
import { validateAllJourneys, formatValidationResults } from './journey-validator.js';

/**
 * Test script to validate existing journey files against new schemas
 */

async function testJourneyValidation() {
	console.log('🧪 Testing journey validation with new schemas...\n');
	
	try {
		// Load journey index
		const indexPath = join(process.cwd(), 'static/journeys/index.json');
		const journeyIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));
		
		// Load all journey files
		const journeys: Record<string, unknown> = {};
		
		// Get journey IDs from index
		const journeyIds = journeyIndex.journeys.map((j: any) => j.id);
		
		for (const journeyId of journeyIds) {
			try {
				const journeyPath = join(process.cwd(), `static/journeys/${journeyId}.json`);
				const journeyData = JSON.parse(readFileSync(journeyPath, 'utf-8'));
				journeys[journeyId] = journeyData;
				console.log(`✅ Loaded ${journeyId}`);
			} catch (error) {
				console.log(`❌ Failed to load ${journeyId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
		
		console.log(`\n📁 Loaded ${Object.keys(journeys).length} journeys\n`);
		
		// Validate all journeys
		const result = validateAllJourneys(journeys, journeyIndex);
		
		// Output results
		console.log(formatValidationResults(result));
		
		// Return success/failure for CI
		process.exit(result.isValid ? 0 : 1);
		
	} catch (error) {
		console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
		process.exit(1);
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testJourneyValidation();
}

export { testJourneyValidation };
