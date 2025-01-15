/**
 * Converts GPS coordinates to an address using OpenStreetMap's Nominatim API.
 * This function performs a reverse geocoding request to obtain address information
 * corresponding to a geographic point.
 * 
 * @param {number} lat - Latitude of the geographic point (between -90 and 90 degrees)
 * @param {number} lon - Longitude of the geographic point (between -180 and 180 degrees)
 * @returns {Promise<{
 *   city: string,    - Name of the city, village, or municipality
 *   postcode: string - Postal code of the locality
 * }>} An object containing address information, or null in case of error
 * @throws {Error} If the Nominatim API request fails
 * 
 * @example
 * // Usage example
 * try {
 *   const address = await reverseGeocode(48.8566, 2.3522);
 *   // Returns { city: "Paris", postcode: "75001" }
 * } catch (error) {
 *   console.error(error);
 * }
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
    return {
      city: 'Unknown',
      postcode: 'Unknown'
    };
  }
}; 

/**
 * Calculates the distance in kilometers between two geographic points
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Converting coordinates to numbers
  const numLat1 = parseFloat(lat1);
  const numLon1 = parseFloat(lon1);
  const numLat2 = parseFloat(lat2);
  const numLon2 = parseFloat(lon2);

  if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) {
    return Infinity;
  }

  const R = 6371; // Radius of the Earth in km
  const dLat = (numLat2 - numLat1) * Math.PI / 180;
  const dLon = (numLon2 - numLon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(numLat1 * Math.PI / 180) * Math.cos(numLat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance;
};

/**
 * Filter notes by geographic scope
 * @param {Array} notes - List of notes to filter
 * @param {Object} userLocation - User position {latitude, longitude}
 * @returns {Array} Filtered notes within the user's radius
 */
export const filterNotesByLocation = (notes, userLocation) => {
  if (!userLocation || !notes) {
    return notes || [];
  }

  return notes.filter(note => {
    const noteLocation = note?.object?.location;
    const radius = parseFloat(noteLocation?.radius);

    if (!noteLocation?.latitude || !noteLocation?.longitude || !radius) {
      return true;
    }

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      noteLocation.latitude,
      noteLocation.longitude
    );

    return distance <= radius;
  });
};