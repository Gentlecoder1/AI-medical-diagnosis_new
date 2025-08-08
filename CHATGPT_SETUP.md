# Breast Cancer Risk Assessment with ChatGPT Integration

This Next.js application provides a comprehensive breast cancer risk assessment tool powered by OpenAI's ChatGPT API.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 3. Environment Configuration

1. Open the `.env.local` file in the project root
2. Replace `your_openai_api_key_here` with your actual OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

- **Comprehensive Form**: Collects patient information and symptoms
- **ChatGPT Integration**: Uses GPT-4 Vision for medical assessment
- **Smart Image Validation**: AI automatically validates uploaded medical images
- **Risk Assessment**: Provides Low/Medium/High risk categorization
- **Detailed Recommendations**: Offers specific medical guidance
- **Medical Image Support**: Enhanced analysis with vision-capable AI
- **Professional Disclaimer**: Emphasizes the need for medical consultation

## Enhanced AI Image Analysis

### Smart Image Detection

The application now includes GPT-4 Vision integration that:

- **Automatically validates** uploaded images for medical relevance
- **Rejects inappropriate images** (personal photos, selfies, non-medical content)
- **Accepts medical imaging** (mammograms, ultrasounds, MRI scans, clinical photos)
- **Provides specific feedback** when images are invalid
- **Enhances diagnosis accuracy** by combining visual and symptom analysis

### Supported Medical Images

✅ **Accepted:**

- Mammogram images
- Breast ultrasound scans
- MRI breast imaging
- Clinical examination photos
- Medical reports with relevant imaging

❌ **Automatically Rejected:**

- Personal photographs
- Selfies or casual photos
- Non-medical images
- Images of other body parts
- Screenshots or random content

## API Integration Details

### Request Format

The application sends the following data to ChatGPT:

```json
{
  "patient": {
    "name": "Patient Name",
    "age": 35
  },
  "symptoms": {
    "hardness": "medium",
    "painSeverity": "mild",
    "position": "top",
    "duration": "2 weeks",
    "feelLump": "Yes",
    "lumpPainful": "No",
    "lumpStiff": "Yes",
    "symptoms": "Free text description"
  },
  "medicalImage": {
    "name": "image.jpg",
    "size": 1024,
    "type": "image/jpeg"
  }
}
```

### Response Format

ChatGPT returns structured medical assessment:

```json
{
  "diagnosis": "Assessment description",
  "confidence": 75,
  "riskLevel": "Low|Medium|High",
  "recommendations": ["List of recommendations"],
  "explanation": "Detailed medical explanation",
  "metadata": {
    "analysisDate": "2024-01-01T00:00:00.000Z",
    "patientAge": 35,
    "symptoms": {},
    "medicalImageProvided": true
  }
}
```

## Important Notes

1. **Medical Disclaimer**: This tool is for educational purposes only
2. **Professional Consultation**: Always emphasize the need for medical professional consultation
3. **API Costs**: Monitor your OpenAI API usage to manage costs
4. **Rate Limits**: Be aware of OpenAI's rate limits for your subscription tier

## Customization

### Modifying the Prompt

Edit the system prompt in `/src/pages/api/diagnosis.js` to adjust ChatGPT's behavior:

```javascript
// Update the system message content
content: "Your custom medical AI instructions here...";
```

### Adjusting Model Settings

Modify the OpenAI configuration:

```javascript
const completion = await openai.chat.completions.create({
  model: "gpt-4", // or "gpt-3.5-turbo" for faster/cheaper responses
  temperature: 0.3, // Lower = more consistent, Higher = more creative
  max_tokens: 1500, // Adjust response length
});
```

## Deployment

1. **Environment Variables**: Ensure `OPENAI_API_KEY` is set in your production environment
2. **Build**: Run `npm run build` to create production build
3. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

## Security Considerations

1. **API Key Protection**: Never expose your OpenAI API key in client-side code
2. **Rate Limiting**: Implement rate limiting to prevent API abuse
3. **Input Validation**: Validate all user inputs on the server side
4. **Error Handling**: Implement proper error handling for API failures

## Cost Management

- Monitor your OpenAI usage dashboard
- Implement usage limits if needed
- Consider using GPT-3.5-turbo for cost optimization
- Cache common responses to reduce API calls

## Support

For issues or questions:

1. Check the OpenAI documentation
2. Review the API error responses
3. Monitor the browser console for client-side errors
4. Check server logs for API-related issues
