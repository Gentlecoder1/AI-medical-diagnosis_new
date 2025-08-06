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

    // Create a comprehensive prompt for medical assessment
    const prompt = createMedicalAssessmentPrompt(
      patient,
      symptoms,
      medicalImage
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant specializing in breast health assessment. You provide educational information and risk assessments based on symptoms, but always emphasize the need for professional medical consultation. 

Your responses should be in JSON format with the following structure:
{
  "diagnosis": "Brief assessment description",
  "confidence": number (0-100),
  "riskLevel": "Low|Medium|High",
  "recommendations": ["list", "of", "recommendations"],
  "explanation": "Detailed explanation of the assessment",
  "metadata": {
    "analysisDate": "ISO date string",
    "patientAge": number,
    "symptoms": object,
    "medicalImageProvided": boolean
  }
}

IMPORTANT: Always include disclaimers about seeking professional medical advice and that this is not a substitute for medical diagnosis.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent medical responses
      max_tokens: 1500,
    });

    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      result = {
        diagnosis:
          "Assessment completed - please consult a healthcare provider",
        confidence: 75,
        riskLevel: "Medium",
        recommendations: [
          "Consult with a healthcare provider for proper evaluation",
          "Monitor symptoms and any changes",
          "Follow up as recommended by your doctor",
        ],
        explanation: completion.choices[0].message.content,
        metadata: {
          analysisDate: new Date().toISOString(),
          patientAge: patient.age,
          symptoms: symptoms,
          medicalImageProvided: !!medicalImage,
        },
      };
    }

    res.status(200).json(result);
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

    res.status(500).json({
      message:
        "An error occurred while processing your request. Please try again.",
    });
  }
}

function createMedicalAssessmentPrompt(patient, symptoms, medicalImage) {
  const imageInfo = medicalImage
    ? `\n- Medical image provided: ${medicalImage.name} (${medicalImage.type})`
    : "\n- No medical image provided";

  return `Please provide a breast health risk assessment for the following patient information:

**Patient Information:**
- Name: ${patient.name}
- Age: ${patient.age} years

**Symptoms and Clinical Findings:**
- Lump hardness: ${symptoms.hardness}
- Pain severity: ${symptoms.painSeverity}
- Lump position: ${symptoms.position}
- Duration of symptoms: ${symptoms.duration}${imageInfo}

**Additional Context:**
Please assess the potential risk level and provide educational recommendations. Consider factors such as:
- Age-related risk factors
- Symptom characteristics
- Duration and progression
- Need for professional medical evaluation

Remember to:
1. Provide a confidence level (0-100%) for your assessment
2. Categorize risk as Low, Medium, or High
3. Give specific, actionable recommendations
4. Include appropriate medical disclaimers
5. Emphasize the importance of professional medical consultation

Please respond in the JSON format specified in the system message.`;
}
