#!/usr/bin/env tsx
/**
 * Journey Validation Script
 * Validates AI-generated journey JSON files for API compatibility
 * 
 * Usage: npx tsx scripts/validate-journey.ts <path-to-journey.json>
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface ValidationError {
  severity: 'error' | 'warning';
  message: string;
  fix?: string;
}

function validateJourney(filePath: string): boolean {
  console.log(`\n🔍 Validating journey: ${filePath}\n`);
  
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  try {
    // Read and parse JSON
    const content = readFileSync(filePath, 'utf-8');
    const journey = JSON.parse(content);
    
    // 1. Check critical journey properties
    if (!journey.id) {
      errors.push({
        severity: 'error',
        message: 'Missing "id" property',
        fix: 'Add "id": "journey-name" to the root of the JSON'
      });
    }
    
    if (!journey.name) {
      errors.push({
        severity: 'error',
        message: 'Missing "name" property',
        fix: 'Add "name": "Human Readable Name" to the root of the JSON'
      });
    }
    
    if (!journey.checkYourAnswersPage) {
      errors.push({
        severity: 'error',
        message: 'Missing "checkYourAnswersPage" property',
        fix: 'Add "checkYourAnswersPage": "check-your-answers" to the root of the JSON'
      });
    } else if (journey.checkYourAnswersPage !== 'check-your-answers') {
      errors.push({
        severity: 'error',
        message: `checkYourAnswersPage should be "check-your-answers", got "${journey.checkYourAnswersPage}"`,
        fix: 'Change to "checkYourAnswersPage": "check-your-answers"'
      });
    }
    
    if (!journey.completionPage) {
      errors.push({
        severity: 'error',
        message: 'Missing "completionPage" property',
        fix: 'Add "completionPage": "confirmation" to the root of the JSON'
      });
    }
    
    if (!journey.pages) {
      errors.push({
        severity: 'error',
        message: 'Missing "pages" object',
        fix: 'Add "pages": {} with page definitions'
      });
      return false; // Can't continue without pages
    }
    
    // 2. Check required pages exist
    if (!journey.pages['check-your-answers']) {
      errors.push({
        severity: 'error',
        message: 'Missing "check-your-answers" page in pages object',
        fix: 'Add a page with id "check-your-answers" to the pages object'
      });
    }
    
    if (journey.completionPage && !journey.pages[journey.completionPage]) {
      errors.push({
        severity: 'error',
        message: `Missing "${journey.completionPage}" page in pages object`,
        fix: `Add a page with id "${journey.completionPage}" to the pages object`
      });
    }
    
    // 3. Validate each page
    let totalComponents = 0;
    let componentsWithValidation = 0;
    let componentsNeedingValidation = 0;
    
    for (const [pageId, page] of Object.entries(journey.pages)) {
      const pageData = page as any;
      
      // Check page structure
      if (!pageData.id) {
        errors.push({
          severity: 'error',
          message: `Page "${pageId}" missing "id" property`,
          fix: `Add "id": "${pageId}" to the page object`
        });
      } else if (pageData.id !== pageId) {
        warnings.push({
          severity: 'warning',
          message: `Page key "${pageId}" doesn't match page.id "${pageData.id}"`,
          fix: `Make them consistent: "${pageId}"`
        });
      }
      
      if (!pageData.title) {
        warnings.push({
          severity: 'warning',
          message: `Page "${pageId}" missing "title" property`,
          fix: 'Add a descriptive title for the page'
        });
      }
      
      // Check page ID naming convention
      if (pageId.includes('_') || /[A-Z]/.test(pageId)) {
        warnings.push({
          severity: 'warning',
          message: `Page ID "${pageId}" should use kebab-case (lowercase with hyphens)`,
          fix: `Rename to: "${pageId.toLowerCase().replace(/_/g, '-')}"`
        });
      }
      
      // Validate components
      if (!pageData.components) {
        warnings.push({
          severity: 'warning',
          message: `Page "${pageId}" has no components`,
          fix: 'Add components array with at least one component'
        });
        continue;
      }
      
      for (const component of pageData.components) {
        totalComponents++;
        
        const inputTypes = ['textInput', 'email', 'tel', 'textarea', 'radios', 'checkboxes', 'select', 'dateInput'];
        
        if (inputTypes.includes(component.type)) {
          componentsNeedingValidation++;
          
          // Check component structure
          if (!component.id) {
            errors.push({
              severity: 'error',
              message: `Component on page "${pageId}" missing "id"`,
              fix: 'Add unique id to the component'
            });
          }
          
          if (!component.props) {
            errors.push({
              severity: 'error',
              message: `Component "${component.id}" on page "${pageId}" missing "props"`,
              fix: 'Add props object with id, name, label'
            });
            continue;
          }
          
          // Check props consistency
          if (component.props.id !== component.id) {
            warnings.push({
              severity: 'warning',
              message: `Component "${component.id}": props.id "${component.props.id}" doesn't match component.id`,
              fix: `Make them consistent: "${component.id}"`
            });
          }
          
          if (component.props.name && component.props.name !== component.id) {
            warnings.push({
              severity: 'warning',
              message: `Component "${component.id}": props.name "${component.props.name}" doesn't match component.id`,
              fix: `Use consistent naming: "${component.id}"`
            });
          }
          
          if (!component.props.label) {
            errors.push({
              severity: 'error',
              message: `Component "${component.id}" on page "${pageId}" missing props.label`,
              fix: 'Add a descriptive label for the field'
            });
          }
          
          // Check validation
          if (!component.validation) {
            errors.push({
              severity: 'error',
              message: `Component "${component.id}" on page "${pageId}" missing validation`,
              fix: 'Add validation object with required and errorMessages'
            });
          } else {
            componentsWithValidation++;
            
            // Check error messages
            if (!component.validation.errorMessages) {
              errors.push({
                severity: 'error',
                message: `Component "${component.id}" validation missing errorMessages`,
                fix: 'Add errorMessages object with required, pattern, etc.'
              });
            } else {
              // Check error message style
              if (component.validation.required && component.validation.errorMessages.required) {
                const msg = component.validation.errorMessages.required;
                const imperativeVerbs = ['Enter', 'Select', 'Choose', 'Provide', 'Upload'];
                const startsWithImperative = imperativeVerbs.some(verb => msg.startsWith(verb));
                
                if (!startsWithImperative) {
                  warnings.push({
                    severity: 'warning',
                    message: `Component "${component.id}" error message doesn't start with imperative verb: "${msg}"`,
                    fix: `Change to: "Enter ${component.props.label?.toLowerCase() || 'value'}"`
                  });
                }
              }
              
              // Check pattern validation for email/phone
              if (component.props.type === 'email' && !component.validation.pattern) {
                warnings.push({
                  severity: 'warning',
                  message: `Email field "${component.id}" missing pattern validation`,
                  fix: 'Add "pattern": "email" to validation'
                });
              }
              
              if (component.props.type === 'tel' && !component.validation.pattern) {
                warnings.push({
                  severity: 'warning',
                  message: `Phone field "${component.id}" missing pattern validation`,
                  fix: 'Add "pattern": "phone" to validation'
                });
              }
            }
          }
        }
      }
    }
    
    // 4. Check navigation flow
    const pageIds = Object.keys(journey.pages);
    for (const [pageId, page] of Object.entries(journey.pages)) {
      const pageData = page as any;
      
      if (pageData.nextPage && !journey.pages[pageData.nextPage]) {
        errors.push({
          severity: 'error',
          message: `Page "${pageId}" nextPage "${pageData.nextPage}" doesn't exist`,
          fix: `Create page "${pageData.nextPage}" or fix the nextPage reference`
        });
      }
      
      if (pageData.previousPage && !journey.pages[pageData.previousPage]) {
        errors.push({
          severity: 'error',
          message: `Page "${pageId}" previousPage "${pageData.previousPage}" doesn't exist`,
          fix: `Create page "${pageData.previousPage}" or fix the previousPage reference`
        });
      }
    }
    
    // Print results
    console.log('📊 Validation Summary:\n');
    console.log(`  Total pages: ${pageIds.length}`);
    console.log(`  Total components: ${totalComponents}`);
    console.log(`  Input components: ${componentsNeedingValidation}`);
    console.log(`  Components with validation: ${componentsWithValidation}`);
    console.log(`  Validation coverage: ${componentsNeedingValidation > 0 ? Math.round((componentsWithValidation / componentsNeedingValidation) * 100) : 0}%\n`);
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ Journey validation passed!\n');
      console.log('🎉 This journey is ready to use!\n');
      return true;
    }
    
    // Print errors
    if (errors.length > 0) {
      console.log(`❌ ${errors.length} Error(s) found:\n`);
      errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.message}`);
        if (err.fix) {
          console.log(`     💡 Fix: ${err.fix}`);
        }
        console.log('');
      });
    }
    
    // Print warnings
    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} Warning(s) found:\n`);
      warnings.forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn.message}`);
        if (warn.fix) {
          console.log(`     💡 Fix: ${warn.fix}`);
        }
        console.log('');
      });
    }
    
    return errors.length === 0;
    
  } catch (error: any) {
    console.log('❌ Failed to parse journey JSON:\n');
    console.log(`  ${error.message}\n`);
    return false;
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npx tsx scripts/validate-journey.ts <path-to-journey.json>');
  console.log('\nExample:');
  console.log('  npx tsx scripts/validate-journey.ts static/journeys/register-a-plane.json');
  process.exit(1);
}

const filePath = args[0];
const isValid = validateJourney(filePath);

process.exit(isValid ? 0 : 1);
