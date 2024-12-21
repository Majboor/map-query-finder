export const processPopularTimes = (popularTimes: any[] = []): Record<string, string> => {
  const workingHours: Record<string, string> = {};
  
  try {
    for (const dayInfo of popularTimes) {
      const dayText = dayInfo.day_text?.toLowerCase() || '';
      if (!dayText) continue;

      const hours = dayInfo.popular_times || [];
      if (hours.length === 0) {
        workingHours[dayText] = 'Closed';
        continue;
      }

      const openTimes = hours
        .filter((h: any) => h.percentage > 0)
        .map((h: any) => h.time);

      if (openTimes.length > 0) {
        workingHours[dayText] = `${openTimes[0]}-${openTimes[openTimes.length - 1]}`;
      } else {
        workingHours[dayText] = 'Closed';
      }
    }
  } catch (error) {
    console.error('Error processing popular times:', error);
  }

  return workingHours;
};

export const buildApiParams = (query: string) => {
  return {
    query,
    limit: '10',
    language: 'en',
    region: 'AU',
    async: 'false',
    dropDuplicates: 'true',
    fields: 'business_status,price_level,business_hours,reviews,popular_times,details'
  };
};