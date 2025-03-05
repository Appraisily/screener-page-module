const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Base URL for the API
const baseUrl = 'https://appraisals-web-services-backend-856401495068.us-central1.run.app';

// Function to test the image upload endpoint
async function testImageUpload(imagePath) {
  return new Promise((resolve, reject) => {
    // Read the image file
    const imageFile = fs.readFileSync(imagePath);
    
    // Generate a boundary string for the multipart/form-data request
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
    
    // Create the multipart/form-data body
    const filename = path.basename(imagePath);
    const contentType = getContentType(imagePath);
    
    // Start with the boundary
    let body = Buffer.from(`--${boundary}\r\n`);
    
    // Add the Content-Disposition header
    body = Buffer.concat([
      body,
      Buffer.from(`Content-Disposition: form-data; name="image"; filename="${filename}"\r\n`),
      Buffer.from(`Content-Type: ${contentType}\r\n\r\n`),
      imageFile,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);
    
    // Set up the request options
    const url = new URL('/upload-temp', baseUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    };
    
    console.log(`Uploading image to ${url.href}`);
    
    // Make the request
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log("Raw response:", data);
        try {
          const parsedData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (e) {
          console.error("Error parsing JSON:", e);
          resolve({ statusCode: res.statusCode, data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(body);
    req.end();
  });
}

// Helper function to determine the content type of a file
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

// Main function to run the upload test
async function main() {
  // Check if an image path was provided
  const imagePath = process.argv[2];
  
  if (!imagePath) {
    console.error('Please provide an image path as a command line argument');
    return;
  }
  
  try {
    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`File not found: ${imagePath}`);
      return;
    }
    
    // Test the image upload endpoint
    console.log(`Testing POST /upload-temp with image: ${imagePath}`);
    const response = await testImageUpload(imagePath);
    console.log('Response status:', response.statusCode);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Extract and display the session ID if available
    if (response.data && response.data.data && response.data.data.sessionId) {
      console.log(`\nSession ID: ${response.data.data.sessionId}`);
      console.log(`\nYou can now use this session ID to test other endpoints with the test-api.js script:`);
      console.log(`node test-api.js ${response.data.data.sessionId}`);
    } else if (response.data && response.data.sessionId) {
      console.log(`\nSession ID: ${response.data.sessionId}`);
      console.log(`\nYou can now use this session ID to test other endpoints with the test-api.js script:`);
      console.log(`node test-api.js ${response.data.sessionId}`);
    }
  } catch (error) {
    console.error('Error testing image upload endpoint:', error);
  }
}

// Run the main function
main(); 