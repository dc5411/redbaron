RedBaron
======

# About RedBaron

RedBaron is a Framework designed exclusively to generate distractions to facilitate a possible cyberattack.

RedBaron was created by Adan_zx (Emmanuel Di Battista) of [DEF CON Group 5411] (https://github.com/dc5411).


## Requisites

```bash
#NodeJS Modules
npm install -g nodemailer js-yaml system-sleep request readline-sync sloww basic-ftp nodemiral shelljs netcat portscanner express body-parser twilio
```

## Features
- Mass sending of emails.
- Simulation of bruteforcing of services such as FTP, SSH, Telnet, Basic Auth.
- Simulation of navigation or abuse of APIs (HTTP requests).
- Simulation of denial of service attacks (Slowloris).
- Simulation of simple port scans.
- Sending SMS and phone calls.
- Integration with a variety of APIs.


## Known Issues

Sometimes installing the libraries globally can cause problems and the system may end up not finding any library. In that case the local installation (without the -g switch) of libraries solves the problem.


## Usage

Run:

```bash
#Interactive
node redbaron.js

#CLI 
node redbaron.js --cli [args]

#WebGUI + API
node redbaron_web.js
```


## CLI Examples

```bash
#send_massive_emails(email_recipients, email_subject, email_body, email_count);
./redbaron.js --cli email NOC@evilcorp.com "[Nagios] Server down" "Server APP-DB is down!" 1

#send_massive_http(http_site, http_count)
./redbaron.js --cli http https://www.birminghamcyberarms.co.uk 4

#send_massive_ftp(ftp_host, ftp_user, ftp_password, ftp_count)
./redbaron.js --cli ftp evilcorp.com admin mypass2020 5

#send_massive_ssh(ssh_host, ssh_user, ssh_password, ssh_port, ssh_count)
./redbaron.js --cli ssh evilcorp.com admin mypass2020 22 3

#send_massive_custom(custom_host,custom_port,custom_message,custom_count)
./redbaron.js --cli custom evilcorp.com 80 "DC5411 WAS HERE" 5

#send_slowloris(host, port, sockets_count);
./redbaron.js --cli slowloris www.birminghamcyberarms.co.uk 443 5

#send_massive_scan(custom_host,custom_port,custom_count)
./redbaron.js --cli portscan evilcorp.com 22 5

#send_phone_call(receiver_number)
./redbaron.js --cli call "+540011112222"

#send_massive_sms(sms_number, sms_content, sms_count)
./redbaron.js --cli sms "+540011112222" "Test Message" 1

#start_web_server()
./redbaron.js --cli web
```

## Configuration Files

If you would like to tweak anything, please check the configuration files in the 'conf' folder.

## Commands Compatibility

|Command| Interactive | CLI | webGUI | API |
|---|---|---|---|---|
| call | ⛔ | ✅ | ✅ | ✅ |
| sms | ✅ | ✅ | ✅ | ✅ |
| http | ✅ | ✅ | ✅ | ✅ |
| ftp | ✅ | ✅ | ✅ | ✅ |
| email | ✅ | ✅ | ✅ | ✅ |
| custom | ✅ | ✅ | ✅ | ✅ |
| portscan | ✅ | ✅ | ✅ | ✅ |
| slowloris | ✅ | ✅ | ⛔ | ⛔ |
| ssh | ✅ | ✅ | ✅ | ✅ |

## Conferences

|#| Date | Conference | Link to Video | Link to Slides |
|---|---|---|---|---|
|1| NOV-2020 | YASCon India | https://youtu.be/c-V6RYS5fYY?t=15065 | https://docs.google.com/presentation/d/1EX28RmDhzAdWpxXdrfFhb2td_vRTC9smu7jxFFC0_44/edit?usp=sharing |