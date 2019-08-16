#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import pwd
import grp
import stat
import subprocess
import web
import json
import auth
from disk import _get_udev,_get_usage
from info import _get_storage
NOPATH=u'System Error: %s does not exists!'
IMAGES=('bmp','gif','jpeg','jpg','pic','pict','png','tga','tif','tiff')
def ls():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	path=rq['path']
	h=False
	if rq.has_key('showhidden'):
		h=rq['showhidden']
		if h=='false':h=False
		else:h=True
	if path.startswith('trash:///'):return _lstrash(u,h)
	if path.startswith('root:///'):return _lsroot(u)
	if path.startswith('file:///C:/') and not a:return 403
	p=_get_path(path,u)
	if not os.path.exists(p) or os.path.isfile(p):return 404
	rw,_r=_get_rw(u,a,p)
	if not rw and path!='file:///':return 403
	if path in ['home:///','desktop:///','public:///','file:///','share:///']:_r[8]=path
	R={'prop':_r}
	r=[]
	l=os.listdir(p)
	l.sort()#key=unicode.lower
	for f in l:
		if f.startswith('.'):
			if not h:continue
		fp='%s/%s' % (p,f)
		if not os.path.exists(fp):continue
		_r=_fileinfo(fp)
		if path=='file:///' and not _r[7]:continue;
		if _r:r.append(_r)
	R['children']=r
	return R

def mkdir():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	pt=rq['path']
	p=_get_path(pt,u)
	if not p:return 400
	os.mkdir(p)
	_set_rw(u,p)
	return 200

def rm():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	p=rq['path']
	p=json.loads(p)
	r=[]
	for i in p:
		if i in ['file:///','trash:///']:continue
		_p=_get_path(i,u)
		if not _p:r.append(NOPATH%i)
		e=_rm(_p)
		if e is not True:r.append(_get_uipath(e,u))
	if len(r)==0:return 200
	return '\n'.join(r)


def mv():
	return _mc(copy=False)

def cp():
	return _mc(copy=True)

def zip():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	f=rq['file']
	f=json.loads(f)
	_f=[]
	for i in f:_f.append(_get_path(i,u))
	return _zip(_f)

def unzip():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	p=rq['path']
	p=_get_path(p,u)
	return _unzip(p)

def find():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	p=rq['path']
	f=rq['file']
	if f.strip()=='' or p=='trash:///' or p=='root:///':return ls()
	p=_get_path(p,u)
	return _find(p,f)

def ln():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	n=rq['newpath']
	_n=_get_path(n,u);
	if not _n:return NOPATH%n
	if n.startswith('trash:///') or n.startswith('share:///'):return 400
	r=[]
	pt=rq['path']
	p=json.loads(pt)
	for f in p:
		_p=_get_path(f,u);
		if not _p:
			r.append(NOPATH%f)
			continue
		t='%s/%s'%(_n,os.path.basename(_p))
		_t=_rename(t)
		os.symlink(_p,_t)
	if len(r)==0:return 200
	return '\n'.join(r)

def read():
	u,a=auth._auth()
	if not u:return ''
	p=web.ctx.path
	if p.startswith('/ftp:/') or p.startswith('/smb:/'):
		p=p.replace(':/','://',1)
	else:
		p=p.replace(':/',':///',1)
	_p=_get_path(p,u)
	if not _p or not os.path.exists(_p):return ''
	rw,_r=_get_rw(u,a,_p)
	if not rw:return ''
	_p=os.path.realpath(_p)
	m,c=_get_mime(_p)
	web.header('Content-type',m)
	web.header('Content-Disposition','attachment; filename="%s"'%os.path.basename(_p))
	#web.header('X-Accel-Charset','utf-8') 
	web.header('X-Accel-Redirect',_p)
	return web

