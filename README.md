ninja-fboxaha
===
This Ninjablock driver makes Fritz!Dect 200 and Fritz!Powerline 546E devices accassible from within the Ninjablock dashboard.
Please be aware that this is not an official driver form the manufacturer. I created this for my personal use and want to share it.

## Usage
Use the "Drivers" button on your dashboard to add your Fritzbox(es) or 546E devices. The driver searches for every aha device connected to your box. Note that you need at least OS 05.50 as firmware (tested only with Fritzbox 7390). Please add only one box if you activated to share "Smart Home" functionality across your Fritzbox home network, because currently the driver is not able to detect duplicated aha devices.

The password will not be encrypted (till now). So, I strongly recommend to create a dedicated account in the systems settings of your box, that is restricted to the use of the "Smart Home" functionality and to deactivate the permission to access the box from the internet with this account.

![ScreenShot](https://raw.github.com/benzarts/ninja-fboxaha/master/dashboard.png)

The driver creates two devices on your ninjablock for every aha device that was detected during the driver initialization. Devices of the device type power allow you to monitor the power consumption and devices of the device type state allow you to see the current outlet state or to change the state (updates occur every 30 seconds). Unfortunately you have to add the required custom states manually via the dashboard. Click on the settings icon of the state device and select "Add New State", type "on" into the text field and click on "Save State". Repeat the procedure for state "off". 
 
You can use the reconnect option in the driver's settings to force a new search for the selected box (experimental). Removing a box via the driver's settings will remove it from the driver's configuration and should also stop the corresponding devices to request updates from your Fritzbox(es) or 546E devices. You have to manually remove the devices from your dashboard or you can keep them in case you want to reconnect the box later (the device ID will be the same again). Changes (host, username, password) to an already configured box require a restart of the ninjablock service e.g. via command line. Log into the Ninjablock via SSH
```
  $ sudo service ninjablock restart
```

## Installation
Log into the Ninjablock via SSH 
```
  $ cd /opt/ninja/drivers/
  $ rm -rf ninja-fboxaha
  $ git clone https://github.com/benzarts/ninja-fboxaha.git ninja-fboxaha
  $ cd ninja-fboxaha/
  $ npm install
  $ service ninjablock restart
```

## Credits
I'm using the following node modules to make my life easier:
[xml2js](https://github.com/Leonidas-from-XIV/node-xml2js),
[cheerio](https://github.com/MatthewMueller/cheerio),
[iconv-lite](https://github.com/ashtuchkin/iconv-lite)

## License (MIT)
Copyright (c) 2013 Ben Looning

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
