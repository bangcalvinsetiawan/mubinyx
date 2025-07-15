'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';

interface KycData {
  id?: string;
  documentType: string;
  documentNumber: string;
  status: string;
  rejectionReason?: string;
  verifiedAt?: string;
  documentUrl?: string;
  selfieUrl?: string;
}

export default function KycUpload() {
  const { user } = useAuthStore();
  const [kycData, setKycData] = useState<KycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    documentType: 'NATIONAL_ID',
    documentNumber: ''
  });

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3010/kyc/my-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setKycData(data);
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile || !selfieFile) {
      alert('Please upload both document and selfie');
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('documentType', formData.documentType);
      formDataToSubmit.append('documentNumber', formData.documentNumber);
      formDataToSubmit.append('document', documentFile);
      formDataToSubmit.append('selfie', selfieFile);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3010/kyc/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        alert('KYC submitted successfully! Please wait for admin approval.');
        fetchKycStatus();
        setDocumentFile(null);
        setSelfieFile(null);
        setFormData({ documentType: 'NATIONAL_ID', documentNumber: '' });
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      alert('Error submitting KYC. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'APPROVED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">KYC Verification</h2>
          <p className="text-gray-600">Upload your identification documents for account verification</p>
        </div>

        <div className="p-6">
          {/* Current Status */}
          {kycData && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(kycData.status)}`}>
                  {kycData.status}
                </span>
                {kycData.status === 'APPROVED' && kycData.verifiedAt && (
                  <span className="text-sm text-gray-600">
                    Verified on {new Date(kycData.verifiedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {kycData.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{kycData.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          {/* Upload Form */}
          {(!kycData || kycData.status === 'REJECTED') && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="NATIONAL_ID">National ID (KTP)</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter document number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Photo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="document-upload"
                      required
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      {documentFile ? (
                        <div>
                          <div className="text-green-600 mb-2">✓ File selected</div>
                          <p className="text-sm text-gray-600">{documentFile.name}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-gray-400 mb-2">📄</div>
                          <p className="text-sm text-gray-600">Click to upload document photo</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selfie Photo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="selfie-upload"
                      required
                    />
                    <label htmlFor="selfie-upload" className="cursor-pointer">
                      {selfieFile ? (
                        <div>
                          <div className="text-green-600 mb-2">✓ File selected</div>
                          <p className="text-sm text-gray-600">{selfieFile.name}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-gray-400 mb-2">🤳</div>
                          <p className="text-sm text-gray-600">Click to upload selfie</p>
                          <p className="text-xs text-gray-400">Hold document next to your face</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Important Guidelines:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure document is clear and all text is readable</li>
                  <li>• Take selfie in good lighting</li>
                  <li>• Hold document next to your face in the selfie</li>
                  <li>• File size should not exceed 5MB</li>
                  <li>• Only JPG, PNG formats are accepted</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={submitting || !documentFile || !selfieFile}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit KYC'
                  )}
                </motion.button>
              </div>
            </form>
          )}

          {/* Approved Status */}
          {kycData && kycData.status === 'APPROVED' && (
            <div className="text-center py-8">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">KYC Verified</h3>
              <p className="text-gray-600">Your account has been successfully verified</p>
            </div>
          )}

          {/* Pending Status */}
          {kycData && kycData.status === 'PENDING' && (
            <div className="text-center py-8">
              <div className="text-yellow-600 text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Under Review</h3>
              <p className="text-gray-600">Your KYC submission is being reviewed by our team</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
