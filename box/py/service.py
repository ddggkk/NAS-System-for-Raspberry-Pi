#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import subprocess
import auth

def set():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	o=rq['option']
	n=rq['name']
	_systemctl(o,n)
	return 200

def enable():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	n=rq['name']
	e=rq['enabled']
	return _enable(e,n)

def start():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	n=rq['name']
	_systemctl('start',n)
	return 200

def restart():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	n=rq['name']
	_systemctl('restart',n)
	return 200

def stop():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	n=rq['name']
	_systemctl('stop',n)
	return 200

def _enable(e,n):
	if e=='true':e='enable'
	else:e='disable'
	_systemctl(e,n)
	return 200

def _service_enabled(s):
	r=_systemctl('is-enabled',s)
	if r.endswith('enabled'):return True
	return False

def _service_status(s):
	r=_systemctl('is-active',s)
	if r=='active':return True
	return False

def _systemctl(o,s):
	c='sudo systemctl %s %s.service'%(o,s)
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return r.replace('\n','')