import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bill-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
    }
  }
});

// Helper function to parse warranty information
const parseWarrantyInfo = (text) => {
  const warrantyPatterns = {
    // Date patterns (DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY, etc.)
    dates: /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g,
    
    // Amount patterns (Rs., INR, ₹)
    amounts: /(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{2})?/gi,
    
    // Warranty period (1 year, 2 months, etc.)
    warrantyPeriod: /(\d+)\s*(year|month|yr|mon|years|months)/gi,
    
    // Phone numbers (10 digits or formatted)
    phones: /\b\d{10}\b|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    
    // Email addresses
    emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    
    // Invoice/Bill number
    invoice: /(?:invoice|bill|receipt)[\s#:no.]*([A-Z0-9-]+)/gi,
    
    // GST Number
    gst: /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}\b/g,
  };

  const extractedData = {
    fullText: text,
    dates: [...new Set(text.match(warrantyPatterns.dates) || [])],
    amounts: [...new Set(text.match(warrantyPatterns.amounts) || [])],
    warrantyPeriods: [...new Set(text.match(warrantyPatterns.warrantyPeriod) || [])],
    phones: [...new Set(text.match(warrantyPatterns.phones) || [])],
    emails: [...new Set(text.match(warrantyPatterns.emails) || [])],
    gstNumbers: [...new Set(text.match(warrantyPatterns.gst) || [])],
    invoiceNumbers: []
  };

  // Extract invoice numbers
  let invoiceMatch;
  const invoiceRegex = /(?:invoice|bill|receipt)[\s#:no.]*([A-Z0-9-]+)/gi;
  while ((invoiceMatch = invoiceRegex.exec(text)) !== null) {
    extractedData.invoiceNumbers.push(invoiceMatch[1]);
  }

  // Remove duplicates
  extractedData.invoiceNumbers = [...new Set(extractedData.invoiceNumbers)];

  return extractedData;
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Assetly OCR Backend API is running (Tesseract OCR)',
    endpoints: {
      extractText: 'POST /api/extract-text',
      extractTextEnhanced: 'POST /api/extract-text-enhanced',
      health: 'GET /'
    },
    ocrEngine: 'Tesseract.js (Free & Open Source)'
  });
});

// Extract text from image using Tesseract OCR
app.post('/api/extract-text', upload.single('image'), async (req, res) => {
  console.log('Received request to /api/extract-text');
  
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ 
      success: false, 
      error: 'No image file uploaded' 
    });
  }

  const filePath = req.file.path;
  console.log('File uploaded:', filePath);

  try {
    console.log('Starting Tesseract OCR...');

    // Perform OCR using Tesseract.js
    const { data: { text, confidence } } = await Tesseract.recognize(
      filePath,
      'eng', // Language: English (you can add more languages like 'eng+hin' for Hindi)
      {
        logger: (m) => {
          // Log progress
          if (m.status === 'recognizing text') {
            console.log(`Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    console.log('OCR completed with confidence:', confidence);

    if (!text || text.trim().length === 0) {
      // Delete the uploaded file
      fs.unlinkSync(filePath);
      
      return res.status(200).json({
        success: true,
        text: '',
        extractedData: null,
        confidence: 0,
        message: 'No text found in the image'
      });
    }

    // Parse warranty information
    const extractedData = parseWarrantyInfo(text);

    console.log('Text extracted successfully');
    console.log('Extracted text length:', text.length);

    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      text: text.trim(),
      extractedData: extractedData,
      confidence: Math.round(confidence),
      message: 'Text extracted successfully using Tesseract OCR'
    });

  } catch (error) {
    console.error('Error processing image:', error);

    // Delete the uploaded file in case of error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to extract text from image',
      details: error.message
    });
  }
});

// Enhanced OCR with preprocessing (better accuracy)
app.post('/api/extract-text-enhanced', upload.single('image'), async (req, res) => {
  console.log('Received request to /api/extract-text-enhanced');
  
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'No image file uploaded' 
    });
  }

  const filePath = req.file.path;

  try {
    console.log('Processing image with enhanced OCR:', filePath);

    // Create a worker for better performance
    const worker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });

    // Set parameters for better accuracy
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@.,-/₹Rs ',
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
    });

    const { data: { text, confidence } } = await worker.recognize(filePath);
    await worker.terminate();

    if (!text || text.trim().length === 0) {
      fs.unlinkSync(filePath);
      return res.status(200).json({
        success: true,
        text: '',
        extractedData: null,
        confidence: 0,
        message: 'No text found in the image'
      });
    }

    const extractedData = parseWarrantyInfo(text);

    console.log('Enhanced OCR completed');
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      text: text.trim(),
      extractedData: extractedData,
      confidence: Math.round(confidence),
      message: 'Text extracted successfully with enhanced OCR'
    });

  } catch (error) {
    console.error('Error processing image:', error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({
      success: false,
      error: 'Failed to extract text from image',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      });
    }
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Assetly OCR Backend running on http://localhost:${PORT}`);
  console.log(`📸 Ready to process images with Tesseract OCR (FREE)`);
  console.log(`🔥 No API costs - 100% Open Source!`);
});