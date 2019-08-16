#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import auth
import info
import files
import service
CONF='/box/etc/forked-daapd.conf'
DB='/box/storage/System/songs3.db'
DBC='/box/storage/System/cache.db'
NAME='forked-daapd'

def get():
	u,a=auth._auth()
	if not a:return 403
	p={'directories':''}
	info._get_name_value(CONF,p,equal='=')
	p['directories']=files._get_uipath(p['directories'].strip(' {"}'),u)
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
	d=get()['directories']
	if d!=p:
		p=files._get_path(p,u)
		info._set_name_value(CONF,{'directories':'{"%s"}'%p})
		os.system('sudo chmod -R 777 "%s"'%d)
		os.system('sudo chmod -R 777 "%s"'%p)
	if o=='rescan':
		os.system('sudo rm -rf %s'%DB)
		os.system('sudo rm -rf %s'%DBC)
		o='restart'
	service._enable(e,NAME)
	service._systemctl(o,NAME)
	return 200