def write():
	u,a=auth._auth()
	if not u:return a
	p=web.ctx.path
	if p.startswith('/ftp:/') or p.startswith('/smb:/'):
		p=p.replace(':/','://',1)
	else:
		p=p.replace(':/',':///',1)
	p=p.replace('/','',1)
	_p=_get_path(p,u)
	if os.path.isdir(_p):return 403
	_d=os.path.dirname(_p)
	if not os.path.exists(_d):
		os.system('sudo mkdir -p "%s"'%_d)
		_set_rw(u,_d)
	else:
		if not os.path.isdir(_d):
			_d=_rename(_d)
			_p='%s/%s'%(_d,os.path.basename(_p))
			os.system('sudo mkdir -p "%s"'%_d)
			_set_rw(u,_d)
	i=0;
	e=web.ctx.env
	if e.has_key('HTTP_POSITION'):i=int(e['HTTP_POSITION'])
	m='rb+'
	if i==0:
		m='wb+'
		if e.has_key('HTTP_REPLACE'):
			r=e['HTTP_REPLACE']
			if r and r.lower()=='true':_p=_rename(_p)
	d=web.data()
	f=open(_p,m)
	try:
		if i==0:
			_set_rw(u,_p)
			f.truncate()
		if i>0:f.seek(i)
		f.write(d)
	finally:f.close()
	return {'name':os.path.basename(_p),'message':200}

def cleartrash():
	u,a=auth._auth()
	if not u:return a
	p='/media'
	l=os.listdir(p)
	for f in l:
		_p='%s/%s' % (p,f)
		if not os.path.ismount(_p):continue
		__p,__i=_mktrashdir(_p,u)
		os.system('sudo rm -rf "%s"'%__p)
		os.system('sudo rm -rf "%s"'%__i)
		_mktrashdir(_p,u)
	return 200

def chmod():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	p=rq['path']
	m=rq['mode']
	_p=_get_path(p,u)
	if not _p:return 404
	c='sudo chmod %s "%s"'%(m,_p)
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return {'message':r}

def setbackground():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	p=rq['path']
	_p=_get_path(p,u)
	if not os.path.isfile(_p):return 400
	f='/home/%s/Desktop/.background'%u
	os.system('sudo rm -rf %s'%f)
	c='sudo ln -s "%s" "%s"'%(_p,f)
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	if r!='':
		os.system('sudo cp "%s" "%s"'%(_p,f))
		os.system('sudo chmod 0777 "%s"'%f)
	return 200

def share():
	_path=web.ctx.path
	_path=_path.replace('/','',1)
	if '/' in _path:
		i=_path.index('/')
		path=_path[:i]
		sp=_path[i:]
		if sp.startswith('/.'):sp='.'
	else:
		path=_path
		sp=''
	f='/home/%s/.share.list'
	_p=''
	from auth import users
	us=users()
	for _u in us:
		u=_u['name']
		_f=f%u
		if not os.path.exists(_f):continue
		c='sudo cat %s'%_f
		r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
		_r=r.split('\n')
		for l in _r:
			l=l.strip()
			if l=='':continue
			i=l.index('=')
			t=l[:i]
			p=l[i+1:]
			if t==path:
				_p=_get_path(p,u)
				if not _p or not os.path.exists(_p):return ''
				break
	if _p=='':return ''
	if os.path.isdir(os.path.realpath(_p)):
		_sp='%s/%s'%(_p,sp)
		if os.path.isdir(os.path.realpath(_sp)):
			ls=os.listdir(_sp)
			r=[]
			for l in ls:
				if l.startswith('.'):continue
				e=''
				_l='%s/%s'%(_sp,l)
				if os.path.isdir(os.path.realpath(_l)):e='/'
				r.append({'name':'%s%s'%(l,e),'size':os.stat(_l).st_size})
			r=json.dumps(r)
		else:
			web.header('Content-type','application/octet-stream')
			r=_read(_sp)
	else:
		r=json.dumps([{'name':'.'+os.path.basename(_p),'size':os.stat(_p).st_size}])
	if sp=='':
		f=open('/box/www/os/share.html')
		h=f.read()
		f.close()
		h+='<script>parse(%s)</script>'%r
		r=h
		web.header('Content-type','text/html; charset=utf-8')
	if sp.startswith('.'):
		web.header('Content-type','application/octet-stream')
		r=_read(_p)
	return r

def transencode():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	s=rq['source']
	t=rq['target']
	sc=rq['sourceencode']
	tc=rq['targetencode']
	_s=_get_path(s,u)
	if not _s or not os.path.exists(_s):return 404
	_t=_get_path(t,u)
	os.system('iconv -f %s -t %s "%s" -o "%s"'%(sc,tc,_s,_t))
	return 200

