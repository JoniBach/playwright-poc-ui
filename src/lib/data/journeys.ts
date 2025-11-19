/**
 * Journey data loader
 * Loads and exports all journey configurations for server-side use
 */

// Import all journey JSON files
import registerAPlane from '../../../static/journeys/register-a-plane.json';
import passportApply from '../../../static/journeys/passport-apply.json';
import drivingLicenceApply from '../../../static/journeys/driving-licence-apply.json';
import visaApply from '../../../static/journeys/visa-apply.json';
import studentFinance from '../../../static/journeys/student-finance.json';
import universalCredit from '../../../static/journeys/universal-credit.json';
import selfAssessment from '../../../static/journeys/self-assessment.json';
import probateApply from '../../../static/journeys/probate-apply.json';
import moneyClaim from '../../../static/journeys/money-claim.json';
import joinArmedForces from '../../../static/journeys/join-armed-forces.json';

// Export all journeys as an array
export const journeys = [
	registerAPlane,
	passportApply,
	drivingLicenceApply,
	visaApply,
	studentFinance,
	universalCredit,
	selfAssessment,
	probateApply,
	moneyClaim,
	joinArmedForces
];

// Export individual journeys
export { 
	registerAPlane,
	passportApply,
	drivingLicenceApply,
	visaApply,
	studentFinance,
	universalCredit,
	selfAssessment,
	probateApply,
	moneyClaim,
	joinArmedForces
};

/**
 * Get a journey by ID
 */
export function getJourneyById(id: string) {
	return journeys.find(journey => journey.id === id);
}

/**
 * Get a journey by department and slug
 */
export function getJourneyByRoute(department: string, slug: string) {
	return journeys.find(journey => journey.id === slug);
}
