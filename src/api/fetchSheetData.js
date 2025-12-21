const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const RANGE = "Sheet1!A2:C"; // id | price | image

export const fetchSheetProducts = async () => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values) return [];

    return data.values.map(row => ({
      id: Number(row[0]),
      price: Number(row[1]),
      image: row[2] || ""
    }));
  } catch (err) {
    console.error("Google Sheet fetch failed", err);
    return [];
  }
};
