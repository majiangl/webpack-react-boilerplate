const fs = require('fs');
const path = require('path');

module.exports = {
  lookupEntries: function(dir, lookupDir){
    const entries = [];
    const names = fs.readdirSync(dir);

    for (let name of names) {
      const pathname = path.join(dir, name);

      if (fs.statSync(pathname).isDirectory() == !!lookupDir) {
        entries.push({
          pathname: pathname,
          filename: name,
          entryname: name.replace(/\.[^.]*$/,'')
        });
      }
    }
    return entries;
  },

  filterEntries: function(entries, pattern) {
    const reg = new RegExp(pattern, 'i');
    return entries.filter(function(item){
      return reg.test(item.entryname);
    });
  }
};