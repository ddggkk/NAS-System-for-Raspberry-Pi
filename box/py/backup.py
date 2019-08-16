#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import auth
import json
import subprocess
from files import _get_path,_get_uipath
from disk import _get_udev
from info import _get_name_value,_set_name_value
FOLDER='/home/%s/Backup'
CONF='/box/etc/backup.conf'

def get():
	u,a=auth._auth()
	if not a:return 403
	r=[]
	d='/media'
	l=os.listdir(d)
	for i in l:
		udev=_get_udev('/dev/disk/by-uuid/%s'%i)
		if udev.has_key('ID_MTP_DEVICE') or (udev.has_key('ID_VENDOR') and udev['ID_VENDOR']=='Apple_Inc.'):r.append({'vendor':udev['ID_VENDOR'],'model':udev['ID_MODEL'],'uuid':i})
	d='/home/%s/.network'%u
	l=os.listdir(d)
	for i in l:
		f='%s/%s'%(d,i)
		if not i.startswith('ftp') or not os.path.ismount(f):continue
		p='%s/DCIM'%f
		if os.path.exists(p):r.append({'ftp':i})
	return r

def getconf():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	c=_getconf(p,u)
	c['to']=_get_uipath(c['to'],u)
	return c;

def setconf():
	u,a=auth._auth()
	if not u:return 403
	rq=web.input()
	p=rq['path']
	b=rq['backup']
	t=rq['to']
	f=rq['folder']
	a=rq['auto']
	t=_get_path(t,u)
	c={'backup':b,'to':t,'folder':f,'auto':a}
	_p=_getpath(p,u)
	f='%s/.box.backup.conf'%_p
	_set_name_value(f,c)
	copy(f)
	return 200


def check():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	ftp=rq['ftp']
	c='curl --connect-timeout 3 -m 1 "%s"'%ftp
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	if 'Failed to connect to' in r or 'Resolving timed out' in r:return {'status':0,'message':'Failed to connect to %s'%ftp}
	_get_path(ftp,u)
	return 200

def getpath():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	_p=_getpath(p,u)
	ls=os.listdir(_p)
	r=[]
	for l in ls:
		if l.startswith('.') or not os.path.isdir('%s/%s'%(_p,l)):continue
		r.append(l)
	r.sort(key=unicode.lower)  
	return r;

def _getpath(p,u):
	if p.startswith('ftp_'):
		_p='/home/%s/.network/%s'%(u,p)
	else:
		if not '/' in p:
			_p=_getroot(p)
		else:
			i=p.index('/')
			_p=_getroot(p[:i])+p[i:]
	return _p

def _getroot(p):
	d='/media/%s'%p
	if os.path.exists('%s/DCIM'):return d
	ls=os.listdir(d)
	l=ls[0]
	return '%s/%s'%(d,l)

def _getconf(p,u):
	_p=_getpath(p,u)
	c='%s/.box.backup.conf'%_p
	if not os.path.exists(c):c=CONF
	r={'backup':'["DCIM"]','to':'/box/storage/Backup','folder':'','auto':'no'}
	_get_name_value(c,r)
	r['backup']=json.loads(r['backup'])
	return r;

def copy(conf,udev=False):
	import thread
	thread.start_new_thread(_copy,(conf,udev))

def _copy(conf,udev=False):
	if not os.path.exists(conf):return
	r={'backup':'','to':'','auto':'','folder':''}
	_get_name_value(conf,r)
	r['backup']=json.loads(r['backup'])
	t=r['to']
	b=r['backup']
	f=r['folder']
	a=r['auto']
	if udev and a!='true':return
	F=os.path.dirname(conf)
	T='%s/%s'%(t,f)
	os.system('sudo mkdir -p "%s"'%T)
	for i in b:
		if i=='':continue
		_F='%s/%s'%(F,str(i))
		_T=os.path.dirname('%s/%s'%(T,str(i)))
		os.system('sudo mkdir -p "%s"'%_T)
		os.system('sudo cp -nrp "%s" "%s"'%(_F,_T))
	os.system('sudo chown -R root:root "%s"'%T)