/**
 * SecUnit (秒換) - 外接 API 數據模組
 */

// 1. 國際每日即時匯率 API (Frankfurter API)
export async function fetchGlobalRates(baseCurrency = 'HKD') {
  const url = `https://api.frankfurter.app/latest?from=${baseCurrency}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Global Rates network response failed');
    const data = await res.json();
    return data.rates; // 回傳包含 30+ 種貨幣的匯率物件
  } catch (err) {
    console.warn('全球匯率 API 載入失敗，啟動備用匯率數據:', err);
    // 完整的 Fallback 預設數據
    return {
      USD: 0.128, JPY: 19.2, EUR: 0.118, GBP: 0.101, TWD: 4.15, CNY: 0.92,
      KRW: 172.5, THB: 4.52, SGD: 0.171, MYR: 0.57, VND: 3180.0, IDR: 2050.0,
      PHP: 7.35, INR: 10.7, AUD: 0.192, CAD: 0.175, NZD: 0.21, CHF: 0.112,
      SEK: 1.35, NOK: 1.38, DKK: 0.88, AED: 0.47, TRY: 4.25, BRL: 0.71,
      MXN: 2.38, ZAR: 2.32
    };
  }
}

// 2. 香港即時氣壓與天氣 API
export async function fetchHKEnvironmentData() {
  const weatherUrl = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
  try {
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error('HKO Weather network response failed');
    const data = await res.json();
    return {
      temp: data.temperature?.data?.[0]?.value || null,
      humidity: data.humidity?.data?.[0]?.value || null
    };
  } catch (err) {
    return { temp: null, humidity: null };
  }
}

// 3. 國際金價 API
export async function fetchGoldPrice() {
  const url = 'https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gold API response failed');
    const data = await res.json();
    return data.metals?.gold || 2350.0;
  } catch (err) {
    return 2350.0;
  }
}

// 4. IP 地理定位 API
export async function fetchUserLocation() {
  const url = 'https://ipapi.co/json/';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('IP Location response failed');
    const data = await res.json();
    return { countryCode: data.country_code, countryName: data.country_name };
  } catch (err) {
    return { countryCode: 'HK', countryName: 'Hong Kong' };
  }
}

// 5. 烘焙食材密度表
export const FOOD_DENSITY_MAP = {
  flour: { name_zh: '面粉 (Flour)', densityGramsPerMl: 0.53 },
  sugar: { name_zh: '白糖 (Sugar)', densityGramsPerMl: 0.85 },
  butter: { name_zh: '牛油 (Butter)', densityGramsPerMl: 0.95 },
  honey: { name_zh: '蜂蜜 (Honey)', densityGramsPerMl: 1.42 },
  water: { name_zh: '水 / 牛奶 (Water/Milk)', densityGramsPerMl: 1.0 }
};
