const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

let currentDirPath = path.join(__dirname, "files");
let newDirPath = path.join(__dirname, "files-copy");


function copyDir() {

  fs.mkdir(newDirPath, { recursive: true }, (error) => {
    if (error) {
      console.log(error.message);
    }
  });

  readdir(currentDirPath, { withFileTypes: true }).then((data) => {
    data.forEach((file) => {
      let oldPath = path.join(currentDirPath, file.name);
      let newPath = path.join(newDirPath, file.name);

      fs.copyFile(oldPath, newPath, (error) => {
        if (error) {
          console.log(error.message);
        }
      });
    });
  });

  readdir(newDirPath, {withFileTypes: true}).then((data) => {
    data.forEach((file) => {
      let oldPath = path.join(currentDirPath, file.name);
      let newPath = path.join(newDirPath, file.name)

      fs.access(oldPath, (error) => {
        if(error){
          fs.unlink(newPath, (err) => {
            if(err){
              console.log(err.message);
            }
          })
        }
      })
    })
  })
}

copyDir()