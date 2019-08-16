#!/usr/bin/python
# -*- coding: utf-8 -*-
import time
import hashlib
import os
import pwd
import web
import subprocess

def login():
	if not _check_sn():return 409
	rq=web.input()
	s=rq['auth']
	from base64 import b64decode
	from base64 import b64encode
	from M2Crypto import RSA
	k=open('/box/etc/server.pem','r').read()
	c=RSA.load_key_string(k);
	s=b64decode(s)
	s=c.private_decrypt(s,RSA.pkcs1_padding)
	s=s.split(':')
	_t=time.time()
	t=float(s[0])
	n=s[1]
	u=s[2]
	p=s[3]
	if _t-t>60:return 408
	import hashlib
	ns='%s:%s'%(web.ctx.ip,t)
	m=hashlib.md5()
	m.update(ns)
	_n=m.hexdigest()
	if n!=_n:return 403
	r=_user_exsits(u)
	if not r or not r['box']:return 404
	if not _check_login(u,p):return 403
	c=RSA.load_pub_key('/box/etc/public.pem')
	_ip=web.ctx.ip.replace('::ffff:','')
	s='%s:%s'%(u,_ip)
	s=c.public_encrypt(s,RSA.pkcs1_padding)
	s=b64encode(s)
	web.setcookie('sid',s,24*60*60)
	r.pop('box')
	return r

def getdev():
	return {'key':_get_sn_seed()}

def register():
	from M2Crypto import RSA
	from base64 import b64decode
	rq=web.input()
	k=rq['key']
	s=b64decode(k)
	c=RSA.load_pub_key('/box/etc/nas.public.pem')
	s=c.public_decrypt(s,RSA.pkcs1_padding)
	if s==_get_sn_seed():
		from info import _write
		_write('/box/tmp/.key',k)
		return 200
	return 'Wrong key!'

def logout():
	u,a=_auth()
	if not u:return a
	return 200

def passwd():
	rq=web.input()
	u,a=_auth()
	if not u:return a
	if rq.has_key('name'):
		if not a:
			return 403
		else:
			u=rq['name']
			if not _user_exsits(u):return useradd()
	if rq.has_key('admin'):
		if not a:return 403
		d=rq['admin']
		if d=='true':
			G='box,sudo'
			os.system('sudo usermod -G %s %s'%(u,G))
		else:
			if _is_admin(u) and _check_admin()<=1:return 403
			os.system('sudo usermod -G box %s'%u)
	p=rq['pass']
	if p!='':_passwd(u,p)
	return 200

def useradd():
	if _check_admin()>0:
		u,a=_auth()
		if not u:return a
		if not a:return 403
	rq=web.input()
	u=rq['name']
	p=rq['pass']
	d=rq['admin']
	if _user_exsits(u):return 403
	g='box'
	b='/usr/sbin/nologin'
	if d=='true':
		g='box,sudo'
		b='/bin/bash'
	os.system('sudo useradd %s -N -G %s -s %s'%(u,g,b))
	os.system('sudo smbpasswd -a %s'%u)
	if p!='':_passwd(u,p)
	os.system('sudo /box/bin/storage')
	return 200

def userdel():
	u,a=_auth()
	if not u:return a
	if not a:return 403
	rq=web.input()
	u=rq['name']
	if not _user_exsits(u):return 404
	if _is_admin(u) and _check_admin()<=1:return 403
	os.system('sudo smbpasswd -x %s'%u)
	os.system('sudo userdel %s'%u)
	return 200

def users():
	us = []
	for u in pwd.getpwall():
		_u=u.pw_name
		if not _is_boxuser(_u):continue
		r={
			'name':_u
			,'admin':_is_admin(_u)
		}
		us.append(r)
	return us

def reboot():
	u,a=_auth()
	if not u:return a
	if not a:return 403
	os.system('sudo reboot')
	return 200

def poweroff():
	u,a=_auth()
	if not u:return a
	if not a:return 403
	os.system('sudo poweroff -h')
	#os.system('shutdown -h +1')
	return 200

def _auth():
	s=web.cookies().get('sid')
	if not s: return (False,408)
	from base64 import b64decode
	from M2Crypto import RSA
	k=open('/box/etc/server.pem','r').read()
	c=RSA.load_key_string(k);
	s=b64decode(s)
	s=c.private_decrypt(s,RSA.pkcs1_padding)
	s=s.replace('\x00','',9999)
	s=s.split(':')
	u=s[0]
	ip=s[1]
	_ip=web.ctx.ip.replace('::ffff:','')
	if ip!=_ip:return (False,403)
	r=_user_exsits(u)
	if r and r['box']:return (u,r['admin'])
	return (False,404)