def _fileinfo(fp):
	ismount=os.path.ismount(os.path.realpath(fp))
	isroot=os.path.samefile(fp,'/')
	if isroot:ismount=True
	name=os.path.basename(fp)
	mode,ino,dev,nlink,uid,gid,size,atime,mtime,ctime=os.stat(fp)
	try:owner=pwd.getpwuid(uid).pw_name
	except:owner=uid
	try:group=grp.getgrgid(gid).gr_name
	except:group=gid
	mtime=mtime*1000
	mode=oct(mode)[-3:]
	ext=os.path.splitext(name)[1].lower() 
	isfile=os.path.isfile(fp)
	isdir=os.path.isdir(fp)
	islink=os.path.islink(fp)
	rpath=name
	if isdir:
		rpath=name+'/'
		try:size=len(os.listdir(fp))
		except:size=0
	_u,_a,_p=_get_usage(fp)
	isstorage=os.path.samefile(fp,os.path.dirname(os.path.realpath('/box/storage')))
	usage={'size':_u+_a,'avail':_a,'used':_u,'storage':isstorage,'root':isroot}
	udev={}
	if os.path.dirname(fp) in ['/media','/box/drives'] and ismount:
		dev='/dev/disk/by-uuid/%s'%os.path.basename(os.path.realpath(fp))
		if os.path.exists(dev):udev=_get_udev(dev)
		islink=False
	writable=True
	if fp=='/media' or fp=='/box/drives':
		writable=False
		name='computer'
	thumbnail=False
	mime='folder'
	charset=''
	mime,charset=_get_mime(fp)
	_t='%s/.thumbnails/.%s.jpg'%(os.path.dirname(fp),os.path.basename(fp))
	if isfile and os.path.exists(_t) and os.path.getsize(_t)>0:thumbnail=True
	return [name,ext,size,mtime,isfile,isdir,islink,ismount,rpath,owner,group,mode,ino,usage,udev,writable,thumbnail,mime,charset]

def _lstrash(u,h):
	p='/media'
	l=os.listdir(p)
	r=[]
	for f in l:
		if f.startswith('.'):continue
		_p='%s/%s' % (p,f)
		if not os.path.ismount(_p) and not os.path.samefile(_p,'/'):continue
		_p,_i=_mktrashdir(_p,u)
		if not os.path.exists(_p):continue
		_l=os.listdir(_p)
		for _f in _l:
			if _f=='.thumbnails':continue
			if not h and _f.startswith('.'):continue
			fp='%s/%s'%(_p,_f)
			if not os.path.exists(fp):
				os.system('sudo rm -rf "%s"'%fp)
				continue
			i=_fileinfo(fp)
			i[0]='%s/%s'%(f,i[0])
			i[8]='%s/%s'%(f,i[8])
			r.append(i)
	return {'children':r,'prop':['trash','',len(r),0,False,True,False,False,'trash:///','root','root','0777',False,False,False,False,False,'inode/directory','binary']}

def _lsroot(u):
	l={'desktop':['desktop:///','/home/%s/Desktop'%u],'home':['home:///','/home/%s'%u],'public':['public:///','/home/Public'],'computer':['file:///','/box/drives']}
	r=[]
	for f in l:
		_f=l[f]
		i=_fileinfo(_f[1])
		i[0]=f
		i[8]=_f[0]
		if f=='network' or f=='computer' :i[15]=False
		r.append(i)
	r.append(_lstrash(u,True)['prop'])
	return {'children':r,'prop':['root','',5,0,False,True,False,False,'root:///','root','root','0777',False,False,False,False,False,'inode/directory','binary']}

def _gettrashdir(p,u):
	id=pwd.getpwnam(u).pw_uid
	p=os.path.normpath(p)
	if p.startswith('/home/'):
		d=os.path.dirname(os.path.realpath('/box/storage'))
		f='%s/.Trash/%s/files'%(d,id)
		i='%s/.Trash/%s/info'%(d,id)
	if p.startswith('/box/drives/'):
		_p=p.split('/')
		p=os.path.realpath('/box/drives/%s'%_p[3])
	if p.startswith('/media/'):
		_p=p.split('/')
		d=_p[2]
		f='/media/%s/.Trash/%s/files'%(d,id)
		i='/media/%s/.Trash/%s/info'%(d,id)
	return f,i

