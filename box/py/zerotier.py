#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import json
import subprocess
import auth
import service
NAME='zerotier-one'
CONF='/box/etc/zerotier.conf'

def get():
	u,a=auth._auth()
	if not a:return 403
	e=service._service_enabled(NAME)
	a=service._service_status(NAME)
	d=[]
	p='/var/lib/zerotier-one/networks.d'
	if os.path.exists(p):
		ls=os.listdir(p)
		for l in ls:
			if not l.endswith('.conf'):continue
			if '.local.conf' in l:continue
			d.append(l[:-5])
	c='sudo zerotier-cli listnetworks -j'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	if '0 listnetworks' in r or r=='':r='[]'
	return {'networks':d,'enabled':e,'active':a,'detail':json.loads(r)}

def set():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	e=rq['enable']
	o=rq['option']
	service._enable(e,NAME)
	service._systemctl(o,NAME)
	return 200

def add():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	n=rq['name']
	os.system('sudo zerotier-cli join %s'%n)
	return 200

def remove():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	n=rq['name']
	os.system('sudo zerotier-cli leave %s'%n)
	return 200