def _check_login(u,p):
	c='sudo cat /etc/shadow'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	r=r.split('\n')
	for line in r:
			l=line.strip('\n').split(':')
			if l[0]!=u:continue
			import crypt
			c=l[1]
			s=c.split('$')
			s='$%s$%s'%(s[1],s[2])
			c1=crypt.crypt(p,s)
			if c1==c:return True
			else: return False
	return False

def _get_group(n):
	c='sudo groups %s'%n
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.split('\n')
	for l in _r:
		if not '%s : '%n in l:continue
		g=l.split(':')[1].strip().split(' ')
	return g

def _user_exsits(n):
	for u in pwd.getpwall():
		if u.pw_name==n: return {
			'name':n
			,'admin':_is_admin(n)
			,'box':_is_boxuser(n)
		}
	return False

def _is_boxuser(n):
	if 'box' in _get_group(n):return True
	return False

def _is_admin(n):
	g=_get_group(n)
	if 'wheel' in g or 'sudo' in g:return True
	return False

def _check_admin():
	a=0
	for u in users():
		if u['admin']==True:a+=1
	return a

def _passwd(u,p):
	os.system('sudo echo "sudopsw" | sudo -S echo "%s:%s" | sudo chpasswd'%(u,p))
	_smbpasswd(u,p)
	
def _smbpasswd(u,p):
	import cStringIO
	import hashlib
	import pwd
	file='/etc/samba/smbpasswd'
	os.system('sudo touch %s'%file)
	os.system('sudo chmod 0666 %s'%file)
	date=int(time.time())
	changed=False
	md4=hashlib.new('md4')
	md4.update(p.encode('utf-16le'))
	nthash=md4.hexdigest().upper()
	_p=pwd.getpwnam(u)
	pw_name=_p.pw_name
	pw_uid=_p.pw_uid
	lhash='X' * 32
	flags='[U          ]'
	lct='LCT-%s'%hex(date)[2:].upper()
	line='%s:%s:%s:%s:%s:%s' % (pw_name,pw_uid,lhash,nthash,flags,lct)
	content = cStringIO.StringIO()
	found=False
	changed=False
	with open(file,'r') as f:
		try:
			for l in f.readlines():
				if l.startswith('#'):
					content.write(l)
					continue
				try:(user,uid,olhash,onthash,oflags,olct)=line.split(':')
				except:continue
				if user==pw_name and onthash.upper()!=nthash:
					found=True
					changed=True
					content.write(line)
					content.write(os.linesep)
			if not found:
				changed=True
				content.write(line)
		except Exception,e:
			return 'System Error: %s'%e
		finally:
			f.close()
	data=content.getvalue()
	content.close()
	if not changed:return 200
	with open(file,'w+') as f:
		try:
			f.write(data)
		except Exception,e:
			return 'System Error: %s'%e
		finally:
			f.close()
			return 200

def _check_sn():
	return True
	f='/box/tmp/.key'
	if not os.path.exists(f):
		os.system('sudo umount -l /boot')
		if not os.path.exists('/boot/.box'):os.system('sudo date +%s > /boot/.box')
		t=open('/boot/.box').read().replace('\n','')
		t0=int(t)
		t1=time.time()
		os.system('sudo mount /boot')
		if t1-t0<86400:return 'trial'
		return False
	c='sudo cat %s'%f
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	from M2Crypto import RSA
	from base64 import b64decode
	c=RSA.load_pub_key('/box/etc/nas.public.pem')
	m=b64decode(r)
	m=c.public_decrypt(m,RSA.pkcs1_padding)
	if m==_get_sn_seed():return True
	return False

def _get_sn_seed():
	from info import _get_network_mac
	m0=_get_network_mac('eth0').split(':')
	m1=_get_network_mac('wlan0').split(':')
	if len(m1)!=6:m1=m0
	m=''.join([
		str(hex(int(m0[0],16)+int(m1[0],16)))[2:]
		,str(hex(int(m0[1],16)+int(m1[1],16)))[2:]
		,str(hex(int(m0[2],16)+int(m1[2],16)))[2:]
		,str(hex(int(m0[3],16)+int(m1[3],16)))[2:]
		,str(hex(int(m0[4],16)+int(m1[4],16)))[2:]
		,str(hex(int(m0[5],16)+int(m1[5],16)))[2:]
	])
	s=hashlib.md5()
	s.update(m)
	h=s.hexdigest()
	return h