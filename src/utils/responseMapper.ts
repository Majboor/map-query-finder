import { Place } from "@/types/place";

export const reformatResponse = (data: any) => {
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    return { results: [] };
  }

  const place = data.data[0];
  if (!place) return { results: [] };

  // Process working hours from the API response
  const workingHours = place.working_hours || {};
  const defaultHours = {
    "Monday": "Closed",
    "Tuesday": "Closed",
    "Wednesday": "Closed",
    "Thursday": "Closed",
    "Friday": "Closed",
    "Saturday": "Closed",
    "Sunday": "Closed"
  };

  // Extract working hours from popular_times if working_hours is not available
  if (!place.working_hours && place.popular_times) {
    place.popular_times.forEach((day: any) => {
      const dayText = day.day_text;
      const hours = day.popular_times;
      if (hours && hours.length > 0) {
        const openHours = hours.filter((h: any) => h.percentage > 0);
        if (openHours.length > 0) {
          workingHours[dayText] = `${openHours[0].time}-${openHours[openHours.length - 1].time}`;
        }
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
  const socialMediaLinks = place.site ? [place.site] : [];
  if (place.owner_link) socialMediaLinks.push(place.owner_link);

  return {
    results: [{
      "Business Name": place.name || "N/A",
      "Business Address": place.full_address || "N/A",
      "Business Phone": place.phone || "N/A",
      "Business Email": place.details?.["Business Email"] || "N/A",
      "Business Description": description,
      "Website URL": place.site || place.menu_link || place.booking_appointment_link || "N/A",
      "Latitude": place.latitude || 0,
      "Longitude": place.longitude || 0,
      "Brand Images": [
        place.logo || "N/A",
        place.photo || place.street_view || "N/A"
      ],
      "Hours": { ...defaultHours, ...workingHours },
      "Operating Hours": { ...defaultHours, ...workingHours },
      "Open State": place.business_status || "N/A",
      "Category": category,
      "Tagline": tagline,
      "Owner Name": place.owner_title || "N/A",
      "Products/Services": [place.type || "N/A"],
      "Social Media Links": socialMediaLinks,
      "Verified": place.verified || false,
      "Owner Link": place.owner_link || "N/A"
    }]
  };
};