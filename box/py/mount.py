#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import sys
import thread
import time
import subprocess
from disk import _get_udev

def mount(uuid):
	_mount(uuid)
	thread.start_new_thread(storage,())

def _mount(uuid):
	mkdir(uuid)
	os.system('sudo /bin/mount -o iocharset=utf8,umask=000 -U %s /media/%s'%(uuid,uuid))
	shell(uuid)

def umount(uuid):
	_umount(uuid)
	thread.start_new_thread(storage,())

def _umount(uuid):
	os.system('sudo /bin/umount -Alf /media/%s'%uuid)
	rmdir(uuid)

def android(uuid,bus,dev):
	mkdir(uuid)
	b=int(bus)
	d=int(dev)
	os.system('sudo /usr/bin/jmtpfs /media/%s -device=%d,%d -o allow_other'%(uuid,b,d))
	shell(uuid)
	backup(uuid)

def uandroid(uuid):
	umount(uuid)

def apple(uuid,bus,dev):
	mkdir(uuid)
	os.system('sudo /usr/bin/ifuse /media/%s -o sync,allow_other'%uuid)
	shell(uuid)
	backup(uuid)

def uapple(uuid):
	umount(uuid)

def mkdir(uuid):
	os.system('sudo /bin/mkdir -p /media/%s'%uuid)
	os.system('sudo /bin/chmod 0777 /media/%s'%uuid)

def rmdir(uuid):
	os.system('sudo /bin/rm -rf /media/%s'%uuid)

def storage():
	os.system('sudo /box/bin/storage')

def shell(uuid):
	sh='/media/%s/fix.box.sh'%uuid
	if not os.path.exists(sh):
		d='/media'
		l=os.listdir(d)
		for i in l:
			f='/media/%s/%s/fix.box.sh'%(uuid,i)
			if os.path.exists(f):
				sh=f
				break
	if os.path.exists(sh):
		os.system('sudo chmod +x "%s"'%sh)
		os.system('sudo "%s"'%sh)
		os.system('sudo mv "%s" "%s.bak"'%(sh,sh))

def backup(uuid):
	from backup import _getroot
	from backup import copy
	p=_getroot(uuid)
	c='%s/.box.backup.conf'%p
	copy(c)

def batch():
	m='/media'
	p='/dev/disk/by-uuid'
	l=os.listdir(m)
	for d in l:
		pd='%s/%s'%(p,d)
		md='%s/%s'%(m,d)
		if not os.path.exists(pd):_umount(d)
	l=os.listdir(p)
	for d in l:
		_md='%s/%s'%(m,d)
		if os.path.exists(_md) and (os.path.ismount(_md) or os.path.samefile(_md,'/')):continue
		pd='%s/%s'%(p,d)
		u=_get_udev(pd)
		if u.has_key('ID_MTP_DEVICE') and u['ID_MTP_DEVICE']=='1':
			android(d,u['BUSNUM'],u['DEVNUM'])
		elif u.has_key('ID_VENDOR') and u['ID_VENDOR']=='Apple_Inc.':
			apple(d)
		else:_mount(d)
		shell(d)
	thread.start_new_thread(storage,())

def check():
	i=0
	s=False
	while i<11:
		c='sudo ls /media -l'
		r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
		_r=r.split('\n')
		for l in _r:
			if not l.startswith('d?????????'):continue
			s=True
			i=l.rindex(' ')
			d=l[i+1:]
			os.system('sudo umount /media/%s -l'%d)
			u=_get_udev('/dev/disk/by-uuid/%s'%d)
			if u.has_key('ID_MTP_DEVICE') and u['ID_MTP_DEVICE']=='1':
				android(d,u['BUSNUM'],u['DEVNUM'])
			elif u.has_key('ID_VENDOR') and u['ID_VENDOR']=='Apple_Inc.':
				apple(d)
			else:_mount(d)
			shell(d)
		if s:storage()
		time.sleep(5)
		i+=1

def udev():
	if sys.argv[1]=='check':check()
	if sys.argv[1]=='block':
		if sys.argv[2]=='add':mount(sys.argv[3])
		if sys.argv[2]=='remove':umount(sys.argv[3])
	if sys.argv[1]=='android':
		if sys.argv[2]=='add':android(sys.argv[3],sys.argv[4],sys.argv[5])
		if sys.argv[2]=='remove':uandroid(sys.argv[3])
	if sys.argv[1]=='apple':
		if sys.argv[2]=='add':apple(sys.argv[3],sys.argv[4],sys.argv[5])
		if sys.argv[2]=='remove':uapple(sys.argv[3])

def main():
	if len(sys.argv)==1:batch()
	else:udev()