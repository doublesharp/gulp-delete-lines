const through = require('through2'),
  log = require('fancy-log'),
  PluginError = require('plugin-error');

module.exports = function (opt) {
  return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError('gulp-delete-lines', 'Streaming not supported'));
			return;
		}

    let str = file.contents.toString(enc);
    let newLines = [];

    const lines = str.split(/\r\n|\r|\n/g);

    for (let i=0; i<lines.length; i++) {

      let match = false;
      let filter = false;

      for (let j=0; j<opt.filters.length; j++) {
        if (lines[i].match(opt.filters[j])) {
          filter = opt.filters[j];
          match = true;
          break;
        }
      }

      if (!match) {
        newLines.push(lines[i]);
      } else {
        log('gulp-delete-lines removing match', filter)
      }
    }

    str = newLines.join('\n');

    file.contents = new Buffer(str);

    this.push(file);

		cb();
  });
};
