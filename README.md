# Raspberry-Pi-NAS
NAS System for Raspberry Pi

CONTACT ME

Skype: ding_guokai
QQ Group：656951311


HOW TO INSTALL

1. Download Raspberry-Pi-NAS system img file: 2019-01-09.raspberrypi.nas.img.7z
   
   https://pan.baidu.com/s/1BJN_7P-R5xCUEkNIMdiqBw
   
2. Download Win32DiskImager：

   https://sourceforge.net/projects/win32diskimager/files/latest/download
    
3. Insert SD card to your PC (if there is no SD card interface in your PC, you should buy a USB adapter)

4. Start Win32DiskImager and write img file to your SD card


START RASPBERRY PI

1. Connect the net cable to your Pi.

2. If you have net cable and use wifi instead, do as the following:
	1) Insert SD card to your PC，copy sample_wpa_supplicant.conf at 
	2) Write the following content to a file named "wpa_supplicant.conf" and save it to the boot partition of the SD card:
	3) Insert SD card back to your pi.

ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev

update_config=1

country=GB

network={

	ssid="Your-WiFi-Name"
	
	psk="Your-WiFi-Password"
	
	key_mgmt=WPA-PSK
	
}
	
3. Turn on your pi.

4. Now you can visit the webUI of your Pi with any url of the following:
	1) https://box
	2) http://box
	3) https://box.local
	4) http://box.local
  
5. The first time you use this system, you can login with username pi password raspberry
   After one day, a registeraton code will be needed.
   Contact me with skype (ding_guokai) to get you registeraton code.
   

FUNCTIONALITIES

1. Aria2 Dowloader
2. Backup your mobile
3. Camera Monitoring
4. Disk Manager
5. DLNA (minidlna)
6. File Manager 
7. iTunes (forked-daapd)
8. n2n Remote Connection, here are some free n2n servers
	1) 112.5.73.151:10082
	2) n2n.lu8.win:10082
	3) remoteqth.com:82
	4) 106.186.30.16:6489
	5) n2n.lucktu.com:10082
9. Samba Windows Sharing
10. Web Sharing (if you have a public ip address)
11. System Temperature
12. Text Editor
13. Trans File Encode
14. Zerotier Remote Connection (visit zerotier.com to get more information)
15. System Settings
16. Kodi

TIPS

1. Input address like below in Windows Explorer, you can visit a ftp server。

    ftp://username:password@IP_Address/

2. Input address like below Windows Explorer, you can visit shared files from windows.

    smb://username:password@IP_Address/

3. Input command below in terminal, you can wake up your computer with wol supported

    wakeonlan xx:xx:xx:xx:xx:xx
