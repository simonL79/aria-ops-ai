#!/usr/bin/env node

const AUTH_KEY = 'H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0=';
const ARIA_INGEST_URL = 'https://ssvskbejfacmjemphmry.supabase.co/functions/v1/aria-ingest';

async function testAriaIngest() {
  console.log('🔍 Testing ARIA ingest function...');
  
  const testData = {
    content: 'Test content from CLI',
    platform: 'test-platform',
    url: 'https://example.com/test',
    test: true // This will return the payload without inserting
  };
  
  try {
    console.log(`📡 Sending request to ${ARIA_INGEST_URL}`);
    console.log('📦 Payload:', JSON.stringify(testData, null, 2));
    console.log(`🔑 Using key: ${AUTH_KEY}`);
    
    // Send the request
    const response = await fetch(ARIA_INGEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_KEY  // Notice: No "Bearer " prefix
      },
      body: JSON.stringify(testData)
    });
    
    // Get response text for debugging
    const responseText = await response.text();
    
    // Log results
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Response headers:`, Object.fromEntries([...response.headers]));
    
    try {
      // Try to parse as JSON if possible
      const jsonResponse = JSON.parse(responseText);
      console.log('📋 Response:', JSON.stringify(jsonResponse, null, 2));
    } catch (e) {
      // Otherwise show as text
      console.log('📋 Response (text):', responseText);
    }
    
    if (response.ok) {
      console.log('✅ Test successful! The ARIA ingest function is working.');
    } else {
      console.log('❌ Test failed! Check the response for details.');
    }
    
  } catch (error) {
    console.error('❌ Error testing ARIA ingest:', error);
  }
}

testAriaIngest();
