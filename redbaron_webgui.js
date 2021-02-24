#!/usr/bin/node
express = require("express");
shell = require('shelljs');
yaml = require('js-yaml');
fs = require('fs');
bodyParser = require('body-parser');

function main() {
    console.clear();
	fileContents = fs.readFileSync('./conf/web.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	host = data.web_host;
    port = data.web_port;
    debug_mode = data.debug;
	app = express()
	app.use(express.static(__dirname +'/webgui'));
	app.set('views', __dirname +'/webgui/html')
    app.use(bodyParser.urlencoded({ extended: false }));

	//Default
	app.get('/', (req, res) => {
		res.render('index.ejs');
	})
	//Email
	app.get('/email', (req, res) => {
		res.render('email.ejs');
	})
	app.post('/email', function(req, res) {
        console.log("[*] /email endpoint queried.");
		var email = req.body.arg1;
		var subject = req.body.arg2;
		var count = req.body.arg3;
        var body = req.body.arg4;
        command = `node redbaron.js --cli email "${email}" "${subject}" "${body}" ${count}`
        result = shell.exec(command);
        if (debug_mode == true) {
            console.log("[*] Result: "+ result);
            console.log("[*] Command: "+ command);
        }
		res.render('email.ejs', {result: result});
    });
    //HTTP
	app.get('/http', (req, res) => {
		res.render('http.ejs');
	})
	app.post('/http', function(req, res) {
        console.log("[*] /http endpoint queried.");
		var site = req.body.arg1;
		var count = req.body.arg2;
        command = `node redbaron.js --cli http ${site} ${count}`
        result = shell.exec(command);
        if (debug_mode == true) {
            console.log("[*] Result: "+ result);
            console.log("[*] Command: "+ command);
        }
		res.render('http.ejs', {result: result});
    });
    //FTP
	app.get('/ftp', (req, res) => {
		res.render('ftp.ejs');
	})
	app.post('/ftp', function(req, res) {
        console.log("[*] /ftp endpoint queried.");
		var site = req.body.arg1;
        var user = req.body.arg3;
        var pass = req.body.arg4;
        var count = req.body.arg2;
        command = `node redbaron.js --cli ftp ${site} ${user} ${pass} ${count}`
        result = shell.exec(command);
        if (debug_mode == true) {
            console.log("[*] Result: "+ result);
            console.log("[*] Command: "+ command);
        }
		res.render('ftp.ejs', {result: result});
    });
    //SSH
	app.get('/ssh', (req, res) => {
		res.render('ssh.ejs');
	})
	app.post('/ssh', function(req, res) {
        console.log("[*] /ssh endpoint queried.");
		var site = req.body.arg1;
        var user = req.body.arg3;
        var pass = req.body.arg4;
        var port = req.body.arg5;
        var count = req.body.arg2;
        command = `node redbaron.js --cli ssh ${site} ${port} ${user} ${pass} ${count}`
        result = shell.exec(command);
        if (debug_mode == true) {
            console.log("[*] Result: "+ result);
            console.log("[*] Command: "+ command);
        }
		res.render('ssh.ejs', {result: result});
    });
    //Custom
	app.get('/custom', (req, res) => {
		res.render('custom.ejs');
	})
	app.post('/custom', function(req, res) {
        console.log("[*] /custom endpoint queried.");
		var site = req.body.arg1;
        var port = req.body.arg2;
        var content = req.body.arg3;
        var count = req.body.arg4;
        command = `node redbaron.js --cli custom ${site} ${port} "${content}" ${count}`
        result = shell.exec(command);
        if (debug_mode == true) {
            console.log("[*] Result: "+ result);
            console.log("[*] Command: "+ command);
        }
		res.render('custom.ejs', {result: result});
    });
    //Custom
	app.get('/portscan', (req, res) => {
		res.render('portscan.ejs');
	})
	app.post('/portscan', function(req, res) {
        console.log("[*] /portscan endpoint queried.");
		var site = req.body.arg1;
        var port = req.body.arg2;
        var count = req.body.arg3;
        command = `node redbaron.js --cli portscan ${site} ${port} ${count}`
        result = shell.exec(command);
        if (debug_mode == true) {
            console.log("[*] Result: "+ result);
            console.log("[*] Command: "+ command);
        }
		res.render('portscan.ejs', {result: result});
    });
    //Slowloris
	app.get('/slowloris', (req, res) => {
		res.render('slowloris.ejs');
    })
    //SMS
    app.get('/sms', (req, res) => {
		res.render('sms.ejs');
	})
	app.post('/sms', function(req, res) {
        console.log("[*] /sms endpoint queried.");
		var number = req.body.arg1;
        var content = req.body.arg3;
        var count = req.body.arg2;
        command = `node redbaron.js --cli sms "${number}" "${content}" ${count}`
        result = shell.exec(command);
        if (debug_mode == true) {
            console.log("[*] Result: "+ result);
            console.log("[*] Command: "+ command);
        }
		res.render('sms.ejs', {result: result});
    });
    //Call
    app.get('/call', (req, res) => {
        res.render('call.ejs');
    })
    app.post('/call', function(req, res) {
        console.log("[*] /call endpoint queried.");
        var number = req.body.arg1;
        command = `node redbaron.js --cli call "${number}"`
        result = shell.exec(command);
        if (debug_mode == true) {
            console.log("[*] Result: "+ result);
            console.log("[*] Command: "+ command);
        }
        res.render('call.ejs', {result: result});
    });
	//Start
	app.listen(port, () => {
		console.log(`RedBaron webGUI listening @ http://localhost:${port}`);
	})
}

main();