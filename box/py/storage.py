#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import time
import sys
from disk import _get_udev
reload(sys)  
sys.setdefaultencoding('utf8')

def get():
	p='/media'
	l=os.listdir(p)
	storage={'internal':{},'external':{}}
	root=''
	for f in l:
		try:
			uf='/dev/disk/by-uuid/%s'%f
			if not os.path.exists(uf):continue
			_p='%s/%s'%(p,f)
			print f
			if os.path.samefile('/media/%s'%f,'/'):root=f
			print root
			if not os.path.ismount(_p):continue
			udev=_get_udev(uf)
			if udev['SUBSYSTEM']=='usb':continue
			s=os.statvfs(_p)
			a=s.f_bfree*s.f_bsize
			b='mmc'
			if udev.has_key('ID_BUS'):b=udev['ID_BUS']
			d=udev['ID_FS_UUID']
			tp=udev['ID_FS_TYPE']
			pt='internal'
			if b=='usb':pt='external'
			if tp:storage[pt][f]={'size':a,'uuid':d}
		except:continue
	he=''
	size=0
	e=storage['external']
	for _e in e:
		E=e[_e]
		sz=E['size']
		if sz>size:
			size=sz
			he=E['uuid']
	hi=''
	size=0
	i=storage['internal']
	for _i in i:
		I=i[_i]
		if os.path.samefile('/media/%s'%I['uuid'],'/') or  os.path.samefile('/media/%s'%I['uuid'],'/boot'):continue
		sz=I['size']
		if sz>size:
			size=sz
			hi=I['uuid']
	r=root
	if he!='':r=he
	if hi!='':r=hi
	return r

def set():
	s='/box/storage'
	r=os.path.realpath(s)
	d=os.path.dirname(r)
	if os.path.ismount(d):
		if os.path.exists(r):return True
		os.system('sudo mkdir "%s/storage"'%d)
		os.system('sudo chmod 0777 "%s/storage"'%d)
		return True
	d=get()
	if not d or d=='':return False
	if d!=r.replace('/media/',''):
		os.system('sudo rm -rf /box/storage')
		os.system('sudo mkdir "/media/%s/storage"'%d)
		os.system('sudo chmod 0777 "/media/%s/storage"'%d)
		os.system('sudo ln -s "/media/%s/storage" /box/storage'%d)
	return True

def drive():
	d=['D','E','F','G','H','I','G','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
	p='/box/drives'
	m='/media'
	l=os.listdir(m)
	for f in l:
		if not os.path.exists('/dev/disk/by-uuid/%s'%f):continue
		u='%s/%s'%(m,f)
		if os.path.samefile(u,'/'):
			if os.path.exists('/box/drives/C:'):
				if os.path.realpath('/box/drives/C:')==u:continue
				else:os.system('sudo rm "/box/drives/C:"')
			os.system('cd /box/drives && sudo ln -s "%s" "C:"'%u)
			continue
		if not os.path.ismount(u):continue
		if os.path.samefile(u,'/boot'):
			if os.path.exists('/box/drives/D:'):
				if os.path.realpath('/box/drives/D:')==u:continue
				else:os.system('sudo rm "/box/drives/D:"')
			os.system('cd /box/drives && sudo ln -s "%s" "D:"'%u)
			continue
		b=False
		for i in d:
			_f='%s/%s:'%(p,i)
			if os.path.realpath(_f)==u:
				b=True
				break
		if b==True:continue
		for i in d:
			_f='%s/%s:'%(p,i)
			if os.path.exists(_f) and os.path.ismount(os.path.realpath(_f)):continue
			if os.path.exists(_f):os.system('sudo rm "%s"'%_f)
			os.system('cd /box/drives && sudo rm -rf "%s:" && sudo ln -s "%s" "%s:"'%(i,u,i))
			break

def uptime():
	u=open('/proc/uptime').read()
	return float(u.split(' ')[0])

def check():
	e='/box/etc'
	d='/box/drives'
	s='/box/storage'
	a='%s/Applications'%s
	u='%s/Users'%s
	p='%s/Users/Public'%s
	t='%s/System'%s
	m='%s/Media'%s
	c='%s/Camera'%s
	if not os.path.ismount(os.path.realpath(s)):
		if not set():return
	os.system('sudo mkdir -p %s'%d)
	os.system('sudo mkdir -p %s'%a)
	os.system('sudo mkdir -p %s'%u)
	os.system('sudo mkdir -p %s'%p)
	os.system('sudo chmod 777 %s'%p)
	os.system('sudo mkdir -p %s'%t)
	os.system('sudo chmod 777 %s'%t)
	os.system('sudo mkdir -p %s'%m)
	os.system('sudo chmod 777 %s'%m)
	os.system('sudo mkdir -p %s'%c)
	os.system('sudo chmod 777 %s'%c)
	from auth import users
	for i in users():
		_u=i['name']
		_p='%s/%s'%(u,_u)
		os.system('sudo mkdir -p %s'%_p)
		os.system('sudo mkdir -p %s/.network'%_p)
		os.system('sudo mkdir -p %s/Desktop'%_p)
		os.system('sudo mkdir -p %s/Downloads'%_p)
		os.system('sudo mkdir -p %s/Backup'%_p)
		os.system('sudo chmod -R 0777 %s'%_p)
		os.system('sudo chown -R %s:box %s'%(_u,_p))
	if os.path.islink('/home'):
		if os.path.realpath('/home')!=os.path.realpath('/box/storage/Users'):
			os.system('cd / && sudo rm -rf home && sudo ln -s /box/storage/Users home')
	else:
		os.system('cd / && sudo mv /home /home.orig && sudo ln -s /box/storage/Users home')

def main():
	check()
	drive()