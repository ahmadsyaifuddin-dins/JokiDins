const express = require('express');
const router = express.Router();
const { formidable } = require('formidable');
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

router.post('/upload', async (req, res) => {
  // Create formidable form parser
  const form = formidable({ 
    multiples: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB max file size
    keepExtensions: true
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Failed to parse file upload' });
    }

    // Detailed logging to understand file object
    console.log('Parsed files:', JSON.stringify(files, null, 2));
    console.log('Parsed fields:', JSON.stringify(fields, null, 2));

    // Get the uploaded file
    const file = files.photo?.[0] || files.photo; // Handle different formidable versions
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    try {
      // Validate file type using mimetype from file object
      const mimeType = file.mimetype || file.type;
      if (!mimeType || !mimeType.startsWith('image/')) {
        return res.status(400).json({ error: 'Only image files are allowed' });
      }

      // Get filepath from different possible properties
      const filePath = file.filepath || file.path;
      if (!filePath) {
        return res.status(400).json({ error: 'Unable to locate uploaded file' });
      }

      // Read file content
      const fileContent = await fs.promises.readFile(filePath);

      // Generate a unique filename
      const originalFileName = file.originalFilename || file.name || 'profile';
      const fileName = `profile-${Date.now()}${path.extname(originalFileName)}`;

      // Upload to Vercel Blob
      const blob = await put(fileName, fileContent, {
        access: 'public',
        addRandomSuffix: false,
        contentType: mimeType,
        path: 'photo_profile'
      });

      // Return the public URL of the uploaded file
      return res.status(200).json({ 
        url: blob.url,
        downloadUrl: blob.downloadUrl 
      });
    } catch (uploadError) {
      console.error('Error uploading file:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file', details: uploadError.message });
    } finally {
      // Clean up temporary file
      try {
        const filePath = file.filepath || file.path;
        if (filePath) {
          await fs.promises.unlink(filePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
  });
});

module.exports = router;