def _mktrashdir(p,u):
	id=pwd.getpwnam(u).pw_uid
	f='%s/.Trash/%s/files'%(p,id)
	i='%s/.Trash/%s/info'%(p,id)
	try:
		os.makedirs(f)
		os.makedirs(i)
	except:
		pass
	return f,i

def _rm(p):
	if not os.path.exists(p) and not os.path.islink(p):return NOPATH%p
	if p in ['/','/media','/home','/box','/box/drives','/box/storage']:return 403
	if os.path.isfile(p) or os.path.islink(p):
		e,t,m=_get_thumb(p)
		if e:
			os.remove(t)
			os.remove(m)
		os.remove(p)
	else:
		os.system('sudo rm -rf "%s"'%p)
	return True

def _trash():
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	p=rq['path']
	p=json.loads(p)
	r=[]
	for i in p:
		_p=_get_path(i,u)
		if not _p:r.append(NOPATH%i)
		f,_i=_gettrashdir(_p,u)
		_n='%s/%s'%(f,os.path.basename(_p))
		e,s=_mv(_p,_n)
		if e is not True:r.append(_get_uipath(e,u))
		#else:write trash info file
	return 200

def _mc(copy=False):
	u,a=auth._auth()
	if not u:return a
	rq=web.input()
	n=rq['newpath']
	if n=='trash:///':return _trash()
	r=[]
	pt=rq['path']
	p=json.loads(pt)
	if '/' in n:
		_n=_get_path(n,u)
		if not _n:return NOPATH%n
		rn=False
	else:
		_n=n
		rn=True
	for i in p:
		if i in ['file:///','trash:///']:continue
		_p=_get_path(i,u)
		if not _p:
			r.append(NOPATH%i)
			continue
		if rn:
			_d=os.path.dirname(_p)
			_t='%s/%s'%(_d,_n)
			e,f=_mv(_p,_t)
			if not e:r.append(f)
		else:
			_d=os.path.basename(_p)
			_t='%s/%s'%(_n,_d)
			if copy:e,f=_cp(_p,_t)
			else:e,f=_mv(_p,_t)
			if not e:r.append(f)
	if len(r)==0:return 200
	r='\n'.join(r)
	return r

def _mv(p,n):
	if os.path.ismount(os.path.realpath(p)) or os.path.samefile('/',p):return _label(p,n)
	if p==n or (os.path.exists(n) and os.path.samefile(p,n)):return (True,n)
	if p in ['/','/media','/home','/box','/box/bin','/box/drives','/box/etc','/box/py','/box/storage','/box/tmp','/box/www']:return (False,p)
	_n=_rename(n)
	if os.path.isfile(p)==True:
		pe,pt,pm=_get_thumb(p)
		ne,nt,nm=_get_thumb(_n)
		if pe:
			try:
				os.system('sudo mkdir -p "%s"'%os.path.dirname(nt))
				os.system('sudo mv "%s" "%s"'%(pt,nt))
				os.system('sudo mv "%s" "%s"'%(pm,nm))
			except:pass
	os.system('sudo mv "%s" "%s"'%(p,_n))
	return (True,_n)

def _label(p,n):
	n=os.path.basename(n)
	p=os.path.realpath(p)
	p='/dev/disk/by-uuid/%s'%os.path.basename(p)
	os.system('sudo dosfslabel %s "%s"'%(p,n))
	os.system('sudo ntfslabel %s "%s"'%(p,n))
	os.system('sudo e2label %s "%s"'%(p,n))
	os.system('sudo xfs_admin -L "%s" %s'%(n,p))
	return (True,n)

def _cp(p,n):
	if p in ['/']:return (False,p)
	_n=_rename(n)
	if os.path.isfile(p):
		c='sudo cp -r "%s" "%s"'%(p,_n)
		r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
		pe,pt,pm=_get_thumb(p)
		ne,nt,nm=_get_thumb(_n)
		if pe:
			try:
				os.system('sudo mkdir -p "%s"'%os.path.dirname(nt))
				os.system('sudo cp -r "%s" "%s"'%(pt,nt))
				os.system('sudo cp -r "%s" "%s"'%(pm,nm))
			except:pass
	else:
		c='sudo cp -r "%s" "%s"'%(p,_n)
		r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return (True,_n)

