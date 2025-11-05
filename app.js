import express from "express";
import { scrapeHtmlTable } from "./src/scrapeTable.js"; // Import the scrapeHtmlTable function
import cors from "cors";

const app = express();
app.use(cors()); // default allows all origins

const port = process.env.PORT || 3001;

app.get("/generate-link", async (req, res) => {
  // Example usage:
  const targetUrl = "https://guildstats.eu/guild=Old+Guard&op=3"; // Replace with your target URL
  const cssTableSelector = "#myTable2"; // Replace with a specific CSS selector for your table

  await scrapeHtmlTable(targetUrl, cssTableSelector).then((response) => {
    if (response) {
      const { tableData } = response;

      const headers = ["KKs de XP 💸🤔", "Lvl 🆙", "Nick 📈"];
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

      const result = {
        headers,
        tableData,
        replyMessage,
        apiWhatsappLink,
        time: today.toISOString(),
      };

      res.type("application/json").send(JSON.stringify(result));
    }
  });
});

const server = app.listen(port, () =>
  console.log(`Listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
