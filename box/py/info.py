#!/usr/bin/python
# -*- coding: utf-8 -*-
import json
import os
import time
import web
import subprocess
import auth
LOCALTIME='/etc/localtime'
TIMEZONE='/etc/timezone'

def status():
	return 200;

def base():
	rg=auth._check_sn()
	au=True
	if auth._check_admin()==0:au=False
	import hashlib
	t=time.time()*1000
	s='%s:%s'%(web.ctx.ip,t)
	m=hashlib.md5()
	m.update(s)
	n=m.hexdigest()
	r={
		'mac':_get_network_mac()
		,'ipaddr':_get_network_ipaddrs()[0]
		,'publickey':_get_public_key()
		,'time':t
		,'nonce':n
		,'hostname':_get_hostname()
		,'storage':_get_storage()
		,'registered':rg
		,'adminuser':au
	}
	return r

def get():
	u,a=auth._auth()
	if not u or not a:return 403
	u=os.uname();
	if os.path.exists('/etc/redhat-release'):
		f=open('/etc/redhat-release')
		v=f.read().strip()
		f.close()
	else:
		f=open('/etc/issue')
		v=f.read().replace('\\n','').strip('\l\n ')
		f.close()
	l=open('/proc/cpuinfo').readlines()
	c=[]
	for i in l:
		if i.startswith('model name'):
			_i=i.split(':')
			c.append(_i[1].strip())
	c=','.join(c)
	f=open('/proc/meminfo')
	l=f.readlines()
	f.close()
	m=''
	for i in l:
		if i.startswith('MemTotal'):
			_i=i.split(':')
			m=_i[1].strip()
	h=u[1]
	w={'workgroup':''}
	_get_name_value('/box/etc/workgroup.conf',w)
	w=w['workgroup']
	k=u[2]
	return {'kernel':k,'version':v,'cpu':c,'memory':m,'hostname':h,'workgroup':w}

def top():
	u,a=auth._auth()
	if not u or not a:return 403
	c='sudo cat /sys/class/thermal/thermal_zone0/temp'
	r0=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	c='sudo top -bn 2 -i -c'
	r1=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	t=round(float(r0)/1000,1)
	r1=r1.replace('top - ','uptime: ')
	return {'message':'temperature: %s°C\n%s'%(t,r1)}

def gettemp():
	u,a=auth._auth()
	if not u:return 403
	c='sudo cat /sys/class/thermal/thermal_zone0/temp'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	t=round(float(r)/1000,1)
	return {'temp':'%s°C\n'%t}

def getapps():
	u,a=auth._auth()
	if not u:return 403
	b='/box/www/os/'
	_p=['%s/System'%b,'%s/Applications'%b]
	r={}
	for p in _p:
		if not os.path.exists(p):continue
		l=os.listdir(p)
		l.sort()#key=str.lower
		i=os.path.basename(p)
		r[i]=[]
		for f in l:
			_p='%s/%s'%(p,f)
			if os.path.isfile(_p):continue
			r[i].append({'name':f,'options':json.loads(file(_p+'/conf.json').read().replace('\xef\xbb\xbf',''))});
	return r

def gettime():
	u,a=auth._auth()
	if not u or not a:return 403
	t=time.time()*1000
	l=os.readlink(LOCALTIME).replace('/usr/share/zoneinfo/','')
	return {'time':t,'zone':l}

def settime():
	u,a=auth._auth()
	if not u or not a:return 403
	rq=web.input()
	z=rq['zone']
	p='/usr/share/zoneinfo/%s'%z
	if not os.path.exists(LOCALTIME) or not os.path.samefile(p,LOCALTIME):os.system('sudo rm -rf %s'%LOCALTIME)
	os.system('sudo timedatectl set-ntp true')
	os.system('sudo ln -s %s %s'%(p,LOCALTIME))
	os.system('sudo chmod 0666 %s'%TIMEZONE)
	os.system('sudo echo -e "%s\c" > %s'%(z,TIMEZONE))
	os.system('sudo chmod 0644 %s'%TIMEZONE)
	os.system('sudo ntpdate pool.ntp.org')
	return gettime()

