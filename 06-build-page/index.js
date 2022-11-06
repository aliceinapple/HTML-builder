const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

let projDist = path.join(__dirname, "project-dist");
let indHtml = path.join(projDist, "index.html");
let templHtml = path.join(__dirname, "template.html");
let components = path.join(__dirname, "components");
let stileCSSReadPath = path.join(__dirname, "styles");
let styleCSSWritePath = path.join(__dirname, "project-dist", "style.css");
let outputStyleCSS = fs.createWriteStream(styleCSSWritePath, "utf-8");
let curDirPath = path.join(__dirname, "assets");
let nDirPath = path.join(__dirname, "project-dist", "assets");

fs.mkdir(projDist, { recursive: true }, (error) => {
  if (error) {
    console.log(error.message);
  }
});

fs.readFile(templHtml, "utf-8", (error, data) => {
  if (error) {
    console.log(error.message);
  } else {
    fs.readdir(components, { withFileTypes: true }, (error, files) => {
      if (error) {
        console.log(error.message);
      } else {
        let repl = data.toString();
        files.forEach((file) => {
          let filePath = path.join(components, file.name);

          fs.readFile(filePath, "utf-8", (error, fileData) => {
            if (error) {
              console.log(error.message);
            } else {
              if (repl.includes(`{{${file.name.split(".")[0]}}}`)) {
                repl = repl.replaceAll(
                  `{{${file.name.split(".")[0]}}}`,
                  fileData
                );

                fs.writeFile(indHtml, repl, "utf-8", (error) => {
                  if (error) {
                    console.log(error.message);
                  }
                });
              }
            }
          });
        });
      }
    });
  }
});

readdir(stileCSSReadPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    let newPath = path.join(stileCSSReadPath, file.name);
    fs.readFile(newPath, "utf-8", (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        if (file.name.split(".")[1] === "css") {
          outputStyleCSS.write(data);
          outputStyleCSS.write("\n");
          if (data[data.length - 1] === "}") {
            outputStyleCSS.write("\n");
          }
        }
      }
    });
  });
});

function copyDir(currentDirPath, newDirPath) {
  fs.mkdir(newDirPath, { recursive: true }, (error) => {
    if (error) {
      console.log(error.message);
    }
  });
  readdir(currentDirPath, { withFileTypes: true }).then((data) => {
    data.forEach((file) => {
      let oldPath = path.join(currentDirPath, file.name);
      let newPath = path.join(newDirPath, file.name);

      if (file.isDirectory()) {
        copyDir(oldPath, newPath);
      } else {
        fs.copyFile(oldPath, newPath, (error) => {
          if (error) {
            console.log(error.message);
          }
        });
      }
    });
  });
}

function deleteDir(currentDirPath, newDirPath) {
  readdir(newDirPath, { withFileTypes: true }).then((data) => {
    data.forEach((file) => {
      let oldPath = path.join(currentDirPath, file.name);
      let newPath = path.join(newDirPath, file.name);

      if (file.isDirectory()) {
        fs.stat(oldPath, (error) => {
          if (error) {
            fs.rm(newPath, { recursive: true }, (err) => {
              if (err) {
                console.log(err.message);
              }
            });
          } else {
            deleteDir(oldPath, newPath);
          }
        });
      } else {
        fs.access(oldPath, (error) => {
          if (error) {
            fs.unlink(newPath, (err) => {
              if (err) {
                console.log(err.message);
              }
            });
          }
        });
      }
    });
  });
}

copyDir(curDirPath, nDirPath);
deleteDir(curDirPath, nDirPath);
