/**
 * Convertit des coordonnées GPS en adresse en utilisant l'API Nominatim
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<{city: string, postcode: string}>}
 */
export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    
    return {
      city: data.address.city || data.address.village || data.address.town,
      postcode: data.address.postcode
    };
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    return null;
  }
}; 