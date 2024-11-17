'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextInput from '../../components/TextInput';
import SelectInput from '../../components/SelectInput';
import ImageUpload from '../../components/ImageUpload';

const EditProfile = () => {
  const [user, setUser] = useState({
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
  const [errors, setErrors] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authResponse = await fetch(
          'http://localhost:5000/api/auth/verify',
          {
            credentials: 'include',
          },
        );

        if (!authResponse.ok) {
          throw new Error('Authentication failed');
        }

        const { user: authUser } = await authResponse.json();
        const { _id: userId } = authUser;

        const userResponse = await fetch(
          `http://localhost:5000/api/user/${userId}`,
          {
            credentials: 'include',
          },
        );

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUser(userData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(
          'http://localhost:5000/api/user/upload-img',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
        const imageUrl = response.data?.ImageUrl;
        if (imageUrl) {
          setUser((prev) => ({ ...prev, image: imageUrl }));
        } else {
          setErrors({
            image: "Image couldn't be uploaded. But you can continue.",
          });
        }
        setImageLoading(false);
      } catch (error) {
        setImageLoading(false);
        console.log('Error uploading Image: ', error);
      }
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!user.team || !user.team.trim()) newErrors.team = 'Select a Team';
    if (!user.department || !user.department.trim())
      newErrors.department = 'Department is required';
    if (!user.batch) newErrors.batch = 'Batch is required';
    if (!user.churchName || !user.churchName.trim())
      newErrors.churchName = 'Church is required.';
    if (!user.phone || !user.phone.trim())
      newErrors.phone = 'Phone is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors({ form: data.error || 'Error updating user.' });
        return;
      }

      router.push('/');
    } catch (error) {
      console.log("Couldn't send the data.", error);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  return pageLoading ? (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex justify-center items-center h-32">
        <div className="loader ease-linear rounded-full border-4 border-blue-500 border-t-white h-12 w-12 animate-spin"></div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectInput
            label="Team"
            name="team"
            value={user.team}
            onChange={handleChange}
            options={[
              { value: 'Worship-Team', label: 'Worship Team' },
              { value: 'Prayer-Team', label: 'Prayer Team' },
              { value: 'Bible-Study-Team', label: 'Bible Study Team' },
              { value: 'I4U-Team', label: 'I4U Team' },
              { value: 'Literature-Team', label: 'Literature Team' },
              { value: 'Just-Member', label: 'Just Member' },
            ]}
            error={errors.team}
            required
          />
          <SelectInput
            label="Department"
            name="department"
            value={user.department}
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
            error={errors.department}
            required
          />
          <TextInput
            label="Batch"
            name="batch"
            type="number"
            value={user.batch}
            onChange={handleChange}
            error={errors.batch}
            required
          />
          <TextInput
            label="Phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />
          <TextInput
            label="Region"
            name="region"
            value={user.region}
            onChange={handleChange}
            error={errors.region}
          />
          <TextInput
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={user.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />
          <TextInput
            label="Church"
            name="churchName"
            value={user.churchName}
            onChange={handleChange}
            error={errors.churchName}
            required
          />
          <TextInput
            label="Favorite Verse"
            name="favVerse"
            value={user.favVerse}
            onChange={handleChange}
            error={errors.favVerse}
          />
          <TextInput
            label="Bio"
            name="bio"
            value={user.bio}
            onChange={handleChange}
            error={errors.bio}
          />
          <ImageUpload onImageChange={handleImageChange} error={errors.image} />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300 ease-in-out"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Editing Profile...' : 'Edit Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
