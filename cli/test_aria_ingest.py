
#!/usr/bin/env python3
import requests
import json
from datetime import datetime

# Configuration
AUTH_KEY = 'H7zYd0N6R9xM3bKpLqE1jUvTnZqF5sBgXwPm9QCeLd0='
ARIA_INGEST_URL = 'https://ssvskbejfacmjemphmry.supabase.co/functions/v1/aria-ingest'

def test_aria_ingest():
    print('🔍 Testing ARIA ingest function...')
    
    # Test payload with test=true to avoid actually inserting data
    test_data = {
        "content": "Test content from Python",
        "platform": "test-platform",
        "url": "https://example.com/test",
        "test": True  # This will return the payload without inserting
    }
    
    # Headers - note: send the AUTH_KEY directly without "Bearer " prefix
    headers = {
        "Content-Type": "application/json",
        "Authorization": AUTH_KEY  # This matches the expected format in the edge function
    }
    
    print(f'📡 Sending request to {ARIA_INGEST_URL}')
    print(f'📦 Payload: {json.dumps(test_data, indent=2)}')
    print(f'🔑 Using key: {AUTH_KEY}')
    
    try:
        # Send the request
        response = requests.post(
            ARIA_INGEST_URL,
            headers=headers,
            json=test_data
        )
        
        # Log results
        print(f'📊 Status: {response.status_code} {response.reason}')
        print(f'📄 Response headers: {dict(response.headers)}')
        
        # Try to parse response as JSON
        try:
            response_data = response.json()
            print(f'📋 Response: {json.dumps(response_data, indent=2)}')
        except:
            print(f'📋 Response (text): {response.text}')
        
        if response.ok:
            print('✅ Test successful! The ARIA ingest function is working.')
        else:
            print('❌ Test failed! Check the response for details.')
            
    except Exception as e:
        print(f'❌ Error testing ARIA ingest: {str(e)}')

if __name__ == "__main__":
    test_aria_ingest()
