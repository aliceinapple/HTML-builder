const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

let currentPath = path.join(__dirname, "files");
let newFilesPath = path.join(__dirname, "files-copy");

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

copyDir(currentPath, newFilesPath);
deleteDir(currentPath, newFilesPath);
