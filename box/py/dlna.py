#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import auth
import info
import files
import service
CONF='/box/etc/minidlna.conf'
DB='/box/storage/System/files.db'
NAME='minidlna'

def get():
	u,a=auth._auth()
	if not a:return 403
	p={'media_dir':''}
	info._get_name_value(CONF,p)
	p['media_dir']=files._get_uipath(p['media_dir'],u)
	p['active']=service._service_status(NAME)
	p['enabled']=service._service_enabled(NAME)
	return p

def set():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	e=rq['enable']
	p=rq['path']
	o=rq['option']
	d=get()['media_dir']
	if d!=p:
		p=files._get_path(p,u)
		info._set_name_value(CONF,{'media_dir':p})
		os.system('sudo chmod -R 777 "%s"'%d)
		os.system('sudo chmod -R 777 "%s"'%p)
	if o=='rescan':
		os.system('sudo rm -rf %s'%DB)
		o='restart'
	service._enable(e,NAME)
	service._systemctl(o,NAME)
	return 200