const fs = require('fs');
const path = require('path');

const mkdirs = (dir) =>
  fs.existsSync(dir) ||
  (mkdirs(path.dirname(dir)) && (fs.mkdirSync(dir) || true));
const touch = (file) =>
  fs.existsSync(file) ||
  (mkdirs(path.dirname(file)) && (fs.writeFileSync(file) || true));

const mkdir = mkdirs;

const copy = (src, dest2) => {
  const name = path.basename(src);
  const dest =
    dest2.lastIndexOf(path.sep) === dest2.length - 1
      ? path.join(dest2, name)
      : dest2;

  if (!fs.existsSync(dest)) {
    const pathStat = fs.lstatSync(src);

    if (pathStat.isFile()) {
      fs.copyFile(src, dest, (err) => {
        if (err) throw err;
      });
    } else if (pathStat.isDirectory()) {
      mkdir(dest);
      const files = fs.readdirSync(src);
      files.forEach((filename) => {
        copy(path.join(src, filename), path.join(dest, filename));
      });
    }
  }
};

module.exports = {
  mkdirs,
  touch,
  copy,
  mkdir,
};
