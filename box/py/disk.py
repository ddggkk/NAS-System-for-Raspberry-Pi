#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import web
import json
import subprocess
import auth

def get():
	u,a=auth._auth()
	if not a:return 403
	ds={'disks':_get_disks(),'raids':_get_raids()}
	return ds

def erase():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	return _erase(p)

def mkpart():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	t=rq['type']
	s=rq['start']
	e=rq['end']
	return _mkpart(p,t,s,e)

def rmpart():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	n=rq['number']
	return _rmpart(p,n)

def mkfs():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	return _mkfs(p)

def mount():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	return _mount(p)

def umount():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	return _umount(p)

def eject():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	return _eject(p)

def craid():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p1=rq['path1']
	p2=rq['path2']
	return _craid(p1,p2)

def draid():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	return _draid(p)

def rmraid():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	d=rq['dev']
	return _rmraid(p,d)

def addraid():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	p=rq['path']
	d=rq['dev']
	return _addraid(p,d)

def _erase(p):
	_umount(p)
	os.system('sudo dmsetup remove_all')
	c='sudo parted %s mklabel gpt -s'%p
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return {'result':r}

def _mkpart(p,t,s,e):
	c='sudo parted -a cylinder %s mkpart %s %ss %ss -s'%(p,t,s,e)
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return {'result':r}

def _rmpart(p,n):
	u=_get_udev(p)['DEVTYPE']
	if u=='disk':return _erase(p)
	_umount(p)
	os.system('sudo dmsetup remove_all')
	c='sudo parted %s rm %s -s'%(p,n)
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return {'result':r}

def _mkfs(p):
	_umount(p)
	os.system('sudo dmsetup remove_all')
	c='sudo mkfs.ext4 -F %s'%p
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	if 'Filesystem UUID: ' in r:
		_mount(p)
		return {'result':r}
	return {status:0,'message':r} 

def _mount(p):
	u=_get_udev(p)['ID_FS_UUID']
	os.system('sudo /box/bin/mount block add %s'%u)
	return 200

def _umount(p):
	u=_get_udev(p)
	if u.has_key('ID_FS_UUID'):u=u['ID_FS_UUID']
	else:return 200
	os.system('sudo /bin/umount -Alf %s'%p)
	#os.system('sudo /box/bin/mount block remove %s'%u)
	return 200

def _eject(p):
	c='sudo eject %s'%p
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return {'result':r}

def _craid(p1,p2):
	i=0
	while os.path.exists('/dev/md%s'%i):i+=1
	c='sudo echo y | sudo mdadm -C /dev/md%s -a yes -l1 -n2 %s %s'%(i,p1,p2)
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return {'result':r}

def _draid(p):
	_umount(p)
	ds=_get_raid(p)['devices']
	c=['sudo mdadm -S %s'%p]
	for d in ds:
		if d.has_key('path'):c.append('sudo mdadm --zero-superblock %s'%d['path'])
	for l in c:os.system(l)
	return 200

def _rmraid(p,d):
	_umount(p)
	os.system('sudo mdadm %s -f %s -r %s'%(p,d,d))
	c='sudo mdadm --zero-superblock %s'%d
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return {'result':r}

def _addraid(p,d):
	c='sudo mdadm %s --add %s'%(p,d)
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return {'result':r}

