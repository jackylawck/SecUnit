// api.js - 獨立外接 API 模組

/**
 * 1. 香港金管局 (HKMA) 官方 Daily Exchange Rate API
 * 完全免費、無需 API Key、支援 CORS 跨域請求
 */
export async function fetchHKMARates() {
  const url = 'https://api.hkma.gov.hk/public/market-data-and-statistics/daily-monetary-statistics/er-eor';
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HKMA Network response was not ok');
    
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
    console.warn('HKMA API 載入失敗，啟動備用匯率數據:', err);
  }

  // 網絡失敗時的預設 Fallback 數據
  return { HKD: 1, USD: 7.85, GBP: 10.0, EUR: 8.5 };
}

/**
 * 2. 香港天文台 (HKO) Open Data API
 * 獲取香港當前即時氣溫
 */
export async function fetchHKWeather() {
  const url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HKO Network response was not ok');
    
    const data = await res.json();
    if (data.temperature && data.temperature.data.length > 0) {
      // 取得京士柏或香港平均溫度
      return data.temperature.data[0].value;
    }
  } catch (err) {
    console.warn('天文台 API 載入失敗:', err);
  }
  
  return null;
}
