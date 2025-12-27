// Test script for compliance scanner
// Run with: node --loader ts-node/esm test-compliance.ts
// Or just copy the code into your browser console

import { scanCompliance } from './scanner';

console.log('=== Compliance Scanner Tests ===\n');

// Test 1: Email detection
console.log('Test 1: Email');
console.log('Input: "Contact us at support@example.com"');
console.log('Result:', scanCompliance('Contact us at support@example.com'));
console.log('');

// Test 2: Phone number
console.log('Test 2: Phone');
console.log('Input: "Call +1-555-1234-5678"');
console.log('Result:', scanCompliance('Call +1-555-1234-5678'));
console.log('');

// Test 3: Aadhaar pattern
console.log('Test 3: Aadhaar');
console.log('Input: "ID: 1234 5678 9012"');
console.log('Result:', scanCompliance('ID: 1234 5678 9012'));
console.log('');

// Test 4: Credit card
console.log('Test 4: Credit Card');
console.log('Input: "Card: 4532-1234-5678-9010"');
console.log('Result:', scanCompliance('Card: 4532-1234-5678-9010'));
console.log('');

// Test 5: API key
console.log('Test 5: API Key');
console.log('Input: "api_sk_live_1234567890abcdefghijklmnop"');
console.log('Result:', scanCompliance('api_sk_live_1234567890abcdefghijklmnop'));
console.log('');

// Test 6: Multiple issues
console.log('Test 6: Multiple Issues');
console.log('Input: "Email: test@test.com Phone: +1-555-1234"');
console.log('Result:', scanCompliance('Email: test@test.com Phone: +1-555-1234'));
console.log('');

// Test 7: Clean text
console.log('Test 7: Clean Text');
console.log('Input: "Buy now - 50% off!"');
console.log('Result:', scanCompliance('Buy now - 50% off!'));
console.log('');

console.log('=== Browser Console Test ===');
console.log('Copy this to your browser console:\n');
console.log(`
import { scanCompliance } from '@/lib/compliance/scanner';

// Test examples
scanCompliance('Email me at test@example.com'); 
// Expected: ["⚠️ Email address detected — treat as personal data"]

scanCompliance('Call +1-555-1234 or card 4532-1234-5678-9010');
// Expected: ["⚠️ Phone number detected...", "⚠️ Credit card pattern detected..."]

scanCompliance('Hello world');
// Expected: []
`);
