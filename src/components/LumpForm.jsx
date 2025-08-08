import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ToggleButton from "./ToggleButton";
import TextAreaField from "./TextAreaField";
import SelectField from "./SelectField";
import FileUpload from "./FileUpload";
import LoadingSpinner from "./LoadingSpinner";
import ResultDisplay from "./ResultDisplay";
import Header from "./Header";
import FormSection from "./FormSection";
import { submitDiagnosisData } from "../services/diagnosisApi";

const LumpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [imageError, setImageError] = useState(null);

  const [formData, setFormData] = useState({
    symptoms: "",
    feelLump: "",
    lumpPainful: "",
    lumpStiff: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
  });

  const hardnessOptions = [
    { value: "soft", label: "Soft" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const painSeverityOptions = [
    { value: "none", label: "None" },
    { value: "mild", label: "Mild" },
    { value: "moderate", label: "Moderate" },
    { value: "severe", label: "Severe" },
  ];

  const positionOptions = [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "nipple_area", label: "Nipple Area" },
  ];

  const durationOptions = [
    { value: "1-3 days", label: "1-3 days" },
    { value: "4-7 days", label: "4-7 days (1 week)" },
    { value: "1-2 weeks", label: "1-2 weeks" },
    { value: "3-4 weeks", label: "3-4 weeks (1 month)" },
    { value: "1-3 months", label: "1-3 months" },
    { value: "3-6 months", label: "3-6 months" },
    { value: "6-12 months", label: "6-12 months" },
    { value: "over 1 year", label: "Over 1 year" },
  ];

  const isFormValid =
    formData.feelLump !== "" &&
    formData.lumpPainful !== "" &&
    formData.lumpStiff !== "";

  const handleToggleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValue(field, value);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setImageError(null);

    try {
      const submissionData = {
        ...data,
        ...formData,
        medicalImages:
          data.medicalImages && data.medicalImages.length > 0
            ? data.medicalImages[0]
            : null,
      };

      const response = await submitDiagnosisData(submissionData);
      setResult(response);
    } catch (error) {
      console.error("Submission error:", error);

      // Handle image validation errors specifically
      if (error.type === "INVALID_IMAGE") {
        setImageError({
          type: "INVALID_IMAGE",
          message: error.message,
          suggestions: error.suggestions,
          imageType: error.imageType,
        });
      } else {
        setApiError(
          error.message || "An error occurred while processing your request."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setApiError(null);
    setImageError(null);
    setFormData({
      symptoms: "",
      feelLump: "",
      lumpPainful: "",
      lumpStiff: "",
    });
  };

  if (result) {
    return <ResultDisplay result={result} onReset={handleReset} />;
  }

  // Show image validation error
  if (imageError) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Header
          title="Image Validation Failed"
          subtitle="Please upload a valid medical image"
        />

        <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-red-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold text-red-800">
              Invalid Medical Image
            </h2>
          </div>

          <p className="text-red-700 mb-4">{imageError.message}</p>

          {imageError.imageType && (
            <div className="mb-4 p-3 bg-red-100 rounded-md">
              <p className="text-red-800">
                <strong>Detected image type:</strong> {imageError.imageType}
              </p>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <h3 className="font-semibold text-green-800 mb-2">
              ✅ Please upload:
            </h3>
            <ul className="list-disc list-inside text-green-700 space-y-1">
              <li>Mammogram images</li>
              <li>Breast ultrasound scans</li>
              <li>MRI breast imaging</li>
              <li>Clinical examination photos (appropriate medical context)</li>
              <li>Medical reports with relevant imaging</li>
            </ul>
          </div>

          <div className="bg-red-100 border border-red-300 rounded-md p-4 mb-4">
            <h3 className="font-semibold text-red-800 mb-2">
              ❌ Avoid uploading:
            </h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              <li>Personal photos unrelated to medical examination</li>
              <li>Selfies or casual photographs</li>
              <li>Images of other body parts</li>
              <li>Screenshots or non-medical content</li>
              <li>Random objects or landscapes</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again with Valid Image
            </button>
            <button
              onClick={() => {
                setImageError(null);
                // Clear the file input
                setValue("medicalImages", null);
              }}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue Without Image
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Header
        title="Breast Cancer Risk Assessment"
        subtitle="Answer the questions below or ask a medical professional."
      />

      {apiError && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-center">
          <p className="text-red-400">
            <strong>Error:</strong> {apiError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormSection title="Symptoms Description">
          <TextAreaField
            label="Describe your symptoms (optional):"
            name="symptoms"
            placeholder="e.g. I noticed a hard lump on my right breast 2 weeks ago. It's painless but growing"
            register={register}
            error={errors.symptoms}
            rows={4}
          />
        </FormSection>

        <FormSection title="Assessment Questions">
          <ToggleButton
            label="Do you feel a lump?"
            name="feelLump"
            selectedValue={formData.feelLump}
            onChange={(value) => handleToggleChange("feelLump", value)}
            required
          />
          <ToggleButton
            label="Is the lump painful?"
            name="lumpPainful"
            selectedValue={formData.lumpPainful}
            onChange={(value) => handleToggleChange("lumpPainful", value)}
            required
          />
          <ToggleButton
            label="Does the lump feel stiff?"
            name="lumpStiff"
            selectedValue={formData.lumpStiff}
            onChange={(value) => handleToggleChange("lumpStiff", value)}
            required
          />
        </FormSection>

        {formData.feelLump === "Yes" && (
          <FormSection title="Additional Lump Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField
                label="Hardness of Lump"
                name="hardness"
                options={hardnessOptions}
                placeholder="Select hardness level"
                register={register}
                error={errors.hardness}
                required
              />
              <SelectField
                label="Position of Lump"
                name="position"
                options={positionOptions}
                placeholder="Select lump position"
                register={register}
                error={errors.position}
                required
              />
              <SelectField
                label="Severity of Pain"
                name="painSeverity"
                options={painSeverityOptions}
                placeholder="Select pain severity"
                register={register}
                error={errors.painSeverity}
                required
              />
              <SelectField
                label="Duration of Symptoms"
                name="duration"
                options={durationOptions}
                placeholder="Select duration"
                register={register}
                error={errors.duration}
                required
              />
            </div>
          </FormSection>
        )}

        <FormSection title="File Upload">
          <FileUpload
            label="Upload an image of the affected area"
            name="medicalImages"
            register={register}
            error={errors.medicalImages}
            accept="image/jpeg,image/jpg,image/png"
          />
        </FormSection>

        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`
              w-full max-w-md py-4 px-8 rounded-xl font-bold text-xl
              transition-all duration-200 transform min-h-[56px]
              ${
                !isFormValid || isLoading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-pink-600 text-white hover:bg-pink-700 active:scale-95 sm:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-black shadow-lg shadow-pink-600/25"
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="small" text="" />
                <span className="ml-3">Analyzing...</span>
              </div>
            ) : (
              "Get Assessment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LumpForm;
