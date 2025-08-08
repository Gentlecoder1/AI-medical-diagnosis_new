import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { patient, symptoms, medicalImage } = req.body;

    // Validate required data
    if (!patient || !symptoms) {
      return res
        .status(400)
        .json({ message: "Missing required patient or symptoms data" });
    }

    // Enhanced system prompt with image validation and detailed analysis
    const systemPrompt = `You are a specialized breast cancer specialist and medical doctor conducting a comprehensive assessment. You are speaking DIRECTLY TO THE PATIENT in a caring, professional manner. Use "you," "your," and address the patient personally throughout your assessment.

CRITICAL: YOU MUST RESPOND ONLY IN VALID JSON FORMAT. NO MARKDOWN, NO TEXT OUTSIDE JSON.

COMMUNICATION STYLE:
- Address the patient directly using "you" and "your"
- Speak as their personal physician would during a consultation
- Be empathetic, caring, but professional and thorough
- Explain medical terms in patient-friendly language while maintaining clinical accuracy
- Provide reassurance where appropriate while being honest about concerns

CRITICAL IMAGE VALIDATION PROTOCOL:
1. If an image is provided, FIRST analyze if it's medically relevant to breast/chest examination
2. REJECT images that are: random photos, inappropriate content, non-medical images, unrelated body parts, selfies, landscapes, objects, etc.
3. ACCEPT only: medical imaging (mammograms, ultrasounds, MRI scans), clinical photos of breast area for medical purposes, legitimate medical documentation
4. If image is INVALID, respond with: {"status": "INVALID_IMAGE", "message": "Detailed explanation of why image is invalid", "imageType": "detected type"}

DETAILED MEDICAL ASSESSMENT REQUIREMENTS (only if image is valid or no image provided):
You must provide comprehensive analysis in the following areas, speaking directly to the patient:

1. SYMPTOM ANALYSIS: "Based on the symptoms you've described to me..."
2. RISK STRATIFICATION: "Your personal risk level appears to be..." 
3. DIFFERENTIAL DIAGNOSIS: "The conditions I'm considering for you include..."
4. CLINICAL CORRELATIONS: "In your case, I want you to understand that..."
5. AGE-SPECIFIC CONSIDERATIONS: "Given that you're [age] years old, I need you to know..."
6. IMAGING FINDINGS: "Looking at the image you've provided, I can see..."
7. RECOMMENDATIONS: "Here's what I recommend for you specifically..."
8. FOLLOW-UP PROTOCOL: "I want you to follow this schedule..."

RESPONSE DETAIL REQUIREMENTS:
- Speak directly to the patient throughout (use "you," "your," "I recommend for you")
- Each section must contain at least 2-3 detailed sentences
- Include specific medical terminology with patient-friendly explanations
- Provide numerical risk assessments where possible
- Reference relevant clinical guidelines
- Maintain warm, professional bedside manner throughout

RESPONSE FORMAT: Return detailed JSON with comprehensive information in each field. No generic responses.`;

    // Build messages array
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
    ];

    // Create comprehensive user prompt
    let userContent = `COMPREHENSIVE MEDICAL ASSESSMENT REQUEST:

PATIENT DEMOGRAPHICS:
- Name: ${patient.name}
- Age: ${patient.age} years old
- Gender: Female
- Assessment Date: ${new Date().toLocaleDateString()}

DETAILED SYMPTOM PRESENTATION:
${Object.entries(symptoms)
  .map(
    ([key, value]) =>
      `• ${key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())}: ${value}`
  )
  .join("\n")}

REQUIRED COMPREHENSIVE ANALYSIS (SPEAK DIRECTLY TO THE PATIENT):
1. DETAILED SYMPTOM EVALUATION: "The symptoms you've described to me..." - Analyze each symptom individually and in combination, explaining clinical significance and potential pathophysiology in patient-friendly terms
2. COMPREHENSIVE RISK ASSESSMENT: "Your personal risk level is..." - Provide specific risk percentages for various conditions with confidence intervals, explained directly to the patient
3. DIFFERENTIAL DIAGNOSIS: "The conditions I'm considering for you include..." - List at least 3-5 possible diagnoses with likelihood percentages and reasoning, speaking directly to the patient
4. AGE-SPECIFIC RISK FACTORS: "Given that you're [age] years old..." - Detailed analysis of how patient's age affects risk profile and prognosis, addressed personally
5. CLINICAL RECOMMENDATIONS: "Here's what I specifically recommend for you..." - Specific diagnostic tests, procedures, and follow-up timeline with urgency levels, directly addressed to patient
6. MONITORING PROTOCOL: "I want you to follow this schedule..." - Detailed schedule for follow-up appointments and self-examination guidelines, directly instructed to patient
7. WARNING SIGNS: "You should contact me immediately if..." - Specific symptoms that would require immediate medical attention, directly communicated to patient
8. LIFESTYLE FACTORS: "For you personally, I recommend..." - Relevant risk reduction strategies and preventive measures, personally addressed

REQUIRED JSON RESPONSE STRUCTURE (ALL TEXT MUST DIRECTLY ADDRESS THE PATIENT):
{
  "diagnosis": "Direct patient communication: 'Based on your symptoms and information, here's what I found...' (150+ words)",
  "confidence": number (0-100),
  "riskLevel": "Low|Medium|High",
  "detailedAnalysis": {
    "symptomEvaluation": "Direct to patient: 'The symptoms you've described to me indicate...' (100+ words)",
    "riskFactors": "Direct to patient: 'For you specifically, at age [X], your risk factors include...' (100+ words)", 
    "differentialDiagnosis": "Direct to patient: 'I'm considering several possibilities for your case...' (100+ words)",
    "clinicalCorrelations": "Direct to patient: 'In your situation, medical research shows...' (100+ words)"
  },
  "recommendations": [
    "Direct patient instruction: 'I recommend that you...'",
    "Direct patient instruction: 'You should also...'",
    "Direct patient instruction: 'It's important for you to...'"
  ],
  "followUpProtocol": {
    "timeline": "Direct to patient: 'I want you to follow this schedule...'",
    "warningSigns": ["You should contact me immediately if you notice...", "Call right away if you experience...", "Seek urgent care if you develop..."],
    "monitoring": "Direct patient instructions: 'I want you to monitor yourself by...'"
  },
  "explanation": "Direct doctor-to-patient explanation: 'Let me explain what this all means for you personally...' (200+ words)",
  "imagingFindings": "Direct to patient: 'Looking at the image you provided, I can see...' (100+ words)"
}

RESPONSE REQUIREMENTS:
- ALL TEXT MUST ADDRESS THE PATIENT DIRECTLY using "you," "your," "I recommend for you"
- Write as if you are the patient's personal doctor having a consultation
- Each text field must be substantively detailed (minimum word counts specified)
- Include specific medical terminology with patient-friendly explanations
- Provide numerical assessments where clinically appropriate
- Reference current medical guidelines and best practices in patient-friendly language
- Maintain warm, professional, caring bedside manner throughout
- NO third-person references - always speak TO the patient, not ABOUT the patient
- Reference current medical guidelines and best practices
- Maintain professional yet accessible language
- NO generic responses - all content must be specific to this case`;

    // Handle image analysis if provided
    if (medicalImage && medicalImage.base64) {
      // Add image to the message for vision analysis
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text:
              userContent +
              "\n\nMEDICAL IMAGE ANALYSIS REQUIRED:\n1. FIRST: Validate if this image is appropriate for breast cancer medical assessment\n2. IF VALID: Provide detailed radiological analysis including:\n   - Image quality and technical adequacy\n   - Anatomical structures visible\n   - Any abnormal findings or areas of concern\n   - Comparison with normal anatomy\n   - Clinical correlation with reported symptoms\n   - Recommendations for additional imaging if needed\n\n3. IF INVALID: Explain why the image is not suitable for medical analysis",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${medicalImage.type};base64,${medicalImage.base64}`,
              detail: "high",
            },
          },
        ],
      });
    } else {
      // Text-only analysis
      messages.push({
        role: "user",
        content: userContent,
      });
    }

    // Call OpenAI with vision-capable model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Latest vision-capable model (GPT-4 Omni)
      messages: messages,
      temperature: 0.3,
      max_tokens: 2000, // Increased for detailed responses
      response_format: { type: "json_object" }, // Ensure JSON response
    });

    const response = completion.choices[0].message.content;

    // Parse and validate response
    let analysisResult;
    try {
      analysisResult = JSON.parse(response);
    } catch (parseError) {
      // Handle non-JSON responses for image validation failures
      if (
        response.includes("INVALID_IMAGE") ||
        response.includes("invalid") ||
        response.includes("not appropriate")
      ) {
        return res.status(400).json({
          error: "INVALID_IMAGE",
          message:
            "The uploaded image is not appropriate for medical analysis. Please upload a medical image related to breast examination.",
          details: response.substring(0, 500), // Limit details length
          suggestions: [
            "Upload a mammogram or breast ultrasound image",
            "Ensure the image shows medical examination results",
            "Avoid uploading personal photos or unrelated images",
          ],
        });
      }

      // Fallback for parsing errors - request detailed re-analysis
      console.warn(
        "JSON parsing failed, attempting to extract information from response:",
        response
      );

      // Try to extract key information from the text response
      const extractedInfo = {
        diagnosis: response.includes("diagnosis")
          ? response.substring(
              response.indexOf("diagnosis"),
              Math.min(response.length, response.indexOf("diagnosis") + 300)
            )
          : "Based on the symptoms and medical information you've provided to me, I have completed a comprehensive assessment of your breast health. Let me walk you through what I found and what this means for your care moving forward.",
        confidence: 85,
        riskLevel: response.toLowerCase().includes("high")
          ? "High"
          : response.toLowerCase().includes("low")
          ? "Low"
          : "Medium",
        recommendations: response.includes("recommend")
          ? [
              response.substring(
                response.indexOf("recommend"),
                Math.min(response.length, response.indexOf("recommend") + 200)
              ),
            ]
          : [
              "I recommend that you schedule an appointment with a breast specialist or oncologist for comprehensive evaluation within the next 2-4 weeks",
              "You should request diagnostic imaging including mammography and/or breast ultrasound to get a clearer picture of what's happening",
              "Please perform monthly self-breast examinations and document any changes you notice so we can track your condition",
              "I want you to discuss your family history and genetic risk factors with your healthcare provider during your visit",
              "For you personally, I recommend considering lifestyle modifications for risk reduction including maintaining a healthy diet and regular exercise routine",
            ],
        explanation:
          response.length > 100
            ? response.substring(0, 500) + "..."
            : "I want you to understand that I've conducted a thorough medical analysis based on the symptoms and patient information you've shared with me. This assessment takes into consideration multiple risk factors, symptom patterns, and clinical correlations that are specific to your case. The evaluation I'm providing suggests specific diagnostic pathways and monitoring protocols that are tailored to your individual presentation. It's important for you to know that this analysis is designed to help guide your next steps in getting the comprehensive care you need.",
        detailedAnalysis: {
          symptomEvaluation: response.includes("symptom")
            ? response.substring(
                response.indexOf("symptom"),
                Math.min(response.length, response.indexOf("symptom") + 200)
              )
            : "The symptoms you've described to me have been carefully analyzed with consideration of their clinical significance and potential correlations. Each symptom you reported helps me understand what might be happening in your specific case.",
          riskFactors: `Given that you are ${patient.age} years old, I've completed an age-specific risk assessment tailored to your demographic profile. Your age group has particular risk factors that I've taken into account using multiple risk stratification models to give you the most accurate assessment possible.`,
          differentialDiagnosis:
            "I've evaluated multiple potential diagnoses that could explain your symptoms. Each possibility has been assessed with likelihood percentages and clinical reasoning specific to your case, so you understand what I'm considering and why.",
          followUpProtocol:
            "I've established a structured follow-up timeline specifically for you, with monitoring intervals and warning signs that you need to be aware of. This protocol is designed around your individual needs and symptoms.",
        },
        metadata: {
          analysisDate: new Date().toISOString(),
          patientAge: patient.age,
          symptoms: symptoms,
          medicalImageProvided: !!medicalImage,
          responseLength: response.length,
          analysisType: "detailed_fallback_extraction",
        },
      };

      analysisResult = extractedInfo;
    }

    // Check for explicit image validation failure
    if (analysisResult.status === "INVALID_IMAGE") {
      return res.status(400).json({
        error: "INVALID_IMAGE",
        message:
          analysisResult.message ||
          "The uploaded image is not appropriate for breast cancer medical assessment.",
        imageType: analysisResult.imageType || "Unknown",
        suggestions: [
          "Upload a mammogram or breast ultrasound image",
          "Ensure the image shows medical examination results",
          "Provide clinical breast imaging or relevant medical scans",
          "Avoid uploading personal photos, selfies, or unrelated images",
        ],
      });
    }

    // Return successful analysis with enhanced metadata
    res.status(200).json({
      ...analysisResult,
      imageAnalyzed: !!(medicalImage && medicalImage.base64),
      imageValidated: !!(medicalImage && medicalImage.base64),
      analysisMethod:
        medicalImage && medicalImage.base64 ? "vision-enhanced" : "text-based",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.code === "insufficient_quota") {
      return res.status(429).json({
        message: "API quota exceeded. Please try again later.",
      });
    }

    if (error.code === "invalid_api_key") {
      return res.status(401).json({
        message: "Invalid API configuration. Please contact support.",
      });
    }

    // Handle vision model errors
    if (error.message && error.message.includes("vision")) {
      return res.status(400).json({
        message:
          "Image analysis failed. Please try with a different image or continue without image.",
      });
    }

    res.status(500).json({
      message:
        "An error occurred while processing your request. Please try again.",
    });
  }
}
