#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import auth
import subprocess
from info import _get_name_value,_set_name_value
CONF='/box/etc/camera%s.conf'

def get():
	u,a=auth._auth()
	if not u:return 403
	p='/dev'
	ls=os.listdir(p)
	v=[]
	for l in ls:
		if l.startswith('video'):
			d=l.replace('video','')
			i=_get_main_pid(d)
			r=_get_record_pid(d)
			s={'dev':d,'running':i,'recording':r}
			v.append(s)
	return v

def start():
	u,a=auth._auth()
	if not u:return 403
	rq=web.input()
	d=rq['dev']
	return _start(d)

def stop():
	u,a=auth._auth()
	if not u:return 403
	rq=web.input()
	p=rq['pid']
	r=rq['rid']
	return _stop(p,r)

def snapshot():
	u,a=auth._auth()
	if not u:return 403
	import time
	rq=web.input()
	d=rq['dev']
	_d=8000+int(d)
	t=int(time.time())
	f='/box/storage/Camera/%s'%d
	os.system('sudo mkdir -p %s'%f)
	os.system('sudo chmod 0777 %s'%f)
	c='sudo wget http://127.0.0.1:%s/?action=snapshot -O %s/%s.jpg'%(_d,f,t)
	os.system(c)
	return 200

def record():
	u,a=auth._auth()
	if not u:return 403
	import time
	rq=web.input()
	d=rq['dev']
	_d=8000+int(d)
	t=int(time.time())
	f='/box/storage/Camera/%s'%d
	os.system('sudo mkdir -p %s'%f)
	os.system('sudo chmod 0777 %s'%f)
	c='ffmpeg -i "http://127.0.0.1:%s/?action=stream" "%s/%s.mp4"'%(_d,f,t)
	subprocess.Popen(c,shell=True)  
	return {'pid':_get_record_pid(d)}

def stoprecord():
	u,a=auth._auth()
	if not u:return 403
	rq=web.input()
	d=rq['pid']
	d=int(d)
	os.kill(d,3)
	return 200

def getconf():
	u,a=auth._auth()
	if not u:return 403
	rq=web.input()
	d=rq['dev']
	return _getconf(d)

def setconf():
	u,a=auth._auth()
	if not u:return 403
	rq=web.input()
	d=rq['dev']
	m=rq['mode']
	s=rq['size']
	f=rq['frequency']
	p={'mode':m,'size':s,'frequency':f}
	c=CONF%d
	_set_name_value(c,p)
	i=_get_main_pid(d)
	r=_get_record_pid(d)
	_stop(i,r)
	_start(d)
	return 200

def screen():
	u,a=auth._auth()
	if not u:return 403
	rq=web.input()
	d=rq['dev']
	p=8000+int(d)
	_play('http://127.0.0.1:%s/?action=stream'%p,'')
	return 200

def _start(d):
	i=_get_main_pid(d)
	if i:return {'pid':i}
	p=_getconf(d)
	y=''
	if p['mode'] == 'yuv':y='-y'
	r='-r %s' % p['size']
	f='-f %s' % p['frequency']
	c='mjpg_streamer -i "/usr/local/lib/input_uvc.so -d /dev/video%s %s %s %s" -o "/usr/local/lib/output_http.so -p %d -w /box/www" > /dev/null 2>&1 &' % (d, y, r, f, 8000 + int(d))
	subprocess.Popen(c,shell=True)
	return {'pid':_get_main_pid(d)}

def _stop(p,r):
	if r!='':os.kill(int(r),3)
	if p!='':os.kill(int(p),9)
	return 200

def _getconf(d):
	c=CONF%d
	if not os.path.exists(c):c=CONF%0
	from disk import _get_udev
	u=_get_udev('/dev/video%s'%d)
	p={'mode':'','size':'','frequency':''}
	_get_name_value(c,p)
	if u.has_key('ID_USB_DRIVER'):
		if u['ID_USB_DRIVER']=='uvcvideo':p['mode']='yuv'
	return p

def _get_main_pid(d):
	r='mjpg_streamer -i /usr/local/lib/input_uvc.so -d /dev/video%s'%(d)
	return _get_pid(r)

def _get_record_pid(d):
	_d=8000+int(d)
	r='ffmpeg -i "http://127.0.0.1:%s/?action=stream" "/box/storage/Camera/%s/"'%(_d,d)
	return _get_pid(r)

def _get_pid(d):
	c='sudo ps ax|grep "%s"'%d
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.split('\n')
	pid=False
	for l in _r:
		if 'grep' in l:
			print 'true'
			continue
		p=l.strip().split(' ')[0]
		pid=p
		break
	return pid

def _kill_pid(p):
	if p!='':
		os.system('sudo kill -9 %s'%p)
		#os.kill(int(p),9)

def _play(f,l):
	os.system('sudo killall omxplayer.bin')
	v=''
	if f.startswith('http') or f.startswith('rtmp'):v='--live'
	_l=''
	if l and l!='':_l='-l "%s"'%l
	c='sudo omxplayer %s -b %s "%s"'%(v,_l,f)
	subprocess.Popen(c,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE)