import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Server-side journey loader
 * Reads journey JSON files directly from the filesystem
 * Use this in server endpoints (+server.ts files)
 */

/**
 * Load a journey JSON file from the static folder
 */
export function loadJourneyServer(journeyId: string): any {
	try {
		// Read the JSON file from static/journeys folder
		const filePath = join(process.cwd(), 'static', 'journeys', `${journeyId}.json`);
		const fileContent = readFileSync(filePath, 'utf-8');
		const journey = JSON.parse(fileContent);
		
		return journey;
	} catch (error) {
		console.error(`Error loading journey ${journeyId}:`, error);
		throw new Error(`Journey not found: ${journeyId}`);
	}
}

/**
 * Load the journey index from the static folder
 */
export function loadJourneyIndexServer(): any {
	try {
		const filePath = join(process.cwd(), 'static', 'journeys', 'index.json');
		const fileContent = readFileSync(filePath, 'utf-8');
		const index = JSON.parse(fileContent);
		
		return index;
	} catch (error) {
		console.error('Error loading journey index:', error);
		return { journeys: [] };
	}
}

/**
 * Get all available journey IDs
 */
export function getAvailableJourneyIds(): string[] {
	const index = loadJourneyIndexServer();
	return index.journeys
		.filter((j: any) => j.enabled)
		.map((j: any) => j.id);
}

/**
 * Check if a journey exists
 */
export function journeyExists(journeyId: string): boolean {
	try {
		loadJourneyServer(journeyId);
		return true;
	} catch {
		return false;
	}
}
