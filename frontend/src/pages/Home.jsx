import React, { useState, useRef } from 'react';
import { Camera, Upload, Info, Shield, Bell, FileText } from 'lucide-react';
import '../style/HomeCSS.css'
import NavBar from '../components/NavBar.jsx';

export default function AssetlyHomepage() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      // Handle file upload logic here
    }
  };

  return (
    <div className="assetly-container">
      <NavBar />
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Never Miss a Warranty Again</h1>
        <p className="hero-subtitle">
          Upload your bills and warranty cards, and we'll track everything for you. 
          Get notified before warranties expire and manage all your assets in one place.
        </p>

        <div className="upload-section">
          <div className="upload-button" onClick={handleCameraClick}>
            <Camera size={48} className="upload-icon" />
            <span className="upload-text">Take Photo</span>
            <span className="upload-subtext">Capture with camera</span>
          </div>

          <div className="upload-button" onClick={handleUploadClick}> 
            <Upload size={48} className="upload-icon" />
            <span className="upload-text">Upload Photo</span>
            <span className="upload-subtext">Choose from gallery</span>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <h2 className="section-title">Why Choose Assetly?</h2>
        <div className="info-cards">
          <div className="info-card">
            <Shield size={48} className="info-card-icon" />
            <h3 className="info-card-title">Warranty Tracking</h3>
            <p className="info-card-text">
              Automatically extract warranty information from your documents and get reminders before they expire.
            </p>
          </div>

          <div className="info-card">
            <Bell size={48} className="info-card-icon" />
            <h3 className="info-card-title">Smart Notifications</h3>
            <p className="info-card-text">
              Receive timely alerts about upcoming warranty expirations so you never miss an important date.
            </p>
          </div>

          <div className="info-card">
            <FileText size={48} className="info-card-icon" />
            <h3 className="info-card-title">Easy Complaints</h3>
            <p className="info-card-text">
              Raise and track complaints directly from the app with all your warranty details at your fingertips.
            </p>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="how-to-section">
        <h2 className="section-title">How to Use Assetly</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Take or Upload Photo</h3>
              <p>
                Simply snap a picture of your bill, receipt, or warranty card using your camera, 
                or upload an existing image from your device.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Automatic Data Extraction</h3>
              <p>
                Our smart AI technology automatically extracts all relevant information including 
                product details, purchase date, warranty period, and more.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>View on Dashboard</h3>
              <p>
                Access all your assets in one organized dashboard. See warranty statuses, 
                expiration dates, and manage your items effortlessly.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Get Notified & Take Action</h3>
              <p>
                Receive notifications before warranties expire and raise complaints directly 
                through the app when needed. Stay protected always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h3 className="footer-title">Assetly</h3>
          <p className="footer-text">
            Your smart assistant for managing warranties and assets
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">About</a>
          </div>
          <p className="footer-text" style={{ marginTop: '2rem' }}>
            © 2024 Assetly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}