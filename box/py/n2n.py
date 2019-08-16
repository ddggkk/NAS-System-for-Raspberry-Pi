#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import auth
import info
import files
import service
CONF='/box/etc/n2n.conf'
NAME='n2n'

def get():
	u,a=auth._auth()
	if not a:return 403
	p={
		'N2N_SUPERNODE':''
		,'N2N_SUPERNODE_PORT':''
		,'N2N_COMMUNITY':''
		,'N2N_KEY':''
		,'N2N_IP':''
	}
	info._get_name_value(CONF,p)
	p['N2N_SUPERNODE']=p['N2N_SUPERNODE'].strip('"')
	p['N2N_SUPERNODE_PORT']=p['N2N_SUPERNODE_PORT'].strip('"')
	p['N2N_COMMUNITY']=p['N2N_COMMUNITY'].strip('"')
	p['N2N_KEY']=p['N2N_KEY'].strip('"')
	p['N2N_IP']=p['N2N_IP'].strip('"')
	p['active']=service._service_status(NAME)
	p['enabled']=service._service_enabled(NAME)
	return p

def set():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	e=rq['enable']
	o=rq['option']
	s=rq['N2N_SUPERNODE']
	p=rq['N2N_SUPERNODE_PORT']
	c=rq['N2N_COMMUNITY']
	k=rq['N2N_KEY']
	i=rq['N2N_IP']
	cf={
		'N2N_SUPERNODE':'"%s"'%s
		,'N2N_SUPERNODE_PORT':'"%s"'%p
		,'N2N_COMMUNITY':'"%s"'%c
		,'N2N_KEY':'"%s"'%k
		,'N2N_IP':'"%s"'%i
	}
	info._set_name_value(CONF,cf)
	service._enable(e,NAME)
	service._systemctl(o,NAME)
	return 200