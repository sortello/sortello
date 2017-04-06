var exec = require('child_process').exec;

var arguments = process.argv.slice(2);

if (arguments.length < 2) {
  console.log("Usage: node deploy.js <version> <message>");
  return 1;
}

var version = process.argv.slice(2)[0];
var message = process.argv.slice(2)[1];

console.log("Release " + version + ":" + message);

var getMasterUpdated = 'git checkout master && git pull && ';
var compileJsForProduction = 'npm run build && git commit -am "update js production build" && git push && ';
var tagNewRelease = 'git tag -a ' + version + ' -m "' + message + '" && git push --tags && ';
var pushToGithubPages = 'git checkout gh-pages && git merge master && npm test && git push origin gh-pages && ';
var backToMasterBranch = 'git checkout master';

var cmd = getMasterUpdated +  compileJsForProduction + tagNewRelease + pushToGithubPages + backToMasterBranch;

console.log("Command: " + cmd);

exec(cmd, function (error, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
});