def sethostname():
	u,a=auth._auth()
	if not u or not a:return 403
	rq=web.input()
	n=rq['name']
	n=n.strip().replace(' ','')
	h=_get_hostname()
	os.system('sudo chmod 777 /etc/hosts')
	try:
		c=[]
		oh='127.0.0.1 %s\n'%h
		nh='127.0.0.1 %s\n'%n
		f=open('/etc/hosts','r')
		ls=f.readlines();
		r=False
		for l in ls:
			if l==oh:
				c.append(nh)
				r=True
			else:
				c.append(l)
		if not r:
			c.append(nh)
		_write('/etc/hosts',''.join(c))
	finally:
		f.close()
	os.system('sudo chmod 644 /etc/hosts')
	os.system('sudo hostname %s'%n)
	os.system('sudo chmod 777 /etc/hostname')
	os.system('sudo echo "%s" > /etc/hostname'%n)
	os.system('sudo chmod 644 /etc/hostname')
	_set_name_value('/box/etc/workgroup.conf',{'netbios name':n})
	_set_name_value('/box/etc/minidlna.conf',{'friendly_name':n})
	_set_name_value('/box/etc/forked-daapd.conf',{'name':n})
	os.system('sudo systemctl restart nmbd.service')
	os.system('sudo systemctl restart avahi-daemon.service')
	return 200

def setworkgroup():
	u,a=auth._auth()
	if not u or not a:return 403
	rq=web.input()
	n=rq['name']
	n=n.replace(' ','')
	_set_name_value('/box/etc/workgroup.conf',{'workgroup':n})
	os.system('sudo systemctl restart smbd.service')
	return 200

def getnetwork():
	u,a=auth._auth()
	if not u or not a:return 403
	r={
		'adapter':[],
		'dns':_get_network_dns()
		}
	for i in os.listdir('/sys/class/net'):
		if not (i.startswith('eth') or i.startswith('wlan')): continue
		n={
			'name':i,
			'model':_get_network_model(i),
			'hwaddr':_get_network_mac(i),
			'dhcp':_get_network_dhcp(i),
			'ipaddr':_get_network_ipaddr(i),
			'gateway':_get_network_gateway(i),
			'netmask':_get_network_mask(i)
		}
		if i.startswith('wlan'):
			n['list']=_iwlist(i)
			n['essid'],n['quality']=_iwconfig(i)
		r['adapter'].append(n) 
	return r

def setnetwork():
	u,a=auth._auth()
	if not u or not a:return 403
	rq=web.input()
	n=rq['name']
	if n.startswith('eth'):
		d=rq['dhcp']
		i=rq['ipaddr']
		m=rq['netmask']
		g=rq['gateway']
		if d=='true':s='dhcp'
		else:s='static'
		f='/etc/network/interfaces.d/%s'%n
		if not os.path.exists(f):os.system('sudo touch %s && sudo chmod 0666 %s'%(f,f))
		c=['auto %s'%n,'iface %s inet %s'%(n,s)]
		if s=='static':
			c.append('address %s'%i)
			c.append('netmask %s'%m)
			c.append('gateway %s'%g)
		c='\n'.join(c)
		_write(f,c)
	if 'wlan' in n:
		f='/etc/wpa_supplicant/wpa_supplicant.conf'
		os.system('sudo chmod 0666 %s'%f)
		e=rq['essid']
		k=rq['psk']
		_r='''network={
    ssid="%s"
    key_mgmt=NONE
}'''%e
		if k!='none':
			c='wpa_passphrase "%s" "%s"'%(e,k)
			r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.readlines()
			_r=[]
			for l in r:
				_l=l.strip()
				if _l.startswith('#'):continue
				_r.append(l)
			_r=''.join(_r)
		c='''country=CN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

%s'''%_r
		_write(f,c)
		os.system('sudo chmod 0600 %s'%f)
		os.system('wpa_supplicant -B -c/etc/wpa_supplicant/wpa_supplicant.conf -i%s -Dnl80211,wext'%n)
		os.system('sudo wpa_cli -i %s reconfigure'%n)
	return 200

