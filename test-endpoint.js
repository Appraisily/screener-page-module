/**
 * Simple script to test the API endpoints structure
 */
const baseUrl = 'https://appraisals-web-services-backend-856401495068.us-central1.run.app';

// Print out the expected endpoint URLs
console.log('API Endpoint Structure:');
console.log(`Base URL: ${baseUrl}`);
console.log(`Upload Endpoint: ${baseUrl}/upload-temp`);
console.log(`Session Endpoint: ${baseUrl}/session/{sessionId}`);
console.log(`Visual Search Endpoint: ${baseUrl}/visual-search/{sessionId}`);
console.log(`Origin Analysis Endpoint: ${baseUrl}/origin-analysis/{sessionId}`);
console.log(`OpenAI Analysis Endpoint: ${baseUrl}/openai-analysis/{sessionId}`);
console.log(`Submit Email Endpoint: ${baseUrl}/submit-email`);
console.log('\nReplace {sessionId} with your actual session ID');
console.log('\nExample API calls using curl:');
console.log(`curl -X POST -F "image=@path/to/image.jpg" ${baseUrl}/upload-temp`);
console.log(`curl ${baseUrl}/session/YOUR_SESSION_ID`);

// Check if a session ID was provided as a command-line argument
const sessionId = process.argv[2];
if (sessionId) {
  console.log('\nYou provided a session ID:', sessionId);
  console.log('You can use these endpoints with your session ID:');
  console.log(`curl ${baseUrl}/session/${sessionId}`);
  console.log(`curl -X POST ${baseUrl}/visual-search/${sessionId}`);
  console.log(`curl ${baseUrl}/origin-analysis/${sessionId}`);
  console.log(`curl -X POST ${baseUrl}/openai-analysis/${sessionId}`);
  console.log(`curl -X POST -H "Content-Type: application/json" -d '{"email":"your@email.com","sessionId":"${sessionId}"}' ${baseUrl}/submit-email`);
} 