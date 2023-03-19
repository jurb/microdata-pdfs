// Optional script to also create a merged version of all the PDFs:
const PDFMerger = require("pdf-merger-js");

var merger = new PDFMerger();

(async () => {
  const pdfs = require("./pdfs.json");

  for (const pdf of pdfs) {
    try {
      await merger.add(
        `./downloads/${pdf.index}-${pdf.link.split("/").at(-1).split("?")[0]}`
      );
    } catch (e) {
      console.log(e);
    }
  }

  await merger.save("combined-CBS-microdata-catalogus.pdf");
})();
