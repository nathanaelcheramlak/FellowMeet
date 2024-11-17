'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import TextInput from '../../components/TextInput';
import SelectInput from '../../components/SelectInput';
import ImageUpload from '../../components/ImageUpload';

const StepOne = ({ formData, nextStep, handleChange }) => {
  const [error, setError] = useState({});
  const validateForm = () => {
    let newError = {};
    if (!formData.department || !formData.department.trim())
      newError.department = 'Department is required';
    if (!formData.batch || !formData.batch.trim())
      newError.batch = 'Batch is required';
    if (!formData.team || !formData.team.trim())
      newError.team = 'Team is required';
    setError(newError);
    console.log('Validated');
    return Object.keys(newError).length === 0;
  };
  const handleNext = () => {
    if (validateForm()) {
      console.log(formData);
      nextStep();
    }
  };
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        University Info.
      </h2>
      <SelectInput
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        options={[
          { value: 'Computer-Science', label: 'Computer Science' },
          { value: 'Statistics', label: 'Statistics' },
          { value: 'Physics', label: 'Physics' },
          { value: 'Mathematics', label: 'Mathematics' },
          { value: 'Biology', label: 'Biology' },
          { value: 'Chemistry', label: 'Chemistry' },
          { value: 'Geology', label: 'Geology' },
        ]}
        error={error?.department}
        required={true}
      />
      <TextInput
        label="Batch"
        name="batch"
        type="number"
        value={formData.batch}
        placeholder="Eg. 2026"
        onChange={handleChange}
        error={error?.batch}
        required={true}
      />
      <SelectInput
        label="Team"
        name="team"
        value={formData.team}
        onChange={handleChange}
        options={[
          { value: 'Action-Team', label: 'Action Team' },
          { value: 'Bible-Study-Team', label: 'Bible Study Team' },
          { value: 'I4U-Team', label: 'I4U Team' },
          { value: 'Literature-Team', label: 'Literature Team' },
          { value: 'Prayer-Team', label: 'Prayer Team' },
          { value: 'Worship-Team', label: 'Worship Team' },
          { value: 'Just-Member', label: 'Just Member' },
        ]}
        error={error?.team}
        required={true}
      />
      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
      >
        Next
      </button>
    </div>
  );
};

const StepTwo = ({
  formData,
  loading,
  setLoading,
  nextStep,
  prevStep,
  handleChange,
}) => {
  const [error, setError] = useState({});
  const validateForm = () => {
    let newError = {};
    if (!formData.churchName || !formData.churchName.trim())
      newError.churchName = 'Church is required';
    setError(newError);
    return Object.keys(newError).length === 0;
  };
  const handleNext = () => {
    if (validateForm()) {
      console.log(formData);
      nextStep();
    }
  };
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Additional Info.
      </h2>
      <TextInput
        label="Church"
        name="churchName"
        value={formData.churchName}
        onChange={handleChange}
        error={error?.churchName}
        required={true}
      />
      <TextInput
        label="Region"
        name="region"
        value={formData.region}
        onChange={handleChange}
        error={error?.region}
      />
      <TextInput
        label="Favorite Verse"
        name="favVerse"
        value={formData.favVerse}
        onChange={handleChange}
        error={error?.favVerse}
      />
      <div className="flex space-x-4">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const StepThree = ({
  formData,
  setFormData,
  loading,
  setLoading,
  prevStep,
  submitForm,
  handleChange,
  response,
}) => {
  const [error, setError] = useState({});
  const [imgLoading, setImageLoading] = useState(false);

  const validateForm = () => {
    let newError = {};
    if (!formData.phone || !formData.department.trim())
      newError.phone = 'Phone is required';
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (e) => {
    if (!validateForm()) return;
    e.preventDefault();
    setLoading(true);
    try {
      await submitForm(e);
    } catch (error) {
      console.log('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      const newformData = new FormData();
      newformData.append('file', file);
      console.log(newformData);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const response = await axios.post(
          `${apiUrl}/user/upload-img`,
          newformData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
        const imageUrl = response.data?.ImageUrl;
        if (!imageUrl) {
          setError({
            ...error,
            image: "Image couldn't be uploaded. But you can continue.",
          });
        }
        console.log(imageUrl);
        setFormData({ ...formData, image: imageUrl });
        setImageLoading(false);
      } catch (error) {
        console.log('Error uploading Image: ', error);
        setImageLoading(false);
        setError({
          ...error,
          image: "Image couldn't be uploaded. But you can continue.",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">More Info.</h2>
      <TextInput
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={error?.phone}
        required={true}
        type="number"
      />
      <TextInput
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        error={error?.dateOfBirth}
      />
      <TextInput
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        error={error?.bio}
      />
      <ImageUpload onImageChange={handleImageChange} error={error?.image} />

      {imgLoading && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Uploading image...</p>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
        >
          Back
        </button>
        {loading ? (
          <button
            className="bg-green-300 text-white px-6 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
            disabled
          >
            Submitting...
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>
        )}
      </div>
      {response && <p className="text-sm text-red-500 mt-1">{response}</p>}
    </div>
  );
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    team: '',
    region: '',
    department: '',
    batch: '',
    dateOfBirth: '',
    churchName: '',
    favVerse: '',
    bio: '',
    phone: '',
    image: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        setError('An error occurred, try again later.');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log("Couldn't send the data.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {step === 1 && (
          <StepOne
            formData={formData}
            nextStep={nextStep}
            handleChange={handleChange}
          />
        )}
        {step === 2 && (
          <StepTwo
            formData={formData}
            loading={loading}
            setLoading={setLoading}
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
          />
        )}
        {step === 3 && (
          <StepThree
            response={error}
            formData={formData}
            loading={loading}
            setLoading={setLoading}
            setFormData={setFormData}
            prevStep={prevStep}
            submitForm={submitForm}
            handleChange={handleChange}
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
