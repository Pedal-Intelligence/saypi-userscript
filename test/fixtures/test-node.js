/**
 * Node.js version of cross-realm test (limited - no real cross-realm scenario)
 * This demonstrates the concept but can't create true cross-realm objects in Node.js
 */

console.log('🧪 Cross-Realm ArrayBuffer Detection Test (Node.js)\n');

// Test the detection methods with same-realm objects
function testDetectionMethods() {
  const buffer = new ArrayBuffer(1024);
  const uint8Array = new Uint8Array(512);
  
  console.log('=== Testing Detection Methods ===');
  console.log('ArrayBuffer tests:');
  console.log('  instanceof ArrayBuffer:', buffer instanceof ArrayBuffer);
  console.log('  Object.prototype.toString.call():', Object.prototype.toString.call(buffer));
  console.log('  Cross-realm safe check:', Object.prototype.toString.call(buffer) === "[object ArrayBuffer]");
  
  console.log('\nUint8Array tests:');
  console.log('  instanceof Uint8Array:', uint8Array instanceof Uint8Array);
  console.log('  Object.prototype.toString.call():', Object.prototype.toString.call(uint8Array));
  console.log('  Cross-realm safe check:', Object.prototype.toString.call(uint8Array) === "[object Uint8Array]");
  
  // Test SharedArrayBuffer if available
  if (typeof SharedArrayBuffer !== 'undefined') {
    const sharedBuffer = new SharedArrayBuffer(1024);
    console.log('\nSharedArrayBuffer tests:');
    console.log('  instanceof SharedArrayBuffer:', sharedBuffer instanceof SharedArrayBuffer);
    console.log('  Object.prototype.toString.call():', Object.prototype.toString.call(sharedBuffer));
    console.log('  Cross-realm safe check:', Object.prototype.toString.call(sharedBuffer) === "[object SharedArrayBuffer]");
  } else {
    console.log('\nSharedArrayBuffer not available in this environment');
  }
}

// Simulate the ONNX Runtime detection logic
function simulateONNXRuntimeDetection(arg0, label) {
  console.log(`\n=== ONNX Runtime Detection Simulation: ${label} ===`);
  
  if (typeof arg0 === 'string') {
    console.log('✅ Detected: string path');
  } else if (Object.prototype.toString.call(arg0) === "[object Uint8Array]") {
    console.log('✅ Detected: Uint8Array (cross-realm safe)');
  } else if (Object.prototype.toString.call(arg0) === "[object ArrayBuffer]") {
    console.log('✅ Detected: ArrayBuffer (cross-realm safe)');
  } else if (typeof SharedArrayBuffer !== 'undefined' && Object.prototype.toString.call(arg0) === "[object SharedArrayBuffer]") {
    console.log('✅ Detected: SharedArrayBuffer (cross-realm safe)');
  } else {
    console.log('❌ Error: Unexpected argument type - would throw TypeError');
  }
}

// Run the tests
testDetectionMethods();

// Test with different types
const testCases = [
  { value: new ArrayBuffer(1024), label: 'ArrayBuffer' },
  { value: new Uint8Array(512), label: 'Uint8Array' },
  { value: 'model.onnx', label: 'String path' },
  { value: {}, label: 'Object (should fail)' },
  { value: null, label: 'null (should fail)' }
];

if (typeof SharedArrayBuffer !== 'undefined') {
  testCases.push({ value: new SharedArrayBuffer(1024), label: 'SharedArrayBuffer' });
}

testCases.forEach(testCase => {
  simulateONNXRuntimeDetection(testCase.value, testCase.label);
});

console.log('\n📋 Summary:');
console.log('- Object.prototype.toString.call() provides reliable type detection');
console.log('- This method works consistently across JavaScript realms');
console.log('- In browsers, you can see the cross-realm issue with the HTML test');
console.log('- This fix ensures ONNX Runtime works with buffers from any execution context');

console.log('\n💡 To see the actual cross-realm issue, run the HTML test in a browser!'); 