def getbluetooth():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	from service import _service_status
	if not _service_status('bluetooth'):os.system('sudo systemctl restart bluetooth.service')
	if not _service_status('bluealsa'):os.system('sudo systemctl restart bluealsa.service')
	os.system('sudo killall bt-adapter')
	c='sudo bt-adapter -d > /dev/null 2>&1 &'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE)
	pid=r.pid
	if not rq.has_key('pid') or (rq.has_key('pid') and (rq['pid']=='' or subprocess.Popen('ps aux|grep bt-adapter |grep %s'%rq['pid'],shell=True,stdout=subprocess.PIPE).stdout.read()=='')):time.sleep(10)
	c='sudo bt-device -l'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE)
	l=r.stdout.readlines()
	_r=[]
	for i in l:
		if i.startswith('Added devices:') or i.startswith('No devices found'):continue
		x=i.rindex('(')
		m=i[x:].strip('()\n')
		__r=_get_bt_info(m)
		if not __r:continue
		_r.append(__r)
	return {'pid':pid,'dev':_r}

def pairbluetooth():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	m=rq['dev']
	os.system('sudo bt-device --set %s Trusted true'%m)
	os.system('echo "yes"|sudo bt-device -c %s'%m)
	_set_asound(m)
	return 200

def unpairbluetooth():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	m=rq['dev']
	os.system('sudo bt-device --set %s Trusted false'%m)
	os.system('sudo bt-device -r %s'%m)
	return 200

def connectbluetooth():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	m=rq['dev']
	os.system('echo "connect %s\n" |sudo bluetoothctl'%m)
	return 200

def disconnectbluetooth():
	u,a=auth._auth()
	if not a:return 403
	rq=web.input()
	m=rq['dev']
	os.system('echo "disconnect %s\n" |sudo bluetoothctl'%m)
	return 200

def _get_bt_info(m):
	c='sudo bt-device -i %s'%m
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE)
	_l=r.stdout.read()
	if 'Address: (null)' in _l:return False
	_l=_l.split('\n')
	__r={}
	for _i in _l:
		if _i=='' or _i.strip('\n').startswith('['):continue
		x=_i.index(':')
		k=_i[:x].strip()
		if k not in ['Name','Address','Icon','Class','Paired','Connected','Blocked','Trusted','UUIDs']:continue
		v=_i[x+1:].strip()
		__r[k]=v
	return __r

def _set_asound(m):
	i=_get_bt_info(m)
	if not 'AudioSink' in i['UUIDs']: return False
	f='/etc/asound.conf'
	c=''
	if os.path.exists(f):
		c=open(f).read()
		if m in c:return True
	else:os.system('sudo touch %s'%f)
	os.system('sudo chmod 0777 %s'%f)
	n=i['Name']
	_m=m.replace(':','')
	_c='''
pcm.%s{
    type plug
    slave {
        pcm {
            type bluealsa
            interface hci0
            device %s
            profile "a2dp"
        }
    }
    hint {
        show on
        description "%s"
    }
}'''%(_m,m,n)
	_write(f,c+_c)
	os.system('sudo chmod 0644 %s'%f)
	os.system('sudo systemctl restart bluealsa.service')
	os.system('sudo systemctl restart bluetooth.service')
	return True

def _get_hostname():
	c='sudo hostname'
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	return r.replace('\n','')
	
def _get_public_key():
	return open('/box/etc/public.pem').read()

def _get_network_model(dev='eth0'):
	try:
		c='sudo /bin/dmesg | grep "%s: PHY is "'%dev
		r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
		v=r.split('\n')[0].strip('\n').split('%s: PHY is '%dev)
		return v[1].split(',')[0].strip()
	except:
		return ''

def _get_network_mac(dev='eth0'):
	return _ifconfig(dev,'ether')

def _get_network_ipaddr(dev='eth0'):
	return _ifconfig(dev,'inet')

def _get_network_mask(dev='eth0'):
	return _ifconfig(dev,'netmask')

def _get_network_gateway(dev='eth0'):
	gw=''
	f=open('/proc/net/route')
	for line in f:
		g=line.split()
		if g[0]==dev and g[1]=='00000000':
			g2=g[2]
			gw='%s.%s.%s.%s'%(int(g2[6:8],16),int(g2[4:6],16),int(g2[2:4],16),int(g2[0:2],16) )
			break
	f.close()
	return gw

def _get_network_dns():
	dns=[]
	names={'nameserver': dns}
	_get_name_value('/etc/resolv.conf',names,equal=' ')
	return dns

def _get_network_dhcp(dev='eth0'):
	f='/etc/network/interfaces.d/%s'%dev
	if not os.path.exists(f):return True
	n={'iface %s inet'%dev:'','wpa-ssid':''}
	_get_name_value(f,n,equal=' ')
	if dev.startswith('wlan'):
		if 'wpa-ssid'=='':return True
	if n['iface %s inet'%dev].lower()=='dhcp':return True
	return False

