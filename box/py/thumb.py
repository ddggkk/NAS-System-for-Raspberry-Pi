#!/usr/bin/python
# -*- coding:utf-8 -*-
from PIL import Image
import os
import sys
import subprocess
try:import piexif
except:import pexif
from disk import _get_udev
reload(sys)  
sys.setdefaultencoding('utf8')

def read():
	r=[]
	p='/media'
	l=os.listdir(p)
	for d in l:
		_d='%s/%s'%(p,d)
		dev='/dev/disk/by-uuid/%s'%d
		if not os.path.ismount(_d) or os.path.samefile(_d,'/') or not os.path.exists(dev):continue
		udev=_get_udev(dev)
		if udev.has_key('SUBSYSTEM') and udev['SUBSYSTEM']=='usb':continue
		r.append(_read(_d))
	return r

def _read(p):
	r={'i':[],'v':[]};
	if not os.path.exists(p):return r;
	try:
		for root, dirs, files in os.walk(p,topdown=False):
			for f in files:
				fp=os.path.join(root,f);
				if f.startswith('.'):
					fpd=os.path.dirname(fp)
					if (f.endswith('.jpg') or f.endswith('.mp4')) and os.path.basename(fpd)=='.thumbnails':
						_f=os.path.join(os.path.dirname(fpd),f[1:len(f)-4])
						if not os.path.exists(_f):os.system('rm -rf "%s"'%fp)
				else:
					m,e=mime(fp)
					if m=='image':r['i'].append(fp)
					if m=='video':r['v'].append(fp)
	except:pass
	return r

def exif(f,_f):
	try:_t=pexif.load(f)
	except:return False
	t=_t.pop('thumbnail')
	if not t:return False
	F=open(_f,'wb+')
	try:
		F.write(t)
		prop(t)
	finally:
		F.close()
		return False
	return True

def mime(p):
	c='sudo file -bi "%s"'%p
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.split('; charset=')
	m=_r[0].split('/')
	return m[0],m[1]

def prop(f):
	os.system('sudo chmod 0777 "%s"'%f)

def create_thumb(f):
	p=os.path.dirname(f)
	_p='%s/.thumbnails'%p
	n=os.path.basename(f)
	_f='%s/.%s.jpg'%(_p,n)
	s=os.stat(f)
	m0=s.st_mtime
	if os.path.exists(_f):
		m1=os.stat(_f).st_mtime
		if m0<m1:return
	if not os.path.exists(_p):
		os.mkdir(_p)
		prop(_p)
	if exif(f,_f):return
	img=Image.open(f)
	img.thumbnail((128,128),Image.ANTIALIAS)
	img.save(_f,'JPEG')
	prop(_f)

def create_clip(f):
	p=os.path.dirname(f)
	_p='%s/.thumbnails'%p
	n=os.path.basename(f)
	_t='%s/.%s.jpg'%(_p,n)
	_f='%s/.%s.mp4'%(_p,n)
	s=os.stat(f)
	m0=s.st_mtime
	if os.path.exists(_f):
		m1=os.stat(_f).st_mtime
		if m0<m1:return
	if not os.path.exists(_p):
		os.mkdir(_p)
		prop(_p)
	os.system('sudo ffmpeg -y -ss 0 -t 5 -i "%s" -f mjpeg -vf "select=eq(pict_type\\,I),scale=-1:128" -vframes 1 "%s"'%(f,_t))
	prop(_t)
	os.system('sudo ffmpeg -y -i "%s" -f mp4 -vf "scale=-2:240" -c:v libx264 -b 128K -c:a aac -ab 64k -ar 44100 "%s"'%(f,_f))
	prop(_f)

def main():
	if len(sys.argv)>1:l=_read(sys.argv[1]);
	else: l=read();
	for d in l:
		for f in d['i']:
			try:create_thumb(f)
			except Exception,e:continue
		for f in d['v']:
			try:create_clip(f)
			except Exception,e:continue