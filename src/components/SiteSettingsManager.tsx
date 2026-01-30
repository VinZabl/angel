import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, X, Lock, Eye, EyeOff } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';
import { supabase } from '../lib/supabase';

interface SiteSettingsManagerProps {
  onSave?: (saveHandler: () => Promise<void>, isUploading: boolean) => void;
}

const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({ onSave }) => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: '',
    footer_social_1: '',
    footer_social_2: '',
    footer_social_3: '',
    footer_social_4: '',
    footer_support_url: '',
    order_option: 'order_via_messenger' as 'order_via_messenger' | 'place_order',
    checkout_policy_message: '',
    checkout_policy_enabled: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  // Hero images state
  const [heroImages, setHeroImages] = useState<{
    hero_image_1: string;
    hero_image_2: string;
    hero_image_3: string;
    hero_image_4: string;
    hero_image_5: string;
  }>({
    hero_image_1: '',
    hero_image_2: '',
    hero_image_3: '',
    hero_image_4: '',
    hero_image_5: '',
  });
  const [heroFiles, setHeroFiles] = useState<{[key: string]: File | null}>({
    hero_image_1: null,
    hero_image_2: null,
    hero_image_3: null,
    hero_image_4: null,
    hero_image_5: null,
  });
  
  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        footer_social_1: siteSettings.footer_social_1 || '',
        footer_social_2: siteSettings.footer_social_2 || '',
        footer_social_3: siteSettings.footer_social_3 || '',
        footer_social_4: siteSettings.footer_social_4 || '',
        footer_support_url: siteSettings.footer_support_url || '',
        order_option: siteSettings.order_option || 'order_via_messenger',
        checkout_policy_message: siteSettings.checkout_policy_message || '',
        checkout_policy_enabled: siteSettings.checkout_policy_enabled !== false,
      });
      setLogoPreview(siteSettings.site_logo);
      setHeroImages({
        hero_image_1: siteSettings.hero_image_1 || '',
        hero_image_2: siteSettings.hero_image_2 || '',
        hero_image_3: siteSettings.hero_image_3 || '',
        hero_image_4: siteSettings.hero_image_4 || '',
        hero_image_5: siteSettings.hero_image_5 || '',
      });
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageChange = (imageKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFiles(prev => ({ ...prev, [imageKey]: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeroImages(prev => ({ ...prev, [imageKey]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveHeroImage = (imageKey: string) => {
    setHeroImages(prev => ({ ...prev, [imageKey]: '' }));
    setHeroFiles(prev => ({ ...prev, [imageKey]: null }));
  };

  // Use refs to store current values for the save handler
  const formDataRef = useRef(formData);
  const logoPreviewRef = useRef(logoPreview);
  const logoFileRef = useRef(logoFile);
  const heroImagesRef = useRef(heroImages);
  const heroFilesRef = useRef(heroFiles);

  // Keep refs updated
  useEffect(() => {
    formDataRef.current = formData;
    logoPreviewRef.current = logoPreview;
    logoFileRef.current = logoFile;
    heroImagesRef.current = heroImages;
    heroFilesRef.current = heroFiles;
  }, [formData, logoPreview, logoFile, heroImages, heroFiles]);

  const handleSave = useCallback(async () => {
    try {
      let logoUrl = logoPreviewRef.current;
      
      // Upload new logo if selected
      if (logoFileRef.current) {
        const uploadedUrl = await uploadImage(logoFileRef.current, 'site-logo');
        logoUrl = uploadedUrl;
      }

      // Upload hero images if selected
      const heroImageUrls: Record<string, string> = { ...heroImagesRef.current };
      for (const key of Object.keys(heroFilesRef.current)) {
        const file = heroFilesRef.current[key as keyof typeof heroFilesRef.current];
        if (file) {
          const uploadedUrl = await uploadImage(file, 'hero-images');
          heroImageUrls[key] = uploadedUrl;
        }
      }

      const currentFormData = formDataRef.current;
      
      // Update all settings
      await updateSiteSettings({
        site_name: currentFormData.site_name,
        site_description: currentFormData.site_description,
        currency: currentFormData.currency,
        currency_code: currentFormData.currency_code,
        site_logo: logoUrl,
        footer_social_1: currentFormData.footer_social_1,
        footer_social_2: currentFormData.footer_social_2,
        footer_social_3: currentFormData.footer_social_3,
        footer_social_4: currentFormData.footer_social_4,
        footer_support_url: currentFormData.footer_support_url,
        order_option: currentFormData.order_option,
        checkout_policy_message: currentFormData.checkout_policy_message,
        checkout_policy_enabled: currentFormData.checkout_policy_enabled,
        hero_image_1: heroImageUrls.hero_image_1,
        hero_image_2: heroImageUrls.hero_image_2,
        hero_image_3: heroImageUrls.hero_image_3,
        hero_image_4: heroImageUrls.hero_image_4,
        hero_image_5: heroImageUrls.hero_image_5,
      });

      setLogoFile(null);
      setHeroFiles({
        hero_image_1: null,
        hero_image_2: null,
        hero_image_3: null,
        hero_image_4: null,
        hero_image_5: null,
      });
    } catch (error) {
      console.error('Error saving site settings:', error);
    }
  }, [uploadImage, updateSiteSettings]);

  // Store handleSave in ref so we can pass a stable wrapper to parent
  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;
  const stableSaveWrapper = useCallback(() => handleSaveRef.current(), []);

  // Expose save handler to parent - only when uploading changes to avoid infinite loop
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  useEffect(() => {
    if (onSaveRef.current) {
      onSaveRef.current(stableSaveWrapper, uploading);
    }
  }, [stableSaveWrapper, uploading]);

  // Password change handlers
  const handlePasswordInputChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    setIsChangingPassword(true);

    try {
      // Validation
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('All fields are required');
        setIsChangingPassword(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long');
        setIsChangingPassword(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match');
        setIsChangingPassword(false);
        return;
      }

      // Fetch current password from database
      const { data: currentPasswordData, error: fetchError } = await supabase
        .from('site_settings')
        .select('value')
        .eq('id', 'admin_password')
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch current password');
      }

      const currentPassword = currentPasswordData?.value || 'Diginix@Admin!2025';

      // Verify current password
      if (passwordData.currentPassword !== currentPassword) {
        setPasswordError('Current password is incorrect');
        setIsChangingPassword(false);
        return;
      }

      // Update password in database
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ value: passwordData.newPassword })
        .eq('id', 'admin_password');

      if (updateError) {
        throw new Error('Failed to update password');
      }

      // Success
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordSection(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-6">
        {/* Site Logo */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Site Logo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Site Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-gray-400">☕</div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Logo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Site Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            name="site_name"
            value={formData.site_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter site name"
          />
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Site Description
          </label>
          <textarea
            name="site_description"
            value={formData.site_description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter site description"
          />
        </div>

        {/* Currency Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Currency Symbol
            </label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="e.g., ₱, $, €"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Currency Code
            </label>
            <input
              type="text"
              name="currency_code"
              value={formData.currency_code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="e.g., PHP, USD, EUR"
            />
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xs font-semibold text-black mb-4">Footer Links</h3>
          <p className="text-xs text-gray-600 mb-4">
            Configure social media links and customer support link for the footer. Leave blank to hide an item.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Social Media Link 1 (Facebook)</label>
              <input
                type="text"
                name="footer_social_1"
                value={formData.footer_social_1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Social Media Link 2 (Instagram)</label>
              <input
                type="text"
                name="footer_social_2"
                value={formData.footer_social_2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://instagram.com/yourhandle"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Social Media Link 3 (Twitter/X)</label>
              <input
                type="text"
                name="footer_social_3"
                value={formData.footer_social_3}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://x.com/yourhandle"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Social Media Link 4 (YouTube)</label>
              <input
                type="text"
                name="footer_social_4"
                value={formData.footer_social_4}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Customer Support Link</label>
              <input
                type="text"
                name="footer_support_url"
                value={formData.footer_support_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="https://example.com/support or tel:+639xxxxxxxxx"
              />
            </div>
          </div>
        </div>

        {/* Order Option */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xs font-semibold text-black mb-4">Order Option</h3>
          <p className="text-xs text-gray-600 mb-4">
            Choose how customers can place orders. "Order via Messenger" shows receipt upload, copy message, and messenger button. "Place Order" shows only receipt upload and place order button.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Order Method
              </label>
              <select
                name="order_option"
                value={formData.order_option}
                onChange={(e) => setFormData(prev => ({ ...prev, order_option: e.target.value as 'order_via_messenger' | 'place_order' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="order_via_messenger">Order via Messenger</option>
                <option value="place_order">Place Order</option>
              </select>
            </div>
          </div>
        </div>

        {/* Checkout Policy / Consent Message */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xs font-semibold text-black mb-4">Checkout Policy / Consent (Top Up Page)</h3>
          <p className="text-xs text-gray-600 mb-4">
            Optional consent message shown when customers click Checkout and land on the Top Up page. They must Accept to continue or Reject to return to cart. Use the toggle to turn the policy modal on or off without changing the message.
          </p>
          <div className="flex items-center justify-between gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            <label htmlFor="checkout_policy_enabled" className="text-xs font-medium text-gray-700 cursor-pointer">
              Show policy consent modal at checkout
            </label>
            <button
              type="button"
              id="checkout_policy_enabled"
              role="switch"
              aria-checked={formData.checkout_policy_enabled}
              onClick={() => setFormData(prev => ({ ...prev, checkout_policy_enabled: !prev.checkout_policy_enabled }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                formData.checkout_policy_enabled ? 'bg-red-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.checkout_policy_enabled ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Policy / Consent Message
            </label>
            <textarea
              name="checkout_policy_message"
              value={formData.checkout_policy_message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="e.g. By proceeding, you agree to our terms. Payment must be made within 24 hours. Refunds are subject to our policy."
            />
          </div>
        </div>

        {/* Hero Slideshow Images */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xs font-semibold text-black mb-4">Hero Slideshow (Customer Page)</h3>
          <p className="text-xs text-gray-600 mb-4">
            Upload up to 5 images for the hero slideshow. These will be displayed on the customer page when viewing "All" categories. Images will auto-rotate every 5 seconds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['hero_image_1', 'hero_image_2', 'hero_image_3', 'hero_image_4', 'hero_image_5'] as const).map((imageKey, index) => (
              <div key={imageKey} className="border border-gray-200 rounded-lg p-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Hero Image {index + 1}
                </label>
                {heroImages[imageKey] ? (
                  <div className="relative w-full aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={heroImages[imageKey]}
                      alt={`Hero ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHeroImage(imageKey)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-[21/9] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroImageChange(imageKey, e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Password Change Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-gray-600" />
              <h3 className="text-xs font-semibold text-black">Admin Password</h3>
            </div>
            {!showPasswordSection && (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </button>
            )}
          </div>

          {showPasswordSection && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="admin_current_password"
                    autoComplete="off"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter current admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="admin_new_password"
                    autoComplete="new-password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter new password (min. 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="admin_confirm_password"
                    autoComplete="new-password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleCancelPasswordChange}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
