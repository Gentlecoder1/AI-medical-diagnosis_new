import axios from "axios";

// Configure axios defaults
const api = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock API endpoint - replace with actual AI service endpoint
const API_ENDPOINT =
  process.env.NEXT_PUBLIC_DIAGNOSIS_API_URL || "/api/diagnosis";

/**
 * Submit diagnosis data to AI service
 * @param {Object} formData - The form data containing patient information
 * @returns {Promise<Object>} - The diagnosis result
 */
export const submitDiagnosisData = async (formData) => {
  try {
    // Format the data for the API
    const requestData = {
      patient: {
        name: formData.name,
        age: parseInt(formData.age, 10),
      },
      symptoms: {
        hardness: formData.hardness,
        painSeverity: formData.painSeverity,
        position: formData.position,
        duration: formData.duration,
        feelLump: formData.feelLump,
        lumpPainful: formData.lumpPainful,
        lumpStiff: formData.lumpStiff,
        symptoms: formData.symptoms || "",
      },
      medicalImage: formData.medicalImages
        ? {
            name: formData.medicalImages.name,
            size: formData.medicalImages.size,
            type: formData.medicalImages.type,
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    // Use actual API endpoint for ChatGPT integration
    const response = await api.post(API_ENDPOINT, requestData);

    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("API Error:", error);

    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "Server error occurred";
      throw new Error(`API Error: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        "Network error: Unable to connect to the diagnosis service"
      );
    } else {
      // Something else happened
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * Simulate AI diagnosis API for development/demo purposes
 * @param {Object} requestData - The formatted request data
 * @returns {Promise<Object>} - Simulated diagnosis result
 */
const simulateDiagnosisAPI = async (requestData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { symptoms, patient, medicalImage } = requestData;

  // Simple rule-based simulation for demo purposes
  let diagnosis = "Benign breast tissue";
  let confidence = 75;
  let riskLevel = "Low";
  let recommendations = [
    "Monitor the lump for any changes in size or texture",
    "Schedule a follow-up appointment with your healthcare provider",
    "Perform regular self-examinations",
  ];

  // Adjust diagnosis based on symptoms
  if (symptoms.hardness === "hard" && symptoms.painSeverity === "severe") {
    diagnosis = "Requires immediate medical evaluation";
    confidence = 85;
    riskLevel = "High";
    recommendations = [
      "Seek immediate medical attention",
      "Schedule an urgent appointment with an oncologist",
      "Consider imaging studies (ultrasound, mammography)",
      "Avoid delay in professional medical evaluation",
    ];
  } else if (
    symptoms.hardness === "hard" ||
    symptoms.painSeverity === "moderate"
  ) {
    diagnosis = "Possible fibrocystic changes or benign mass";
    confidence = 70;
    riskLevel = "Medium";
    recommendations = [
      "Schedule an appointment with your healthcare provider within 1-2 weeks",
      "Consider imaging studies if recommended by your doctor",
      "Keep a symptom diary noting any changes",
      "Avoid caffeine which may worsen fibrocystic symptoms",
    ];
  } else if (symptoms.painSeverity === "none" && symptoms.hardness === "soft") {
    diagnosis = "Likely benign breast tissue or lipoma";
    confidence = 80;
    riskLevel = "Low";
    recommendations = [
      "Continue regular self-examinations",
      "Schedule routine follow-up with your healthcare provider",
      "Monitor for any changes in size, shape, or texture",
      "Maintain a healthy lifestyle",
    ];
  }

  // Adjust confidence based on age
  if (patient.age > 50) {
    confidence = Math.max(confidence - 10, 60);
    if (
      !recommendations.includes(
        "Consider age-appropriate screening mammography"
      )
    ) {
      recommendations.push("Consider age-appropriate screening mammography");
    }
  }

  // Adjust confidence and recommendations if medical image is provided
  if (medicalImage) {
    confidence = Math.min(confidence + 15, 95); // Increase confidence with image
    recommendations.unshift(
      "Medical image analysis has been included in this assessment"
    );
  }

  return {
    diagnosis,
    confidence,
    riskLevel,
    recommendations,
    metadata: {
      analysisDate: new Date().toISOString(),
      patientAge: patient.age,
      symptoms: symptoms,
      medicalImageProvided: !!medicalImage,
      medicalImageInfo: medicalImage || null,
    },
  };
};

/**
 * Validate form data before submission
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Validation result
 */
export const validateFormData = (formData) => {
  const errors = [];

  if (!formData.name || formData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  const age = parseInt(formData.age, 10);
  if (!age || age < 1 || age > 120) {
    errors.push("Age must be between 1 and 120 years");
  }

  if (!formData.hardness) {
    errors.push("Hardness of lump is required");
  }

  if (!formData.painSeverity) {
    errors.push("Pain severity is required");
  }

  if (!formData.position) {
    errors.push("Position of lump is required");
  }

  if (!formData.duration || formData.duration.trim().length < 2) {
    errors.push("Duration of pain is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
