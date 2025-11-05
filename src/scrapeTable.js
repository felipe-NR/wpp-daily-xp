import * as cheerio from "cheerio";
import axios from "axios";

axios.defaults.headers.get["User-Agent"] =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36";

// helper para converter strings como "+4,986,337" ou "-19,648,094" em números
const toNumber = (s) => {
  const cleaned = String(s).replace(/[^\d-]/g, ""); // mantém dígitos e sinal de menos
  const n = parseInt(cleaned, 10);
  return Number.isNaN(n) ? 0 : n;
};

const round = (value, decimals) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

export async function scrapeHtmlTable(url, tableSelector) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const tableData = [];

    // Select the table using the provided selector
    const $table = $(tableSelector);

    // Iterate over each row (tr) in the table body (tbody)
    $table.find("tbody tr").each((i, row) => {
      const rowData = [];
      const $XpYesterdayCell = $(row).children().eq(13).text().valueOf().trim();
      const $CharacterLvlCell = $(row).children().eq(2).text().valueOf().trim();
      const $CharacterNameCell = $(row)
        .children()
        .eq(1)
        .children()
        .text()
        .valueOf()
        .trim();
      const XpYesterday = toNumber($XpYesterdayCell) / 1000000; // Convert to KKs of XP
      if (XpYesterday === 0) {
        return; // Skip rows with characters without a valid XpYesterday value
      }
      rowData.push(round(XpYesterday, 2));
      rowData.push($CharacterLvlCell);
      rowData.push($CharacterNameCell);
      tableData.push(rowData);
    });

    // Ordena tableData pelo primeiro campo numérico de cada linha.
    // Para ordem decrescente (maior -> menor):
    tableData.sort((a, b) => b[0] - a[0]);
    // Para ordem crescente (menor -> maior) use:
    // tableData.sort((a, b) => a[0] - b[0]);
    tableData.splice(6); // Mantém apenas os top 6

    return { tableData };
  } catch (error) {
    console.error(`Error scraping table from ${url}:`, error);
    return null;
  }
}
