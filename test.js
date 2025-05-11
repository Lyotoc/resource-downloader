const fs = require('fs')
const path = require('path')

let dirs = fs.readdirSync("./browsers")
for (const dir_ of dirs) {
    if (dir_.startsWith('chromium')) {
        console.log(dir_);
    }
}