import * as SecureStore from 'expo-secure-store';

/**
 * Save a value in SecureStore.
 * @param {string} key - The key under which the value is stored.
 * @param {string} value - The value to store.
 */
export async function saveSecureValue(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log(`Value saved under key: ${key}`);
  } catch (error) {
    console.error('Error saving value to SecureStore:', error);
  }
}

/**
 * Retrieve a value from SecureStore.
 * @param {string} key - The key of the value to retrieve.
 * @returns {Promise<string | null>} - The retrieved value or null if not found.
 */
export async function getSecureValue(key: string): Promise<string | null> {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value) {
      console.log(`Value retrieved for key: ${key}`);
      return value;
    } else {
      console.log(`No value found for key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving value from SecureStore:', error);
    return null;
  }
}

/**
 * Delete a value from SecureStore.
 * @param {string} key - The key of the value to delete.
 */
export async function deleteSecureValue(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`Value deleted for key: ${key}`);
  } catch (error) {
    console.error('Error deleting value from SecureStore:', error);
  }
}


saveSecureValue('valentinov', 'api_key_example');