def _get_disks():
	c='sudo parted -ls |grep "^Disk /dev"'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	ls=r.split('\n')
	ds={}
	for l in ls:
		if not l.startswith('Disk /dev/'):continue
		d=l.replace('Disk ','').split(':')[0]
		ds[d]={'name':d,'udev':_get_udev(d)}
		c='sudo parted %s -ms u s p free'%d
		r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE)
		_ls=r.stdout.readlines()
		f=0
		for i in _ls:
			print i
			_l=i.strip(';\n').split(':')
			if 'Read-only file system' in i:
				ds[d]['readonly']=True
			if i.startswith(d):
				ds[d]['size']=_l[1].replace('s','')
				ds[d]['bus']=_l[2]
				ds[d]['sectorsize']={'logical':_l[3],'physical':_l[4]}
				ds[d]['parttiontype']=_l[5]
				ds[d]['model']=_l[6]
				ds[d]['flags']=_l[7]
				ds[d]['children']={}
				if ds[d]['parttiontype'] in ['loop','unknown']:
					_ds=ds[d]['children'][d]={
						'name':d
						,'start':0
						,'end':ds[d]['size']
						,'size':ds[d]['size']
						,'udev':_get_udev(d)
					}
				f=1
				continue
			if f>0:
				if ds[d]['parttiontype'] in ['loop','unknown']:
					_ds=ds[d]['children'][d]={
						'name':d
						,'number':_l[0]
						,'start':_l[1].replace('s','')
						,'end':_l[2].replace('s','')
						,'size':_l[3].replace('s','')
						,'fstype':_l[4]
						,'type':_l[5]
						,'flags':_l[6]
						,'udev':_get_udev(d)
					}
					continue
				if d.startswith('/dev/md') or d.startswith('/dev/mmcblk'):p='%sp'%d
				else:p=d
				print _l
				if _l[4]=='free':
					_p='%s/%s'%(p,_l[1].replace('s',''))
					ds[d]['children'][_p]={
						'name':_p
						,'start':_l[1].replace('s','')
						,'end':_l[2].replace('s','')
						,'size':_l[3].replace('s','')
						,'fstype':_l[4]
						,'type':''
					}
				else:
					_p='%s%s'%(p,_l[0])
					if _l[4]!='' and _l[5]=='':_l[5]='primary'
					ds[d]['children'][_p]={
						'name':_p
						,'number':_l[0]
						,'start':_l[1].replace('s','')
						,'end':_l[2].replace('s','')
						,'size':_l[3].replace('s','')
						,'fstype':_l[4]
						,'type':_l[5]
						,'flags':_l[6]
						,'udev':_get_udev(_p)
					}
	c='sudo lsblk -Jfpb'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	b=json.loads(unicode(r,errors='ignore'))['blockdevices']
	for i in b:
		d=i['name']
		ds[d]['fstype']=i['fstype']
		if i['fstype']=='linux_raid_member':
			ds[d]['readonly']=True
		if ds[d]['children'].has_key(d):
			_ds=ds[d]['children'][d]
			_ds['fstype']=i['fstype']
			_ds['label']=i['label']
			_ds['uuid']=i['uuid']
			_ds['mountpoint']=i['mountpoint']
			if i['mountpoint']:
				used,avail,percent=_get_usage(i['mountpoint'])
				try:
					if os.path.samefile(i['mountpoint'],'/'):
						_ds['os']=True
						_ds['readonly']=True
						ds[d]['readonly']=True
					if os.path.samefile(i['mountpoint'],'/boot'):
						_ds['readonly']=True
						ds[d]['readonly']=True
				except:pass
				_ds['used']=used
				_ds['avail']=avail
				_ds['percent']=percent
		if i.has_key('children'):
			for j in i['children']:
				n=j['name']
				if i['fstype']=='linux_raid_member':
					if ds.has_key(n):
						if ds[n]['children'].has_key(n):
							_ds=ds[n]['children'][n]
							_dsp=ds[n]
						else:_ds={}
					else:
						_n=n[:n.index('p')]
						_ds=ds[_n]['children'][n]
						_dsp=ds[_n]
				else:
					if ds[d]['children'].has_key(n):
						_ds=ds[d]['children'][n]
					else:
						ds[d]['children'][n]=j
						_ds=j
					_dsp=ds[d]
				_ds['label']=j['label']
				_ds['uuid']=j['uuid']
				_ds['mountpoint']=j['mountpoint']
				if j['mountpoint']:
					used,avail,percent=_get_usage(j['mountpoint'])
					try:
						if os.path.samefile(j['mountpoint'],'/'):
							_ds['os']=True
							_ds['readonly']=True
							_dsp['readonly']=True
						if os.path.samefile(j['mountpoint'],'/boot'):
							_ds['readonly']=True
							_dsp['readonly']=True
					except:pass
					_ds['used']=used
					_ds['avail']=avail
					_ds['percent']=percent
	return ds

def _get_usage(d):
	d=os.path.realpath(d)
	vfs = os.statvfs(d)
	avail=vfs.f_bfree*vfs.f_bsize
	used=(vfs.f_blocks-vfs.f_bfree)*vfs.f_bsize
	percent=100*(vfs.f_blocks-vfs.f_bfree)/vfs.f_blocks
	return used,avail,percent

def _get_mountpoints():
	c='sudo cat /proc/mounts |grep ^/dev';
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.split('\n')
	m={}
	for i in _r:
		device,mountpoint,fs,option,cflag,dflag=i.split(' ')
		if not hasattr(m,device):m[device]=[]
		m[device].append(mountpoint)
	return m

def _get_raids():
	c='sudo mdadm -Ds';
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.split('\n')
	m={}
	for i in _r:
		if i=='':continue
		d=i.split(' ')
		d=os.path.realpath(d[1])
		m[d]=_get_raid(d)
		m[d]['udev']=_get_udev(d)
	return m

def _get_raid(d):
	c='sudo mdadm -D %s'%d;
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.split('\n')
	result={'devices':[]}
	for i in _r:
		i=i.strip()
		if i=='%s:'%d or i=='' or i.startswith('Number'):continue
		if ' : ' in i:
			k,v=i.split(' : ')
			result[k]=v
		else:
			l=' '.join(filter(lambda x: x, i.split(' '))).split(' ')
			if len(l)==7:result['devices'].append({'path':l[6],'state':l[4],'sync':l[5]})
			if len(l)==5:result['devices'].append({'state':l[4]})
	return result

def _q_raid(d):
	result=None
	c='sudo mdadm -Q %s'%d;
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.split('\n')
	for i in _r:
		i=i.replace('.  Use mdadm --examine for more detail.','')
		if '%s: device'%d in i:result=os.path.realpath(i[i.rfind(' ')+1:])
	return result

def _get_udev(d):
	udev={}
	s=['BUSNUM','DEVNUM','DEVNAME','DEVTYPE','ID_BUS','ID_CDROM','ID_MTP_DEVICE','ID_VENDOR','ID_MODEL','ID_PART_TABLE_TYPE','ID_SERIAL_SHORT','ID_FS_LABEL','ID_FS_UUID','ID_FS_TYPE','SUBSYSTEM','ID_USB_DRIVER']
	c='sudo udevadm info %s'%d
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	for _s in s:
		i=r.find(_s+'=')
		if i>0:
		 i=i+len(_s)+1
		 j=r.find('\n',i)
		 udev[_s]=r[i:j]
	return udev