def _rename(p):
	if not os.path.exists(p):return p
	_p=p
	i=1
	while os.path.exists(_p):
		d,e=os.path.splitext(p)
		_p='%s_%d%s'%(d,i,e)
		i+=1
	return _p

def _find(p,f):
	if not '*' in f and not '?' in f:f='*%s*'%f
	c='sudo find "%s/" -name "%s"'%(p,f)
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	r=r.split('\n')
	c=[]
	for i in r:
		if i.startswith(p) and i!=p and not '.thumbnails' in i and not '.Trash' in i:
			_f=_fileinfo(i)
			_f[8]=i.replace(p,'')
			if os.path.isdir(i):_f[8]=_f[8]+'/'
			c.append(_f)
	return {'children':c}

def _zip(f):
	f0=os.path.abspath(f[0])
	p=os.path.dirname(f0)
	if len(f)>1:z='%s/%s'%(p,os.path.basename(p))
	else:z=f0
	z=_rename('%s.zip'%z)
	ps=[]
	for _f in f:
		_f=os.path.abspath(_f)
		if not os.path.exists(_f):continue
		if os.path.isdir(_f):
			try:
				for root, dirs, files in os.walk(_f):
					for _file in files:
						fp=os.path.join(root,_file)
						if fp not in ps:ps.append(fp)
			except:pass
		else:ps.append(_f)
	if len(ps)==0:return 200
	import zipfile
	ZIP=zipfile.ZipFile(z,'w')
	for _p in ps:
		if not os.path.exists(_p):continue
		n=_p.replace(p+'/','',1)
		if isinstance(_p,str):n=n.decode('utf8','ignore')
		n=n.encode('utf8','xmlcharrefreplace')
		ZIP.write(_p,n)
	ZIP.close()
	return 200

def _unzip(p):
	import zipfile
	ZIP=zipfile.ZipFile(p,'r')
	e=_rename(p[:p.rindex('.zip')])
	try:ZIP.extractall(path=e,pwd=None)
	except RuntimeError as e:return e[0]
	return 200

def _get_thumb(p):
	d=os.path.dirname(p)
	f=os.path.basename(p)
	t='%s/.thumbnails/.%s.jpg'%(d,f)
	m='%s/.thumbnails/.%s.mp4'%(d,f)
	if os.path.exists(t):return (True,t,m)
	return (False,t,m)

def _set_rw(u,p):
	os.system('sudo chown %s:box "%s"'%(u,p))
	os.system('sudo chmod 0777 "%s"'%p)

def _get_rw(u,a,p):
	r=_fileinfo(p)
	if a or os.path.samefile(p,'/') or os.path.samefile(p,'/media') or os.path.samefile(os.path.dirname(p),'/media'):return (True,r)
	if r[9]==u:return (True,r)
	m=r[11]
	if r[10]=='box':
		if r[9]!=u:return (False,r)
		if m[1:2] in ('4','5','6','7'):return (True,r)
	if m[2:] in ('4','5','6','7'):return (True,r)
	return (False,r)

def _get_mime(p):
	c='sudo file -bi "%s"'%p
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.replace('\n','').split('; charset=')
	m=_r[0]
	c=_r[1]
	return m,c

