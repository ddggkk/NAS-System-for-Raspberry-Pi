#!/usr/bin/python
# -*- coding:utf-8 -*-
import json
import web
import sys
import auth
import files
import os
reload(sys)
sys.setdefaultencoding('utf8')

def post():
	p=web.ctx.path
	f=p.replace('/box/','',1).split('/')
	_f='.'.join(f)
	f.pop()
	m='.'.join(f)
	try:
		exec 'import %s'%m
		f=eval(_f)
		r=f()
	except Exception,e:r='System Error:%s'%e
	return response(r)

def put():
	try:r=files.write()
	except Exception,e:r='System Error:%s'%e
	return response(r)

def response(r):
	if isinstance(r,str):
		r={'status':0,'message':r}
	if isinstance(r,int):
		if r>=200 and r<300:r={'message':r}
		else:r={'status':0,'message':r} 
	r=json.dumps(r)
	i=web.input()
	if i.has_key('callback'):
		c=i['callback']
		r='%s(%s)'%(c,r)
		web.header('Content-type','text/javascript')
	elif i.has_key('script'):
		r='<script>(%s)</script>'%r
		web.header('Content-type','text/html')
	else:web.header('Content-type','text/json')
	return r;

def PROXY(p,url=False,header=True,utf8=True):
	u,a=auth._auth()
	if not u:return 403
	import urllib2,cookielib
	if url:u=url
	else:u=web.ctx.fullpath
	e=web.ctx.env
	d=web.data()
	h={}
	for i in e:h[i.replace('HTTP_','')]=e[i]
	u='http://127.0.0.1:%s%s'%(p,u)
	if header:
		o=urllib2.build_opener(urllib2.HTTPCookieProcessor(cookielib.CookieJar()))
		r=o.open(urllib2.Request(u,d,h))
	else:
		o=urllib2.build_opener()
		r=o.open(u)
	b=r.read()
	if utf8:return b.decode('utf8')
	else:return b

class BOX:
	def GET(self): 
		return post()
	def POST(self):  
		return post()

class FILE:
	def GET(self):
		return files.read()
	def PUT(self):
		return put()

class SHARE:
	def GET(self):
		return files.share()
	def PUT(self):
		return put()

class JSONRPC:
	def GET(self):
		return self.POST()
	def POST(self):
		if web.ctx.fullpath=='/jsonrpc':return ARIA2()
		else:return KODI()

def ARIA2():
	os.system('sudo aria2c --conf-path=/box/etc/aria2.conf -c -D')
	return PROXY(6800)

def KODI():
	d=web.data()
	u=web.ctx.fullpath
	c="curl 'http://127.0.0.1:8080%s' -H 'Content-Type: application/json' --data-binary '%s' --compressed"%(u,d)
	import subprocess
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return r

class DAAP:
	def GET(self):
		return self.POST()
	def POST(self):
		return PROXY(3689,utf8=False)

class DLNA:
	def GET(self):
		return self.POST()
	def POST(self):
		return PROXY(8200)

class SHELL:
	def GET(self):
		return self.POST()
	def POST(self):
		web.header('Content-type','text/json; charset=utf-8')
		u,a=auth._auth()
		if not a:return '{"status":0,"message":403}'
		import subprocess
		c=web.cookies().get('shellInABox')
		ck='Cookie:shellInABox=%s'%c
		data=[]
		d=web.data()
		c="sudo curl 'https://127.0.0.1:4200/?' -H '%s' -H 'Pragma: no-cache' -H 'DNT: 1' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: zh-CN,zh;q=0.9' -H 'Upgrade-Insecure-Requests: 1' -H 'Cache-Control: no-cache' -H 'Connection: keep-alive' --data '%s'  --compressed --insecure 2>/dev/null"%(ck,d)
		r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
		return r

class CAMERA:
	def GET(self):
		u,a=auth._auth()
		if u:
			p=web.ctx.fullpath
			v=p.split('/')[2]
			url='http://127.0.0.1:%s/?action=stream'%(8000+int(v))
			import urllib2
			o=urllib2.build_opener()
			r=o.open(url)
			b=r.read(1024)
			if b.startswith('--'):
				h=b[:b.index('\r\n')].replace('--','')
				web.header('Content-type','multipart/x-mixed-replace; boundary=%s'%h)
			yield b
			while len(b):
				b=r.read(1024)
				yield b
		else:
			yield ''
	def POST(self):
		return self.GET()

class ROOT:
	def GET(self):
		return self.POST()
	def POST(self):
		web.header('Content-type','text/html; charset=utf-8')
		from info import base
		i=json.dumps(base())
		_i='<script>parse(%s)</script>'%i
		f=open('/box/www/index.html')
		r=f.read()
		f.close()
		return '%s%s'%(r,_i)

def main():
	u=(
		'/','ROOT'
		,'/index.html','ROOT'
		,'/box/.*','BOX'
		,'/shell','SHELL'
		,'/camera/.*','CAMERA'
		,'/jsonrpc?.*','JSONRPC'
		,'/login.*','DAAP'
		,'/update.*','DAAP'
		,'/databases/.*','DAAP'
		,'/ctl/.*','DLNA'
		,'/AlbumArt/.*','DLNA'
		,'/MediaItems/.*','DLNA'
		,'/Resized/.*','DLNA'
		,'/Thumbnails/.*','DLNA'
		,'/root:/.*','FILE'
		,'/file:/.*','FILE'
		,'/home:/.*','FILE'
		,'/desktop:/.*','FILE'
		,'/public:/.*','FILE'
		,'/share:/.*','FILE'
		,'/network:/.*','FILE'
		,'/ftp:/.*','FILE'
		,'/smb:/.*','FILE'
		,'/.*','SHARE'
	)
	APP=web.application(u,globals())
	web.wsgi.runwsgi=lambda func,addr=None:web.wsgi.runfcgi(func, addr)
	APP.run()