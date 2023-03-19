// This uses puppeteer, a headless browser. Probaby a lighter scraper would be better, but this works.
const puppeteer = require("puppeteer");

async function createPDFlist() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Get links to all category overview pages on the Catalogus Microdata page on the CBS website
  // WARNING: If CBS changes the structure of their website, this script will break
  const catalogusPage = await browser.newPage();
  await catalogusPage.goto(
    "https://www.cbs.nl/nl-nl/onze-diensten/maatwerk-en-microdata/microdata-zelf-onderzoek-doen/catalogus-microdata"
  );
  const overviewPages = await catalogusPage.evaluate(() =>
    Array.from(
      document.querySelectorAll("article > section > ul > li > a"),
      (e) => e.getAttribute("href")
    )
  );

  // Set up a set to push all the links to the PDFs to
  let collector = new Set();

  // For each overview page, get the links to the individual pages for each dataset
  for (const [overviewIndex, overviewLink] of overviewPages.entries()) {
    const page = await browser.newPage();
    await page.goto(overviewLink);
    const pdfPages = await page.evaluate(() =>
      Array.from(document.querySelectorAll("ol > li > a"), (e) =>
        e.getAttribute("href")
      )
    );

    // Then for each page containing a link to a PDF, get the link to the PDF itself
    // Also save the category and the index number
    try {
      for (const [linkIndex, link] of pdfPages.entries()) {
        const linkPage = await browser.newPage();
        await linkPage.goto(link);
        const pdfs = await linkPage.evaluate(() =>
          Array.from(document.querySelectorAll("a"), (e) =>
            e.getAttribute("href")
          ).filter((d) => d.includes(".pdf"))
        );
        pdfs.forEach((d) => {
          collector.add({
            link: d,
            index:
              overviewIndex +
              "-" +
              overviewLink.split("/").at(-1) +
              "-" +
              linkIndex,
          });
          console.log(collector);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Write links to the PDFs and their categeory and index number to a JSON file
  const fs = require("fs");
  fs.writeFileSync("pdfs.json", JSON.stringify(Array.from(collector)));
  await browser.close();
}

// Run the function
createPDFlist();
