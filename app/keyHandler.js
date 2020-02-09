const config = require('./config.json');
var spawn = require('child_process').spawn,
//To be removed eventually
exec = require('child_process').exec,
currentPath = process.cwd(),
lastTime = {},
windowID = 'unfilled',
throttledCommands = config.throttledCommands,
regexThrottle = new RegExp('^(' + throttledCommands.join('|') + ')$', 'i'),
regexFilter = new RegExp('^(' + config.filteredCommands.join('|') + ')$', 'i');

for (var i = 0; i < throttledCommands.length; i++) {
    lastTime[throttledCommands[i]] = new Date().getTime();
}

function setWindowID() {
    if (config.os === 'other' & windowID === 'unfilled') {
        exec('xdotool search --onlyvisible --name ' + config.programName, function(error, stdout) {
            windowID = stdout.trim();
            // console.log(key, windowID);
        });
    }
}

var defaultKeyMap = config.keymap || {
    'up':'Up','left':'Left','down':'Down','right':'Right',
    'a':'a','b':'b',
    'x':'x','y':'y',
    'start':'s','select':'e'
};

function sendKey(command) {
    //if doesn't match the filtered words
    if (!command.match(regexFilter)) {
        var allowKey = true,
        key = defaultKeyMap[command] || command;
        //throttle certain commands (not individually though)
        if (key.match(regexThrottle)) {
            var newTime = new Date().getTime();
            if (newTime - lastTime[key] < config.timeToWait) {
                allowKey = false;
            } else {
                lastTime = newTime;
            }
        }
        if (allowKey) {
            //if xdotool is installed
            if (config.os === 'other') {
                //Send to preset window under non-windows systems
                exec('xdotool key --window ' + windowID + ' --delay ' + config.delay + ' ' + key);
            } else {
                //use python on windows
                // "VisualBoyAdvance"
                // "DeSmuME 0.9.10 x64"
				//console.log('python3 key.py' + ' "' + config.programName + '" ' + key)
                exec('python3 "'+currentPath+'\\app\\key.py" "' + config.programName + '" ' + key, function(error,stdout,stderr) {
					console.log(error);
					console.log(stdout);
					console.log(stderr);
				});
				/*var ret = spawn("python3",["key.py",config.programName,key])
				ret.stdout.on('data', function (data) {
				  console.log('stdout: ' + data.toString());
				});*/

            }
        }
    }
}

//Only actually does something when not running under windows.
setWindowID();

exports.sendKey = sendKey;
