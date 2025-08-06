/**
 * Test helper functions for the medical diagnosis application
 */

/**
 * Test data for form validation
 */
export const testFormData = {
  valid: {
    name: 'John Doe',
    age: 35,
    hardness: 'medium',
    painSeverity: 'mild',
    position: 'top',
    duration: '2 weeks'
  },
  invalid: {
    emptyName: {
      name: '',
      age: 35,
      hardness: 'medium',
      painSeverity: 'mild',
      position: 'top',
      duration: '2 weeks'
    },
    invalidAge: {
      name: 'John Doe',
      age: 150,
      hardness: 'medium',
      painSeverity: 'mild',
      position: 'top',
      duration: '2 weeks'
    },
    missingFields: {
      name: 'John Doe',
      age: 35,
      // Missing required fields
    }
  }
};

/**
 * Mock API responses for testing
 */
export const mockApiResponses = {
  success: {
    diagnosis: 'Benign breast tissue',
    confidence: 75,
    riskLevel: 'Low',
    recommendations: [
      'Monitor the lump for any changes in size or texture',
      'Schedule a follow-up appointment with your healthcare provider',
      'Perform regular self-examinations'
    ],
    metadata: {
      analysisDate: new Date().toISOString(),
      patientAge: 35,
      symptoms: {
        hardness: 'medium',
        painSeverity: 'mild',
        position: 'top',
        duration: '2 weeks'
      }
    }
  },
  error: {
    message: 'API service temporarily unavailable'
  }
};

/**
 * Validate form data structure
 */
export const validateFormStructure = (formData) => {
  const requiredFields = ['name', 'age', 'hardness', 'painSeverity', 'position', 'duration'];
  const missingFields = requiredFields.filter(field => !formData[field]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Test form validation rules
 */
export const testValidationRules = () => {
  const tests = [
    {
      name: 'Valid form data',
      data: testFormData.valid,
      expectedValid: true
    },
    {
      name: 'Empty name',
      data: testFormData.invalid.emptyName,
      expectedValid: false
    },
    {
      name: 'Invalid age',
      data: testFormData.invalid.invalidAge,
      expectedValid: false
    },
    {
      name: 'Missing fields',
      data: testFormData.invalid.missingFields,
      expectedValid: false
    }
  ];

  console.log('Running validation tests...');
  
  tests.forEach(test => {
    const result = validateFormStructure(test.data);
    const passed = result.isValid === test.expectedValid;
    
    console.log(`${test.name}: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`  Expected: ${test.expectedValid}, Got: ${result.isValid}`);
      if (result.missingFields.length > 0) {
        console.log(`  Missing fields: ${result.missingFields.join(', ')}`);
      }
    }
  });
};

/**
 * Test responsive design breakpoints
 */
export const testResponsiveBreakpoints = () => {
  const breakpoints = {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    large: 1280
  };

  console.log('Responsive breakpoints for testing:');
  Object.entries(breakpoints).forEach(([name, width]) => {
    console.log(`${name}: ${width}px`);
  });

  return breakpoints;
};

/**
 * Performance testing helper
 */
export const measureFormSubmissionTime = async (submitFunction, formData) => {
  const startTime = performance.now();
  
  try {
    await submitFunction(formData);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Form submission took ${duration.toFixed(2)}ms`);
    return { success: true, duration };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Form submission failed after ${duration.toFixed(2)}ms:`, error.message);
    return { success: false, duration, error: error.message };
  }
};

// Run tests if in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Make test functions available globally for browser console testing
  window.diagnosisTestHelpers = {
    testFormData,
    mockApiResponses,
    validateFormStructure,
    testValidationRules,
    testResponsiveBreakpoints,
    measureFormSubmissionTime
  };
  
  console.log('Diagnosis test helpers loaded. Access via window.diagnosisTestHelpers');
}
