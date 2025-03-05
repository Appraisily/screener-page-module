const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { promisify } = require('util');

// Base URL for the API
const baseUrl = 'https://appraisals-web-services-backend-856401495068.us-central1.run.app';

// Function to make a GET request
async function makeGetRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, baseUrl);
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Function to test the /session/{sessionId} endpoint
async function testSessionEndpoint(sessionId) {
  try {
    console.log(`Testing GET /session/${sessionId}`);
    const response = await makeGetRequest(`/session/${sessionId}`);
    console.log('Response status:', response.statusCode);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing session endpoint:', error);
  }
}

// Function to test the API endpoints
async function testApiEndpoints() {
  // Ask the user for the session ID
  const sessionId = process.argv[2];
  
  if (!sessionId) {
    console.error('Please provide a session ID as a command line argument');
    return;
  }
  
  // Test the session endpoint
  await testSessionEndpoint(sessionId);
  
  // Test the visual search endpoint
  try {
    console.log(`Testing POST /visual-search/${sessionId}`);
    // Not implemented yet
    console.log('POST request not implemented in this script');
  } catch (error) {
    console.error('Error testing visual search endpoint:', error);
  }
  
  // Test the origin analysis endpoint
  try {
    console.log(`Testing GET /origin-analysis/${sessionId}`);
    const response = await makeGetRequest(`/origin-analysis/${sessionId}`);
    console.log('Response status:', response.statusCode);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing origin analysis endpoint:', error);
  }
  
  // Test the OpenAI analysis endpoint
  try {
    console.log(`Testing GET /openai-analysis/${sessionId}`);
    // Not implemented yet
    console.log('POST request not implemented in this script');
  } catch (error) {
    console.error('Error testing OpenAI analysis endpoint:', error);
  }
}

// Run the tests
testApiEndpoints(); 