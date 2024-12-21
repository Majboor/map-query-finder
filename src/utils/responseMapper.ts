export const reformatResponse = (data: any) => {
  if (!data || !Array.isArray(data.data)) {
    return { results: [] };
  }

  // Handle the case where data.data is an array of arrays (multiple queries)
  const resultsArray = Array.isArray(data.data[0]) ? data.data : [data.data];
  
  const allResults = resultsArray.flatMap(resultSet => {
    return resultSet.map((place: any) => {
      // Process working hours from the API response
      const workingHours: Record<string, string> = {};
      
      // Extract working hours from popular_times
      if (place.popular_times) {
        place.popular_times.forEach((day: any) => {
          const dayText = day.day_text;
          const hours = day.popular_times;
          if (hours && hours.length > 0) {
            const openHours = hours.filter((h: any) => h.percentage > 0);
            if (openHours.length > 0) {
              workingHours[dayText] = `${openHours[0].time}-${openHours[openHours.length - 1].time}`;
            } else {
              workingHours[dayText] = 'Closed';
            }
          } else {
            workingHours[dayText] = 'Closed';
          }
        });
      }

      // Extract description from various possible locations
      const description = 
        place.description || 
        place.about?.description || 
        place.about?.["From the business"]?.description ||
        (place.reviews_tags?.length > 0 ? place.reviews_tags.join(", ") : "N/A");

      // Extract category and tagline
      const category = place.type || place.category || "N/A";
      const tagline = place.description ? place.description.split('.')[0] : category;

      // Map social media links
      const socialMediaLinks = [];
      if (place.site) socialMediaLinks.push(place.site);
      if (place.owner_link) socialMediaLinks.push(place.owner_link);

      // Extract images, ensuring they are valid URLs
      const brandImages = [
        place.logo,
        place.photo,
        place.street_view,
        ...(place.photos || [])
      ].filter(img => img && img !== 'N/A' && typeof img === 'string');

      return {
        "Business Name": place.name || "N/A",
        "Business Address": place.full_address || "N/A",
        "Business Phone": place.phone || "N/A",
        "Business Email": place.email || place.details?.["Business Email"] || "N/A",
        "Business Description": description,
        "Website URL": place.site || place.menu_link || place.booking_appointment_link || "N/A",
        "Latitude": place.latitude || 0,
        "Longitude": place.longitude || 0,
        "Brand Images": brandImages.length > 0 ? brandImages : ["N/A"],
        "Hours": workingHours,
        "Operating Hours": workingHours,
        "Open State": place.business_status || "N/A",
        "Category": category,
        "Tagline": tagline,
        "Owner Name": place.owner_title || "N/A",
        "Products/Services": Array.isArray(place.type) ? place.type : [place.type || "N/A"],
        "Social Media Links": socialMediaLinks,
        "Verified": Boolean(place.verified),
        "Owner Link": place.owner_link || "N/A"
      };
    });
  });

  return { results: allResults };
};