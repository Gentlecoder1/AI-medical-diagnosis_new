import React from "react";

const ResultDisplay = ({ result, onReset }) => {
  if (!result) return null;

  const {
    diagnosis,
    confidence,
    recommendations,
    riskLevel,
    riskScore,
    explanation,
    metadata,
    detailedAnalysis,
    followUpProtocol,
  } = result;

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-green-400";
    if (confidence >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Medical Disclaimer */}
      <div className="flex items-start space-x-3 p-4 bg-red-500/20 border border-red-500 rounded-lg">
        <svg
          className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div className="space-y-2">
          <p className="text-red-400 font-semibold">
            Important Medical Disclaimer
          </p>
          <p className="text-gray-300 text-sm">
            This assessment is for educational purposes only and is not a
            substitute for professional medical advice, diagnosis, or treatment.
            Always consult with a qualified healthcare provider.
          </p>
        </div>
      </div>

      {/* Assessment Results */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Assessment Results
          </h2>
        </div>

        {/* Risk Level and Confidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-lg border ${getRiskLevelColor(riskLevel)}`}
          >
            <h3 className="font-semibold mb-2">Risk Level</h3>
            <p className="text-2xl font-bold">{riskLevel || "Medium"}</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-600 bg-gray-700">
            <h3 className="font-semibold mb-2 text-gray-300">
              Assessment Confidence
            </h3>
            <p
              className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}
            >
              {confidence || 75}%
            </p>
          </div>
          <div className="p-4 rounded-lg border border-blue-600 bg-blue-500/20">
            <h3 className="font-semibold mb-2 text-blue-300">Risk Score</h3>
            <p className="text-2xl font-bold text-blue-400">
              {riskScore || "N/A"}/100
            </p>
            <p className="text-xs text-blue-300 mt-1">
              {riskScore <= 30
                ? "Low Range"
                : riskScore <= 70
                ? "Medium Range"
                : "High Range"}
            </p>
          </div>
        </div>

        {/* Red Flag Symptoms & Reassuring Factors */}
        {detailedAnalysis &&
          (detailedAnalysis.redFlagSymptoms ||
            detailedAnalysis.reassuringFactors) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailedAnalysis.redFlagSymptoms && (
                <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-red-300 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Concerning Symptoms
                  </h3>
                  <ul className="text-red-200 space-y-1">
                    {detailedAnalysis.redFlagSymptoms.map((symptom, index) => (
                      <li key={index}>• {symptom}</li>
                    ))}
                  </ul>
                </div>
              )}

              {detailedAnalysis.reassuringFactors && (
                <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-green-300 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Reassuring Factors
                  </h3>
                  <ul className="text-green-200 space-y-1">
                    {detailedAnalysis.reassuringFactors.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        {/* Diagnosis */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            Initial Assessment
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {diagnosis ||
              "Assessment completed - please consult a healthcare provider"}
          </p>
        </div>

        {/* Detailed Explanation */}
        {explanation && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Detailed Analysis
            </h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {explanation}
            </div>
          </div>
        )}

        {/* Follow-up Urgency */}
        {followUpProtocol && followUpProtocol.urgency && (
          <div
            className={`p-4 rounded-lg border ${
              followUpProtocol.urgency === "Immediate"
                ? "bg-red-500/20 border-red-500 text-red-300"
                : followUpProtocol.urgency === "Within 1 week"
                ? "bg-orange-500/20 border-orange-500 text-orange-300"
                : followUpProtocol.urgency === "Within 1 month"
                ? "bg-yellow-500/20 border-yellow-500 text-yellow-300"
                : "bg-green-500/20 border-green-500 text-green-300"
            }`}
          >
            <h3 className="font-semibold mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Follow-up Urgency
            </h3>
            <p className="text-lg font-bold">{followUpProtocol.urgency}</p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                  <span className="text-gray-300">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        {metadata && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Assessment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
              <p>
                Analysis Date:{" "}
                {new Date(metadata.analysisDate).toLocaleDateString()}
              </p>
              <p>Patient Age: {metadata.patientAge} years</p>
              {result.imageAnalyzed && (
                <p className="text-green-400">
                  ✅ Medical image analyzed and validated
                </p>
              )}
              {result.analysisMethod && (
                <p className="text-blue-400">
                  Analysis type: {result.analysisMethod}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Analysis Notice */}
        {result.imageAnalyzed && (
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-600">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 text-green-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4"
                />
              </svg>
              <h3 className="text-sm font-semibold text-green-300">
                Enhanced AI Analysis
              </h3>
            </div>
            <p className="text-green-200 text-sm">
              This assessment includes advanced image analysis using GPT-4
              Vision technology, providing more comprehensive evaluation by
              combining visual findings with symptom analysis.
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          New Assessment
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
