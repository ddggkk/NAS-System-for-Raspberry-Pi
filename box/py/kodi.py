#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import subprocess
import auth

def status():
	u,a=auth._auth()
	if not a:return 403
	c='ps aux|grep kodi_v7.bin'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	if '--lircdev' in r:return {'running':True}
	return {'running':False}

def power():
	u,a=auth._auth()
	if not a:return 403
	s=status()
	if s['running']:return stop()
	return start()
	
def start():
	u,a=auth._auth()
	if not a:return 403
	stop()
	os.system('sudo kodi')
	return 200

def stop():
	u,a=auth._auth()
	if not a:return 403
	os.system('sudo killall kodi_v7.bin')
	return 200