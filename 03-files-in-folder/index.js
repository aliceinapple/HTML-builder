const path = require("path");
const { readdir } = require("fs/promises");
const { stat } = require("fs");

let filePath = path.join(__dirname, "secret-folder");

readdir(filePath, { withFileTypes: true }).then((data) =>
  data.forEach((item) => {
    let way = path.join(filePath, item.name);

    if (item.isFile()) {
      stat(way, (error, stats) => {
        if (stats) {
          console.log(
            `${item.name.split(".")[0]} - ${item.name.split(".")[1]} - ${
              stats.size / 1024
            }kb`
          );
        } else {
          console.log("ERROR: ", error.message);
        }
      });
    }
  })
);
