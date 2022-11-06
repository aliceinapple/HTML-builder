const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

let fileReadPath = path.join(__dirname, "styles");

let fileWritePath = path.join(__dirname, "project-dist", "bundle.css");
let output = fs.createWriteStream(fileWritePath, "utf-8");

readdir(fileReadPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    let newPath = path.join(fileReadPath, file.name);
    fs.readFile(newPath, "utf-8", (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        if (file.name.split(".")[1] === "css") {
          output.write(data);
          output.write("\n");
          if (data[data.length - 1] === "}") {
            output.write("\n");
          }
        }
      }
    });
  });
});
