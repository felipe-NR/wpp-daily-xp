import { scrapeHtmlTable } from "./src/scrapeTable.js"; // Import the scrapeHtmlTable function

// Example usage:
const targetUrl = "https://guildstats.eu/guild=Old+Guard&op=3"; // Replace with your target URL
const cssTableSelector = "#myTable2"; // Replace with a specific CSS selector for your table

await scrapeHtmlTable(targetUrl, cssTableSelector).then((result) => {
  if (result) {
    const { headers, tableData } = result;
    const emojiFromRank = ["🥇", "🥈", "🥉", "🏅", "🏅", "🏅"];

    let today = new Date();
    let options = { year: "numeric", month: "2-digit", day: "2-digit" };

    const replyMessage =
      `📣XP DO DIA📣\n` +
      `${today.toLocaleDateString("pt-BR", options)}\n` +
      `\n` +
      `${headers.join(" / ")} \n` +
      tableData
        .map((row, index) => `${emojiFromRank[index]} ${row.join(" / ")}`)
        .join("\n");
    // Cria um link do WhatsApp com a mensagem pronta (URL-encoded)
    const encoded = encodeURIComponent(replyMessage);
    const apiWhatsappLink = `https://api.whatsapp.com/send?text=${encoded}`;
    console.log(apiWhatsappLink);
  }
});
