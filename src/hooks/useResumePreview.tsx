
import { useState, useEffect } from 'react';

export const useResumePreview = (resumeData: any) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  // Auto-save changes to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [resumeData]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error loading saved resume data:', error);
      }
    }
  }, []);

  return {
    previewVisible,
    setPreviewVisible,
  };
};
