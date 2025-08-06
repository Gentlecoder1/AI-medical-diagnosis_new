import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ToggleButton from './ToggleButton';
import TextAreaField from './TextAreaField';
import SelectField from './SelectField';
import FileUpload from './FileUpload';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';
import Header from './Header';
import FormSection from './FormSection';
import { submitDiagnosisData } from '../services/diagnosisApi';

const LumpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    symptoms: '',
    feelLump: '',
    lumpPainful: '',
    lumpStiff: ''
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    mode: 'onChange'
  });

  const hardnessOptions = [
    { value: 'soft', label: 'Soft' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const painSeverityOptions = [
    { value: 'none', label: 'None' },
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' }
  ];

  const positionOptions = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'nipple_area', label: 'Nipple Area' }
  ];

  const durationOptions = [
    { value: '1-3 days', label: '1-3 days' },
    { value: '4-7 days', label: '4-7 days (1 week)' },
    { value: '1-2 weeks', label: '1-2 weeks' },
    { value: '3-4 weeks', label: '3-4 weeks (1 month)' },
    { value: '1-3 months', label: '1-3 months' },
    { value: '3-6 months', label: '3-6 months' },
    { value: '6-12 months', label: '6-12 months' },
    { value: 'over 1 year', label: 'Over 1 year' }
  ];

  const isFormValid = formData.feelLump !== '' && formData.lumpPainful !== '' && formData.lumpStiff !== '';

  const handleToggleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValue(field, value);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const submissionData = {
        ...data,
        ...formData,
        medicalImages: data.medicalImages && data.medicalImages.length > 0 ? data.medicalImages[0] : null
      };

      const response = await submitDiagnosisData(submissionData);
      setResult(response);
    } catch (error) {
      setApiError(error.message || 'An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
    setApiError(null);
    setFormData({
      symptoms: '',
      feelLump: '',
      lumpPainful: '',
      lumpStiff: ''
    });
  };

  if (result) {
    return <ResultDisplay result={result} onReset={handleReset} />;
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
            onChange={(value) => handleToggleChange('feelLump', value)}
            required
          />
          <ToggleButton
            label="Is the lump painful?"
            name="lumpPainful"
            selectedValue={formData.lumpPainful}
            onChange={(value) => handleToggleChange('lumpPainful', value)}
            required
          />
          <ToggleButton
            label="Does the lump feel stiff?"
            name="lumpStiff"
            selectedValue={formData.lumpStiff}
            onChange={(value) => handleToggleChange('lumpStiff', value)}
            required
          />
        </FormSection>

        {formData.feelLump === 'Yes' && (
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
              ${!isFormValid || isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700 active:scale-95 sm:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-black shadow-lg shadow-pink-600/25'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="small" text="" />
                <span className="ml-3">Analyzing...</span>
              </div>
            ) : (
              'Get Assessment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LumpForm;
