var exec = require('child_process').exec;

var version = process.argv.slice(2)[0];
var message = process.argv.slice(2)[1];

console.log(version);
console.log(message);

var cmd = 'git checkout master && git pull && npm run build && git tag -a ' + version + ' -m "' + message + '" && git push --tags && git checkout gh-pages && git merge master && npm test && git push origin gh-pages && git checkout master';

console.log("Command: " + cmd);

exec(cmd, function (error, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
});
