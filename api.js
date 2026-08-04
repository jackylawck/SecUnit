/**
 * SecUnit (秒換) - 外接 API 數據模組
 * 包含 6 大免費公開 API，無需 API Key
 */

// 1. 國際每日即時匯率 API (Frankfurter API)
export async function fetchGlobalRates(baseCurrency = 'HKD') {
  const url = `https://api.frankfurter.app/latest?from=${baseCurrency}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Global Rates failed');
    const data = await res.json();
    return data.rates;
  } catch (err) {
    console.warn('全球匯率 API 載入失敗，啟動備用數據');
    return { USD: 0.128, JPY: 19.2, EUR: 0.118, GBP: 0.101, TWD: 4.15, CNY: 0.92, AUD: 0.192, CAD: 0.175 };
  }
}

// 2. 香港即時氣溫與濕度 API (香港天文台)
export async function fetchHKEnvironmentData() {
  const url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HKO Weather failed');
    const data = await res.json();
    return {
      temp: data.temperature?.data?.[0]?.value || null,
      humidity: data.humidity?.data?.[0]?.value || null
    };
  } catch (err) {
    return { temp: null, humidity: null };
  }
}

// 3. 國際即時金價 API
export async function fetchGoldPrice() {
  const url = 'https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gold API failed');
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
    if (!res.ok) throw new Error('IP Location failed');
    const data = await res.json();
    return { countryCode: data.country_code, countryName: data.country_name };
  } catch (err) {
    return { countryCode: 'HK', countryName: 'Hong Kong' };
  }
}

// ================= 新增的 4 個 API =================

// 5. 加密貨幣即時價格 API (CoinGecko)
export async function fetchCryptoPrices() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,hkd';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Crypto API failed');
    const data = await res.json();
    return {
      btc_usd: data.bitcoin?.usd || 65000,
      eth_usd: data.ethereum?.usd || 3500
    };
  } catch (err) {
    return { btc_usd: 65000, eth_usd: 3500 }; // Fallback
  }
}

// 6. 空氣質素 AQI API (Open-Meteo) - 預設香港坐標
export async function fetchAirQuality(lat = 22.3193, lon = 114.1694) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Air Quality failed');
    const data = await res.json();
    return {
      aqi: data.current?.us_aqi || '--',
      pm25: data.current?.pm2_5 || '--'
    };
  } catch (err) {
    return { aqi: '--', pm25: '--' };
  }
}

// 7. 國際時間與時區 API (WorldTimeAPI)
export async function fetchWorldTime(timezoneString) {
  // timezoneString 格式如 "Asia/Tokyo"
  if (timezoneString === 'UTC') timezoneString = 'Etc/UTC';
  const url = `http://worldtimeapi.org/api/timezone/${timezoneString}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('World Time failed');
    const data = await res.json();
    return data.datetime; // e.g. "2026-08-04T22:40:12.123456+08:00"
  } catch (err) {
    return null;
  }
}

// 8. 全球國家基本資料 API (REST Countries)
export async function fetchCountryInfo(currencyCode) {
  if (['BTC', 'ETH'].includes(currencyCode)) return null;
  const url = `https://restcountries.com/v3.1/currency/${currencyCode.toLowerCase()}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Country Info failed');
    const data = await res.json();
    if (data && data.length > 0) {
      // 找出使用該貨幣人口最多的國家作為代表
      const mainCountry = data.sort((a, b) => b.population - a.population)[0];
      return {
        flag: mainCountry.flag,
        name: mainCountry.name.common,
        capital: mainCountry.capital?.[0] || 'N/A',
        pop: (mainCountry.population / 1000000).toFixed(1) + 'M'
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

// 食材密度資料庫 (保持不變)
export const FOOD_DENSITY_MAP = {
  flour: { name_zh: '面粉 (Flour)', densityGramsPerMl: 0.53 },
  sugar: { name_zh: '白糖 (Sugar)', densityGramsPerMl: 0.85 },
  butter: { name_zh: '牛油 (Butter)', densityGramsPerMl: 0.95 },
  honey: { name_zh: '蜂蜜 (Honey)', densityGramsPerMl: 1.42 },
  water: { name_zh: '水 / 牛奶 (Water/Milk)', densityGramsPerMl: 1.0 }
};
