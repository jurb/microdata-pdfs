// This script downloads all the PDFs from the JSON file created by the previous script.
// This is done file by file, to prevent a 'too many requests' error from the server.
// I adapated this script on stackoverflow: https://stackoverflow.com/a/57362997
// I removed the progressbar, and I rename the PDF files to include the category and index number.

const request = require("request");
const async = require("async");
const fs = require("fs");

class Downloader {
  constructor() {
    this.q = async.queue(this.singleFile, 1);

    // assign a callback
    this.q.drain(function () {
      console.log("all items have been processed");
    });

    // assign an error callback
    this.q.error(function (err, task) {
      console.error("task experienced an error", task);
    });
  }

  downloadFiles(links) {
    for (let link of links) {
      this.q.push(link);
    }
  }

  singleFile(link, cb) {
    let file = request(link.link);
    file.on("response", (res) => {
      const len = parseInt(res.headers["content-length"], 10);
      console.log();
      file.on("data", (chunk) => {});
      file.on("end", () => {
        console.log("\n");
        cb();
      });
    });
    file.pipe(
      fs.createWriteStream(
        "./downloads/" +
          link.index +
          "-" +
          // to get the filename here, we get the last part of the url after
          // the last /, and we strip any links that have a parameter after
          // the filename(.e.g. ? la = nl)
          link.link.split("/").at(-1).split("?")[0]
      )
    );
  }
}

const dl = new Downloader();
const pdfs = require("./pdfs.json");

dl.downloadFiles(pdfs);
