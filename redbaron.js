#!/usr/bin/node
//Configuraciones Globales
version = "1.0";						//Version de la Aplicación
readline = require('readline-sync');	//Permite leer las opciones del usuario
nodemailer = require('nodemailer');		//Permite el envío masivo de emails
yaml = require('js-yaml');				//Permite la lectura de archivos YAML
fs = require('fs');						//Permite operaciones con archivos
sleep = require('system-sleep');		//Permite dormir una función por tiempo determinado
request = require('request');			//Permite realizar peticiones HTTP y Personalizadas
ftp = require("basic-ftp");				//Permite conexiones FTP
nodemiral = require('nodemiral');		//Permite conexiones SSH
shell = require('shelljs');				//Permite llamados al Sistema
NetcatClient = require('netcat/client') //Permite conexiones Custom
portscanner = require('portscanner') 	//Permite escaneo de puertos
smsclient = require('twilio')			//Permite enviar SMS

//Funciones
//Funcion Opcion #1 - Envio de Emails
function send_massive_emails(email_recipients, email_subject, email_body, email_count) {
	fileContents = fs.readFileSync('./conf/email.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	var transporter = nodemailer.createTransport({
		service: data.email_service,
		auth: {
			user: data.email_username,
			pass: data.email_password
		}
	});
	var mailOptions = {
		from: data.email_username,
		to: email_recipients,
		subject: email_subject,
		text: email_body
	}; 
	for(var i=0; i < email_count; i++){
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('[*] Email sent: ' + info.response);
				if (email_count != 1) {
					console.log("[*] Waiting for "+ data.email_interval + " seconds...");
					sleep(data.email_interval*1000);
				}
			}
		});
	}
}

//Funcion Opcion #2 - Solicitudes masivas HTTP
//Funcion Auxiliar
function request_http(http_site) {
	request('' + http_site, { json: true }, (err, res, body) => {
		if (res.statusCode == 200) {
			console.log("[*] Status: 200.");
		} else {
			console.log("[!] Status: " + toString(res.statusCode) +".");
		}
	});
}

