/**
 * Polyfills for React Native environment
 * MUST be imported before any other code
 */

// Polyfill crypto.getRandomValues
import 'react-native-get-random-values';

// Polyfill URL
import 'react-native-url-polyfill/auto';

// Polyfill crypto.randomUUID (not included in react-native-get-random-values)
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  crypto.randomUUID = function randomUUID(): `${string}-${string}-${string}-${string}-${string}` {
    // Generate 16 random bytes
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    
    // Set version (4) and variant (RFC4122)
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC4122
    
    // Convert to hex string with dashes
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}` as `${string}-${string}-${string}-${string}-${string}`;
  };
}

// Also ensure global.crypto exists for any code that accesses it that way
if (typeof global !== 'undefined' && !global.crypto) {
  (global as any).crypto = crypto;
}
