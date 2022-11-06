const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

let filePath = path.join(__dirname, "text.txt");
let output = fs.createWriteStream(filePath, "utf-8");

process.on("exit", () => {
  stdout.write("Goodbye! See you later!");
});

process.on("SIGINT", () => {
  process.exit();
});

stdout.write("Hello, what is your name?\n");
stdin.on("data", (data) => {
  data.toString().trim().toLocaleLowerCase() === "exit"
    ? process.exit()
    : stdout.write(`Nice to meet you ${data}`);
  output.write(data);
});

output.on("error", (error) => {
  console.log("ERROR:", error.message);
  process.exit();
});