/**
 * Upload an image using Cloudinary Upload Widget (Free tier)
 * No backend required - uploads directly from browser
 * 
 * Setup:
 * 1. Sign up at https://cloudinary.com (free)
 * 2. Get your cloud name from dashboard
 * 3. Enable unsigned uploads in Settings → Upload
 * 4. Create an upload preset (unsigned)
 */

declare global {
  interface Window {
    cloudinary: any;
  }
}

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'demo';
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

// Load Cloudinary widget script once when module loads
let scriptLoaded = false;
let scriptLoading = false;
const scriptCallbacks: Array<() => void> = [];

function loadCloudinaryScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scriptLoaded) {
      resolve();
      return;
    }

    if (scriptLoading) {
      scriptCallbacks.push(resolve);
      return;
    }

    scriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      scriptCallbacks.forEach(cb => cb());
      scriptCallbacks.length = 0;
    };
    script.onerror = () => {
      scriptLoading = false;
      reject(new Error('Failed to load Cloudinary widget'));
    };
    document.body.appendChild(script);
  });
}

/**
 * Open Cloudinary upload widget and return the uploaded image URL
 */
export const uploadCarImage = async (): Promise<string> => {
  try {
    // Ensure script is loaded
    await loadCloudinaryScript();

    return new Promise((resolve, reject) => {
      if (!window.cloudinary) {
        reject(new Error('Cloudinary widget not available'));
        return;
      }

      console.log('Creating Cloudinary widget with:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET
      });

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ['local'],
          multiple: false,
          maxFileSize: 5000000, // 5MB
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp']
        },
        (error: any, result: any) => {
          console.log('Cloudinary event:', result?.event, error);
          
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(error.message || JSON.stringify(error)));
            widget.close();
            return;
          }

          if (result.event === 'success') {
            console.log('Upload successful:', result.info.secure_url);
            resolve(result.info.secure_url);
            widget.close();
          } else if (result.event === 'close') {
            console.warn('Upload widget closed');
            reject(new Error('Upload cancelled'));
          }
        }
      );

      widget.open();
    });
  } catch (error) {
    console.error('Error loading Cloudinary:', error);
    throw error;
  }
}