function send_massive_http(http_site, http_count) {
	fileContents = fs.readFileSync('./conf/http.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	http_interval = data.http_interval;
	console.log("[*] Launching "+ http_count +" requests to "+ http_site +" ...");
	for(i=0; i < http_count; i++){
		console.log("[*] Launching request #" + i + "...");
		request_http(http_site);
		console.log("[*] Sleeping "+ http_interval +" seconds...");
		sleep(http_interval*1000);
	}
}

//Funcion Opcion #3 - Solicitudes masivas FTP
function send_massive_ftp(ftp_host, ftp_user, ftp_password, ftp_count) {
	fileContents = fs.readFileSync('./conf/ftp.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	ftp_interval = data.ftp_interval;
	ftp_secure = data.ftp_secure;
	for(var i=0; i < ftp_count; i++){
		console.log("[*] Sending request #" + i + "...");
		example()
		async function example() {
			const client = new ftp.Client()
			client.ftp.verbose = false;
			try {
				await client.access({
					host: ftp_host,
					user: ftp_user,
					password: ftp_password,
					secure: data.ftp_secure
				})
			}
			catch(err) {
				console.log("[!] Password rejected as expected.")
			}
			client.close()
		}
		console.log("[*] Sleeping "+ ftp_interval +" seconds...");
		sleep(ftp_interval*1000);
	}
}

//Funcion Opcion #4 - Solicitudes masivas SSH
function send_massive_ssh(ssh_host, ssh_user, ssh_password, ssh_port, ssh_count) {
	fileContents = fs.readFileSync('./conf/ssh.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	ssh_interval = data.ssh_interval;
	for(var i=0; i < ssh_count; i++){
		console.log("[*] Sending request #" + i + "...");
		try {
			var session = nodemiral.session(ssh_host, {username: ssh_user, password: ssh_password}, {ssh: {port: ssh_port}});
			session.execute('uname -a', function(err, code, logs) {
				console.log(logs.stdout);
			});
		} catch(err) {
			console.log("[!] Password rejected as expected.")
		}
		console.log("[*] Sleeping "+ ssh_interval +" seconds...");
		sleep(ssh_interval*1000);
	}
}

//Funcion Opcion #5 - Solicitudes masivas Custom
function send_massive_custom(custom_host,custom_port,custom_message,custom_count) {
	fileContents = fs.readFileSync('./conf/custom.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	custom_interval = data.custom_interval;
	for(var i=0; i < custom_count; i++){
		console.log("[*] Sending request #" + i + "...");
		const nc2 = new NetcatClient();
		nc2.addr(custom_host).port(parseInt(custom_port)).connect();
		nc2.send(custom_message+'\r\n\r\n');
		nc2.close();
		console.log("[*] Sleeping "+ custom_interval +" seconds...");
		sleep(custom_interval*1000);
	}
}

//Funcion Opcion #6 - Solicitudes slowloris
function send_slowloris(slow_url, slow_port, slow_sockets){
	command = "/usr/local/bin/sloww --host "+ slow_url +" --port "+ slow_port +" --sockets " + slow_sockets;
	shell.exec(command);
}

//Funcion Opcion #7 - Escaneo masivo de puertos
function send_massive_scan(custom_host,custom_port,custom_count) {
	fileContents = fs.readFileSync('./conf/custom.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	custom_interval = data.custom_interval;
	for(var i=0; i < custom_count; i++){
		console.log("[*] Sending request #" + i + "...");
		portscanner.checkPortStatus(custom_port, ''+custom_host, function(error, status) {
			console.log("[*] Port is "+status);
		})
		console.log("[*] Sleeping "+ custom_interval +" seconds...");
		sleep(custom_interval*1000);
	}
}

//Funcion Opcion #8 - Envio de SMS
function send_massive_sms(sms_number, sms_content, sms_count) {
	fileContents = fs.readFileSync('./conf/sms.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	account_sid = data.account_sid;
	token = data.token;
	sms_sender = data.sender;
	sms_interval = data.sms_interval;
	for(var i=0; i < sms_count; i++){
		console.log("[*] Sending request #" + i + "...");
		try {
			var client = require('twilio')("" + account_sid, "" + token);
			client.messages.create({
				from: "" + sms_sender,
				to: "" + sms_number,
				body: "" + sms_content
			}).then((message) => console.log("[*] SMS "+ message.sid + " sent."));
		} catch(err) {
			console.log("[!] Unable to send SMS: " + err)
		}
		console.log("[*] Sleeping "+ sms_interval +" seconds...");
		sleep(sms_interval*1000);
	}
}

//Funcion Opcion #9 - Llamado
function send_phone_call(call_number) {
	fileContents = fs.readFileSync('./conf/sms.yml', 'utf8');
	data = yaml.safeLoad(fileContents);
	account_sid = data.account_sid;
	token = data.token;
	call_sender = data.sender;
	console.log("[*] Calling " + call_number + "...")
	try {
		var client = require('twilio')("" + account_sid, "" + token);
		client.calls.create({
			url: 'http://demo.twilio.com/docs/voice.xml',
			to: "" + call_number,
			from: "" + call_sender
		//}).then(call => console.log("[*] Call " + call.sid + "initiated."));
	}).then((call) => console.log("[*] Call " + call.sid + " initiated."));
	} catch(err) {
		console.log("[!] Unable to initiate call: " + err)
	}	
}
	
function main() {
	console.log("\nRedBaron v"+ version +"\n\tadan_zx\n");
	console.log("[Main Menu]");
	console.log("\t[1] Send Massive Emails");
	console.log("\t[2] Massive HTTP Requests");
	console.log("\t[3] Massive FTP Requests");
	console.log("\t[4] Massive SSH Requests");
	console.log("\t[5] Massive Custom Requests");
	console.log("\t[6] Slowloris Attack (DDoS)");
	console.log("\t[7] Send Massive Port Scan");
	console.log("\t[8] Send Massive SMS");
	console.log("\t[9] Make a Phone Call");
	//Preguntar opción elegida
	var selected_option = readline.question("\n[?] Pick an option: ");
	//Chequear opción elegida
	if (selected_option == "1") {
		var email_recipients = readline.question("\n[?] Recipients (Comma separated): ");
		var email_subject = readline.question("\n[?] Subject: ");
		var email_body = readline.question("\n[?] Email Body: ");
		var email_count = readline.question("\n[?] Message Count: ");
		send_massive_emails(email_recipients, email_subject, email_body, email_count);
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else if (selected_option == "2") {
		var http_site = readline.question("\n[?] URL to request: ");
		var http_count = readline.question("\n[?] # of requests: ");
		send_massive_http(http_site, http_count);
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else if (selected_option == "3") {
		var ftp_host = readline.question("\n[?] Server Address: ");
		var ftp_user = readline.question("\n[?] FTP User: ");
		var ftp_password = readline.question("\n[?] FTP Pass: ");
		var ftp_count = readline.question("\n[?] # of requests: ");
		send_massive_ftp(ftp_host,ftp_user,ftp_password,ftp_count);
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else if (selected_option == "4") {
		var ssh_host = readline.question("\n[?] Server Address: ");
		var ssh_port = readline.question("\n[?] Server Port: ");
		var ssh_user = readline.question("\n[?] SSH User: ");
		var ssh_password = readline.question("\n[?] SSH Pass: ");
		var ssh_count = readline.question("\n[?] # of requests: ");
		send_massive_ssh(ssh_host, ssh_user, ssh_password, ssh_port, ssh_count);
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else if (selected_option == "5") {
		var custom_host = readline.question("\n[?] Server Address: ");
		var custom_port = readline.question("\n[?] Server Port: ");
		var custom_message = readline.question("\n[?] Message: ");
		var custom_count = readline.question("\n[?] # of requests: ");
		send_massive_custom(custom_host,custom_port,custom_message,custom_count);
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else if (selected_option == "6") {
		console.log("[!] Caution: You will have to manually stop this process.");
		var slow_host = readline.question("\n[?] Server Address: ");
		var slow_port = readline.question("\n[?] Server Port: ");
		var slow_sockets = readline.question("\n[?] # of Sockets: ");
		send_slowloris(slow_host,slow_port,slow_sockets);
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else if (selected_option == "7") {
		var custom_host = readline.question("\n[?] Server Address: ");
		var custom_port = readline.question("\n[?] Server Port: ");
		var custom_count = readline.question("\n[?] # of requests: ");
		send_massive_scan(custom_host,custom_port,custom_count);
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else if (selected_option == "8") {
		var sms_number = readline.question("\n[?] Receiver's Phone Number: ");
		var sms_content = readline.question("\n[?] SMS Content: ");
		var sms_count = readline.question("\n[?] # of requests: ");
		send_massive_sms(sms_number, sms_content, sms_count)
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else if (selected_option == "9") {
		console.log("[!] Warning: Due to NodeJS limitations, this function works better via CLI.");
		var receiver_number = readline.question("\n[?] Receiver's Phone Number: ");
		send_phone_call(receiver_number)
		var menu_continue = readline.question("\n[*] Press Any key to continue...");
		console.clear();
		main();
	} else {
		var menu_continue = readline.question("\n[!] Wrong option supplied. Press Any key to continue...");
		console.clear();
		main();
	}
}

function cli_mode() {
		if (process.argv[3] == "email") {
			send_massive_emails(process.argv[4], process.argv[5], process.argv[6], process.argv[7]);
		} else if (process.argv[3] == "http") {
			send_massive_http(process.argv[4], process.argv[5]);
		} else if (process.argv[3] == "ftp") {
			send_massive_ftp(process.argv[4], process.argv[5], process.argv[6], process.argv[7]);
		} else if (process.argv[3] == "ssh") {
			send_massive_ssh(process.argv[4], process.argv[5], process.argv[6], process.argv[7], process.argv[8]);
		} else if (process.argv[3] == "custom") {
			send_massive_custom(process.argv[4], process.argv[5], process.argv[6], process.argv[7]);
		} else if (process.argv[3] == "slowloris") {
			send_slowloris(process.argv[4], process.argv[5], process.argv[6]);
		} else if (process.argv[3] == "portscan") {
			send_massive_scan(process.argv[4], process.argv[5], process.argv[6]);
		} else if (process.argv[3] == "sms") {
			send_massive_sms(process.argv[4], process.argv[5], process.argv[6])
		} else if (process.argv[3] == "call") {
			send_phone_call(process.argv[4])
		} else if (process.argv[3] == "web") {
			console.log("[*] webGUI is a standalone module. Run it with: ./redbaron_webgui.js and browse localhost:2020.");
		} else {
			console.log("[!] Wrong option supplied.");
		}
}

function launcher() {
	console.clear();
	if (process.argv.length <= 2) {
		main();
	} else if(process.argv.length >= 2 && process.argv[2] == "--cli") {
		cli_mode();
	}
}

launcher();