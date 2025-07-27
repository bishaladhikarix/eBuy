import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import './ProfileImageUpload.css';

// Update UserData type to include profileImage
interface UserDataWithImage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
}

const ProfileImageUpload = () => {
  const { user, Token, updateProfile } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Use user's profile image if available
  useEffect(() => {
    if (user && (user as UserDataWithImage).profileImage) {
      const userImagePath = (user as UserDataWithImage).profileImage || '';
      
      // If the path starts with /uploads, use it directly
      // Otherwise, construct the full path
      const imageUrl = userImagePath.startsWith('/uploads') 
        ? userImagePath 
        : `/uploads/profiles/${userImagePath}`;
        
      setPreviewUrl(imageUrl);
      console.log('Loaded existing profile image:', imageUrl);
    }
  }, [user]);

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ 
        type: 'error', 
        text: 'Please select a valid image file (JPG, PNG, GIF, or WEBP)' 
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setMessage({ 
        type: 'error', 
        text: 'File size must be less than 5MB' 
      });
      return;
    }

    setSelectedImage(file);

    // Log both the file name and the /images/ path for clarity
    console.log('Selected image file name:', file.name);
    console.log('Selected image path for backend/frontend:', `/images/${file.name}`);

    // Create preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);

    // Clear any previous messages
    setMessage({ type: '', text: '' });
  };

  // Handle upload/update
  const handleUpload = async () => {
    if (!selectedImage) {
      setMessage({ type: 'error', text: 'Please select an image first' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profileImage', selectedImage);
      
      console.log('=== FRONTEND UPLOAD ===');
      console.log('Uploading file:', {
        name: selectedImage.name,
        size: selectedImage.size,
        type: selectedImage.type
      });
      console.log('Token available:', !!Token);
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Token}`
          // Don't set Content-Type - let browser set it for FormData
        },
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile image');
      }

      console.log('Upload successful:', data);

      // Update user context with the returned image path
      if (data.data && data.data.user && data.data.user.profileImage) {
        const serverImagePath = data.data.user.profileImage;
        
        await updateProfile({
          profileImage: serverImagePath
        });

        // Update preview to use the server URL
        // If path starts with /uploads, use it directly
        // Otherwise, construct the full URL
        const imageUrl = serverImagePath.startsWith('/uploads') 
          ? serverImagePath 
          : `/uploads/profiles/${serverImagePath}`;
          
        setPreviewUrl(imageUrl);
        
        console.log('Image path stored:', serverImagePath);
        console.log('Preview URL set to:', imageUrl);
      }

      setMessage({ 
        type: 'success', 
        text: 'Profile image updated successfully!'
      });

      // Clear the selected file since it's now uploaded
      setSelectedImage(null);
      
    } catch (error: any) {
      console.error('=== UPLOAD ERROR ===');
      console.error('Error details:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile image'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-image-upload">
      <div className="image-preview">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Profile Preview" 
            className="preview"
          />
        ) : (
          <div className="no-image">
            <i className="fa fa-user" aria-hidden="true"></i>
            <p>No image selected</p>
          </div>
        )}
      </div>

      <div className="upload-controls">
        <label className="file-input-label">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <span>Choose Image</span>
        </label>

        <button 
          className="upload-button" 
          onClick={handleUpload}
          disabled={!selectedImage || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Update Profile Image'}
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="image-guidelines">
        <h4>Image Guidelines:</h4>
        <ul>
          <li>Recommended size: 300x300 pixels</li>
          <li>Maximum file size: 5MB</li>
          <li>Supported formats: JPG, PNG, GIF, WEBP</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileImageUpload;