def _get_network_ipaddrs():
	r=[]
	for i in os.listdir('/sys/class/net'):
		if not (i.startswith('eth') or i.startswith('wlan')): continue
		a=_get_network_ipaddr(i)
		if a!='':r.append(a)
	return r

def _iwlist(d):
	c='sudo iwlist %s scan'%d
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	_r=r.split('Cell')
	_w=[]
	w=[]
	for i in _r:
		if 'Scan completed' in i:continue
		c=i.split('\n')
		n={}
		for j in c:
			j=j.strip()
			if j.startswith('Quality='):
				q=j.split('Quality=')[1].split(' ')[0].split('/')
				p=int(q[0])/int(q[1])
				s='weak'
				if p>.4:s='middle'
				if p>.7:s='strong'
				n['quality']=s
			if j.startswith('Encryption key:'):
				n['key']=j.split(':')[1]
			if j.startswith('ESSID:'):
				n['essid']=j.split(':')[1].strip('\"')
				if '\\x' in n['essid']:
					try:n['essid']=eval('"%s".decode("utf8","ignore")'%n['essid'])
					except:pass
		if 'WPA2' in i and 'PSK' in i:n['encryption']='WPA2PSK'
		if not n['essid'] in _w:
			w.append(n)
			_w.append(n['essid'])
	return w

def _iwconfig(d):
	c='sudo iwconfig %s'%d
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	if not 'Link Quality=' in r:return '',''
	e=r.split('ESSID:')[1].split(' ')[0].strip('\"')
	q=r.split('Link Quality=')[1].split(' ')[0]
	return e,q

def _ifconfig(d,p):
	_p='%s '%p 
	c='ifconfig %s'%d
	r=subprocess.Popen(c,shell=True,stdout=subprocess.PIPE).stdout.read()
	if not _p in r:return ''
	_r=r.split(_p)[1]
	i=_r.index(' ')
	return _r[:i]

def _get_storage():
	l=os.listdir('/box/drives')
	r=os.path.dirname(os.path.realpath('/box/storage'))
	d='C:'
	for i in l:
		if os.path.realpath('/box/drives/%s'%i)==r:
			d=i
			break
	return d

def _get_name_value(_file,names,equal='=',comms=['#',';']):
	with open(_file,'r') as f:
		try:
			o=f.readlines();
			f.close()
			for l in o:
				L=l.strip()
				if L[:1] in comms or not equal in L:continue
				i=L.rfind(equal)
				L0=L[:i].strip()
				L1=L[i+1:].strip()
				if not L0 in names:continue
				if isinstance(names[L0],list):names[L0].append(L1)
				else:names[L0]=L1
		except Exception,e:
			print 'System Error: %s'%e
		finally:
			f.close()
		return 200

def _set_name_value(_file,names,equal='=',comms=['#',';']):
	if not os.path.exists(_file):os.system('sudo touch "%s"'%_file)
	os.system('sudo chmod 0777 "%s"'%_file)
	with open(_file,'r') as f:
		r=[];
		h=[];
		try:
			ls=f.readlines()
			f.close()
			for l in ls:
				L=l.strip()
				if L[:1] in comms or equal not in L:
					r.append(l)
					continue
				i=L.rfind(equal)
				L0=L[:i].strip()
				L1=L[i:].strip()
				h.append(L0)
				if L0 not in names:
					r.append(l)
					continue
				if not isinstance(names[L0],list):
					r.append('%s%s%s\n'%(L0,equal,names[L0]))
			for n in names:
				if isinstance(names[n],list):
					for i in names[n]:r.append('%s%s%s\n'%(n,equal,i))
					continue
				if n not in h:
					r.append('%s%s%s\n'%(n,equal,names[n]))
			tf='/tmp/%s'%os.path.basename('_file')
			with open(tf,'w+') as f:f.writelines(r)
			os.system('sudo mv "%s" "%s"'%(tf,_file))
			f.close()
		except Exception,e:
			print 'System Error: %s'%e
		finally:
			f.close()
		return 200

def _write(f,c):
	_f=open(f,'w+')
	try:_f.write(c)
	finally:_f.close()