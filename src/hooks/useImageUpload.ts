import { useState } from 'react';
import { supabase } from '../lib/supabase';

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.82;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/** Resize and compress image in browser to reduce cached egress. */
async function resizeAndCompressImage(file: File): Promise<File> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      let w = width;
      let h = height;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width >= height) {
          w = MAX_DIMENSION;
          h = Math.round((height / width) * MAX_DIMENSION);
        } else {
          h = MAX_DIMENSION;
          w = Math.round((width / height) * MAX_DIMENSION);
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const quality = outputType === 'image/jpeg' ? JPEG_QUALITY : 0.9;
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const out = new File([blob], file.name, { type: outputType });
          resolve(out);
        },
        outputType,
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File, bucket: string = 'menu-images'): Promise<string> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('Image size must be less than 5MB');
      }

      const fileToUpload = await resizeAndCompressImage(file);

      const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
      const prefix = bucket === 'payment-receipts' ? 'receipt' : '';
      const fileName = prefix 
        ? `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        : `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileToUpload, {
          cacheControl: '31536000',
          upsert: false,
          contentType: fileToUpload.type
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteImage = async (imageUrl: string, bucket: string = 'menu-images'): Promise<void> => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    uploadProgress
  };
};