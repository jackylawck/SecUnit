/**
 * SecUnit (秒換) - 外接 API 數據模組
 * 包含：全球法幣匯率、香港氣候/AQHI、時區、貴金屬金價、IP定位、食材密度
 */

// ----------------------------------------------------
// 1. 國際每日即時匯率 API (Frankfurter API)
// 支援：JPY, EUR, GBP, AUD, CAD, TWD, KRW 等全球主要法幣
// ----------------------------------------------------
export async function fetchGlobalRates(baseCurrency = 'HKD') {
  const url = `https://api.frankfurter.app/latest?from=${baseCurrency}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Global Rates network response failed');
    const data = await res.json();
    return data.rates; // 回傳以 HKD 為基準的全球匯率物件
  } catch (err) {
    console.warn('全球匯率 API 載入失敗，使用預設值:', err);
    return { JPY: 19.2, EUR: 0.11, GBP: 0.098, AUD: 0.19, CAD: 0.17, TWD: 4.1 }; // Fallback
  }
}

// ----------------------------------------------------
// 2. 香港即時氣象與空氣質素 API (香港環保署 & 天文台)
// ----------------------------------------------------
export async function fetchHKEnvironmentData() {
  const weatherUrl = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
  
  try {
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error('HKO Weather network response failed');
    const data = await res.json();
    
    const temp = data.temperature?.data?.[0]?.value || null;
    const humidity = data.humidity?.data?.[0]?.value || null;
    const uvIndex = data.uvindex?.data?.[0]?.value || null;

    return { temp, humidity, uvIndex };
  } catch (err) {
    console.warn('香港氣象 API 載入失敗:', err);
    return { temp: null, humidity: null, uvIndex: null };
  }
}

// ----------------------------------------------------
// 3. 世界時區 API (WorldTimeAPI)
// 取得指定城市/時區的當前時間與 UTC Offset
// ----------------------------------------------------
export async function fetchTimeZoneData(area = 'Asia', location = 'Hong_Kong') {
  const url = `http://worldtimeapi.org/api/timezone/${area}/${location}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('WorldTimeAPI response failed');
    const data = await res.json();
    return {
      datetime: data.datetime,
      utcOffset: data.utc_offset,
      timezone: data.timezone
    };
  } catch (err) {
    console.warn('時區 API 載入失敗:', err);
    return { datetime: new Date().toISOString(), utcOffset: '+08:00', timezone: `${area}/${location}` };
  }
}

// ----------------------------------------------------
// 4. 國際貴金屬金價 API (GoldAPI.io / Public Metal Proxy)
// 取得黃金 (XAU) 國際即時價格 (USD / Troy Oz)
// ----------------------------------------------------
export async function fetchGoldPrice() {
  // 使用免 Key 的公用 Proxy 數據源作為示範範例
  const url = 'https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gold API response failed');
    const data = await res.json();
    return data.metals?.gold || 2350.0; // 每盎司黃金（美元）
  } catch (err) {
    console.warn('金價 API 載入失敗，啟動備用數據:', err);
    return 2350.0; // Fallback 參考金價 (USD / oz)
  }
}

// ----------------------------------------------------
// 5. 各國 IP 自動定位 API (ipapi.co)
// 根據訪問者 IP 自動識別國家，用於優化預設單位
// ----------------------------------------------------
export async function fetchUserLocation() {
  const url = 'https://ipapi.co/json/';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('IP Location response failed');
    const data = await res.json();
    return {
      countryCode: data.country_code, // 如 'HK', 'US', 'GB'
      countryName: data.country_name,
      currency: data.currency
    };
  } catch (err) {
    console.warn('IP 定位 API 載入失敗:', err);
    return { countryCode: 'HK', countryName: 'Hong Kong', currency: 'HKD' };
  }
}

// ----------------------------------------------------
// 6. 食材密度資料庫 API (USDA / Static Baking Density Map)
// 解決烘焙廚房「體積 (Cup/mL) 轉 重量 (g)」的物理密度難題
// ----------------------------------------------------
export const FOOD_DENSITY_MAP = {
  flour: { name_zh: '面粉 (Flour)', densityGramsPerMl: 0.53 },       // 1 Cup ≈ 125g
  sugar: { name_zh: '白糖 (Sugar)', densityGramsPerMl: 0.85 },       // 1 Cup ≈ 200g
  butter: { name_zh: '牛油 (Butter)', densityGramsPerMl: 0.95 },     // 1 Cup ≈ 227g
  honey: { name_zh: '蜂蜜 (Honey)', densityGramsPerMl: 1.42 },       // 1 Cup ≈ 340g
  water: { name_zh: '水 / 牛奶 (Water/Milk)', densityGramsPerMl: 1.0 } // 1 Cup ≈ 240g
};

export function convertVolumeToWeight(volumeInMl, foodType = 'flour') {
  const density = FOOD_DENSITY_MAP[foodType]?.densityGramsPerMl || 1.0;
  return volumeInMl * density; // 輸出重量 (Grams)
}