def _get_path(p,u):
	if p.startswith('/'):
		p=p.replace('/','',1)
	if p.startswith('file:///'):
		_p=os.path.normpath(p.replace('file:///','/box/drives/'))
	if p.startswith('home:///'):
		_p=os.path.normpath(p.replace('home:///','/home/%s/'%u))
	if p.startswith('desktop:///'):
		os.system('sudo mkdir /home/%s/Desktop'%u)
		_p=os.path.normpath(p.replace('desktop:///','/home/%s/Desktop/'%u))
	if p.startswith('public:///'):
		os.system('sudo mkdir /home/Public')
		_p=os.path.normpath(p.replace('public:///','/home/Public/'))
	if p.startswith('network:///'):
		os.system('sudo mkdir /home/%s/.network'%u)
		_p=os.path.normpath(p.replace('network:///','/home/%s/.network/'%u))
	if p.startswith('trash:///'):
		_p=p.replace('trash:///','').split('/')
		_d='/media/%s'%_p[0]
		_f='/'.join(_p[1:])
		f,i=_gettrashdir(_d,u)
		_p='%s/%s'%(f,_f)
	if p.startswith('ftp://'):
		pt=p.replace('ftp://','')
		if not '/' in pt:pt='%s/'%pt
		i=pt.index('/')
		d=pt[:i]
		_pt=pt[i:]
		_d=d
		if '@' in d:_d=d.split('@')[1]
		m='/home/%s/.network/ftp_%s'%(u,_d.replace(':','_'))
		_p='%s%s'%(m,_pt)
		if not os.path.exists(m):
			os.system('sudo mkdir -p "%s"'%m)
			os.system('sudo chmod 0777 "%s"'%m)
			#os.system('sudo chown %s:box "%s"'%(u,m))
		if not os.path.ismount(m):
			c='sudo curlftpfs -o codepage=utf8,rw,allow_other,auto_unmount ftp://%s %s'%(d,m)
			os.system(c)
			c='%s/.box.backup.conf'
			from backup import copy
			copy(c,True)
	if p.startswith('smb://'):
		pt=p.replace('smb://','')
		if not '/' in pt:pt='%s/'%pt
		i=pt.index('/')
		d=pt[:i]
		_pt=pt[i:]
		_d=d
		_u=''
		_pw=''
		if '@' in d:
			s=d.split('@')
			_up=s[0].split(':')
			_u=_up[0]
			_pw=_up[1]
			_d=s[1]
		m='/home/%s/.network/smb%s'%(u,_d)
		_p='%s%s'%(m,_pt)
		if not os.path.exists(m):
			os.system('sudo mkdir -p "%s"'%m)
			os.system('sudo chown %s:box "%s"'%(u,m))
		ms=[]
		c='sudo smbclient -L '+_d+' -U '+_u+'%'+_pw+' -m SMB2'
		r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
		if r.startswith('Domain='):
			_r=r.split('Domain=')[1].split('\n')
			for l in _r:
				if not l.startswith('\t') or not 'Disk' in l:continue
				i=l.rindex('Disk')
				_s=l[:i].strip()
				if _s.endswith('$'):continue
				ms.append(_s)
				_m='%s/%s'%(m,_s)
				if not os.path.exists(_m):
					os.system('sudo mkdir -p "%s"'%_m)
					os.system('sudo chmod 0777 "%s"'%_m)
					os.system('sudo chown %s:box "%s"'%(u,_m))
				if not os.path.ismount(_m):
					c='sudo mount.cifs //%s/%s %s -o username=%s,password=%s,vers=2.0,iocharset=utf8,rw,nounix,noserverino'%(_d,_s,_m,_u,_pw)
					os.system(c)
		if len(ms)==0:
			os.system('sudo rm -rf %s'%m)
		else:
			l=os.listdir(m)
			for i in l:
				if not i in ms:
					_i='%s/%s'%(m,i)
					os.system('sudo umount -l %s'%_i)
					os.system('sudo rm -rf %s'%_i)
	return os.path.normpath(_p)

def _get_uipath(p,u,pt='file:///'):
	if os.path.isdir(os.path.realpath(p)):p=p+'/'
	if p.startswith('/box/storage'):
		return p.replace('/box/storage','file:///%s/storage'%_get_storage())
	if p.startswith('/home/%s'%u):
		return p.replace('/home/%s/'%u,'home:///',1)
	if p.startswith('/home/%s/Desktop'%u):
		return p.replace('/home/%s/Desktop/'%u,'desktop:///',1)
	if p.startswith('/home/Public'):
		return p.replace('/home/Public/','public:///',1)
	if pt.startswith('file:///'):
		if p.startswith('/box/drives/'):return p.replace('/box/drives/','file:///',1)
		else:return 'file:///C%s'%p
	if pt.startswith('trash:///'):
		_p=p.split('/')
		return 'trash:///%s/%s'%(_p[2],'/'.join(_p[6:]))
	return False