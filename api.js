// api.js - 統一處理所有第三方 / 在地 API

// 1. 香港金管局 (HKMA) 匯率 API
export async function getHKMARates() {
  try {
    const res = await fetch('https://api.hkma.gov.hk/public/market-data-and-statistics/daily-monetary-statistics/er-eor');
    const data = await res.json();
    if (data.result && data.result.records && data.result.records.length > 0) {
      const latest = data.result.records[0];
      return {
        HKD: 1,
        USD: parseFloat(latest.usd) || 7.8,
        GBP: parseFloat(latest.gbp) || 9.8,
        EUR: parseFloat(latest.eur) || 8.5
      };
    }
  } catch (err) {
    console.warn('HKMA API 暫時無法連線，使用 Fallback 數據');
  }
  return { HKD: 1, USD: 7.85, GBP: 10.0, EUR: 8.5 }; // Fallback
}

// 2. 預留：香港天文台 API (日後擴充)
export async function getHKWeather() {
  try {
    const res = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc');
    return await res.json();
  } catch (err) {
    console.error('Weather API error:', err);
  }
}
