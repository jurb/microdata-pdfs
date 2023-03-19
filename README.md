# CBS.nl microdata catalogue PDF download script

These are 3 scripts to downloads the PDFs contained on [the CBS.nl microdata catalogus](https://www.cbs.nl/nl-nl/onze-diensten/maatwerk-en-microdata/microdata-zelf-onderzoek-doen/catalogus-microdata) and to optionally create 1 merged PDF with the results:

* `01-create-downloadlinks.js` uses puppeteer to crawl all pages containing a PDF and creates a `pdfs.json` file containing links to all PDFs and a string containing their category and index
* `02-download-PDFs.js` downloads all PDFs using the json from the previous step, and prepends their category and index to their filenames.
* `03-merge-PDFs.js` creates a merged `combined-CBS-microdata-catalogus.pdf` file out of all pdfs

## Instructions

1. Make sure you have [node installed](https://nodejs.dev/en/learn/how-to-install-nodejs/)
2. clone the repo
3. run `npm install` in the directory to install the dependencies (I like to use `pnpm` instead since it is faster and uses less disk space)
4. run the scripts with
    * `node 01-create-downloadlinks.js`,
    * `node 02-download-PDFs.js`, and
    * `node 03-merge-PDFs.js`

## A note of caution

Please check that the `querySelectorAll` selector still returns the right results before running this script.

This script uses selectors to scrape the CBS.nl website. When the sctructure of the pages that the script refers to changes, the script will most likely break, or silently return wrong or incomplete results.

The script downloads the PDFs one by one, but please be kind to the servers of CBS.nl and do not run this script too often.