function DaapClient(ip, port) {
    var SERVER = window.top.DOMAIN;
    var httpClient = new DaapHttpClient(SERVER);
    var sid = null;
    var rid = null;
    function EndOfPacketException() {

    }
    function DaapPacket(chunk, start) {
        var CODE_LENGTH = 4;
        var SIZE_LENGTH = 4;
        var HEADER_LENGTH = CODE_LENGTH + SIZE_LENGTH;
        if (typeof(start) == 'undefined') {
            start = 0;
        }
        var offset = 0;
        var length = chunk.length - start;
        if (length < HEADER_LENGTH) {
            throw new EndOfPacketException();
        }
        var code = chunk.substring(start, start + CODE_LENGTH);
        var size = readUInt32(chunk, start + CODE_LENGTH);
        if (length < HEADER_LENGTH + size) {
            throw new EndOfPacketException();
        }
        var data = chunk.substring(start + HEADER_LENGTH, start + HEADER_LENGTH + size);
        this.readNextChunk = function() {
            var result = new DaapPacket(data, offset);
            offset += result.size();
            return result;
        };
        this.codeEquals = function(other) {
            return code == other;
        };
        this.size = function() {
            return data.length + HEADER_LENGTH;
        };
        this.convertToInt = function() {
            return readUInt32(data, 0);
        };
        this.convertToString = function() {
			return _utf8_decode(data);
        };
        this.seekFirst = function(refCode) {
            offset = 0;
            var result = null;
            while (true) {
                try {
                    result = this.readNextChunk();
                    if (result.codeEquals(refCode)) {
                        break;
                    }
                } catch (e) {
                    if (e instanceof EndOfPacketException) {
                        result = null;
                        break;
                    } else {
                        throw e;
                    }
                }
            }
            return result;
        };
        this.seek = function(refCode) {
            offset = 0;
            var result = [];
            var next;
            while (true) {
                try {
                    next = this.readNextChunk();
                    if (next.codeEquals(refCode)) {
                        result.push(next);
                    }
                } catch (e) {
                    if (e instanceof EndOfPacketException) {
                        break;
                    } else {
                        throw e;
                    }
                }
            }
            return result;
        };
        function readUInt32(data, offset) {
            return ((data.charCodeAt(offset) & 0xFF) << 24) + ((data.charCodeAt(offset + 1) & 0xFF) << 16) + ((data.charCodeAt(offset + 2) & 0xFF) << 8) + (data.charCodeAt(offset + 3) & 0xFF);
        }

    }
    function DaapHttpClient(aServer) {
        var server = aServer;
        var encodedPassword = null;
        this.execute = function(request) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() { 
                if (this.readyState == 4) {
					try {
						var packet = new DaapPacket(xhr.responseText);
						request.handleResponse(packet);
					} catch (e) {
						if (e instanceof EndOfPacketException) {
							request.fail(400);
						} else {
							throw e;
						}
					}
                }
            };
            xhr.open("GET", SERVER + request.getUri(), true);
            if (!('overrideMimeType' in xhr)) {
                throw new Error("Your browser does not support binary encoding, aborting ...");
            }
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            if (encodedPassword != null) {
                xhr.setRequestHeader('Authorization', 'Basic ' + encodedPassword);
            }
            xhr.send();
        };
        this.setPassword = function(password) {
            encodedPassword = btoa("admin:" + password);
        };

    }
    function LoginRequestHandler(l) {
        var listener = l;
        this.handleResponse = function(packet) {
            var sid = packet.seekFirst('mlid').convertToInt();
            l.sidUpdated(sid);
        };
        this.fail = function(code) {
            l.fail(code);
        };
        this.getUri = function() {
            return "login";
        };
    }
    function UpdateRequestHandler(aSid, l) {
        var sid = aSid;
        var listener = l;
        this.handleResponse = function(packet) {
            var rid = packet.seekFirst('musr').convertToInt();
            l.ridUpdated(rid);
        };
        this.fail = function(code) {
            l.fail(code);
        };
        this.getUri = function() {
            return "update?session-id=" + sid;
        };
    }
    function DatabaseRequestHandler(aSid, aRid, aServer, aCallback) {
        var sid = aSid;
        var rid = aRid;
        var server = aServer;
        var callback = aCallback;
        var fields = [
            "dmap.itemid",
            "daap.songformat",
            "dmap.itemname",
            "daap.songalbum",
            "daap.songartist",
            "daap.songgenre",
            "daap.songtracknumber",
            "daap.songtime",
            "daap.songsize",
            "daap.songyear",
            "daap.songbitrate"
            ];
        this.handleResponse = function(packet) {
            var mlcl = packet.seekFirst("mlcl");
            var mlits = mlcl.seek("mlit");
            var mlitsLength = mlits.length;
            var audioStreams = [];
            for (var i = 0; i < mlitsLength; i++) {
                audioStreams.push(createDaapStream(mlits[i]));
            }
            callback(200, audioStreams);
        };
        this.fail = function(code) {
            callback(code, undefined);
        };
        this.getUri = function() {
            return "databases/1/items?type=music&session-id=" + sid + "&revision-id=" + rid + "&meta=" + fields.join();
        };

        function createDaapStream(mlit) {
            var daapSongId = extractInt(mlit, "miid");
            var songFormat = extractString(mlit, "asfm");
            var uri = "/databases/1/items/" + daapSongId + "." + songFormat + "?session-id=" + sid;
			var id = sid + "-" + daapSongId;
            var trackNumber = extractInt(mlit, "astn");
            var title = extractString(mlit, "minm");
            var album = extractString(mlit, "asal");
            var artist = extractString(mlit, "asar");
            var genre = extractString(mlit, "asgn");
            var duration = extractInt(mlit, "astm");
            var size = extractInt(mlit, "assz");
            var bitrate = extractInt(mlit, "asbr");
            var year = extractInt(mlit, "asyr");
            var result = {
                uri: uri,
                trackNumber: trackNumber,
                title: title,
                album: album,
                artist: artist,
                genre: genre,
                id: id,
                duration: duration,
                size: size,
                format: songFormat,
                bitrate: (bitrate >> 16),
                year: (year >> 16)
            };
            return result;
        }
        function extractInt(packet, code) {
            var chunk = packet.seekFirst(code);
            var result = -1;
            if (chunk != null) {
                result = chunk.convertToInt();
            }
            return result;
        }
        function extractString(packet, code) {
            var chunk = packet.seekFirst(code);
            var result = "";
            if (chunk != null) {
                result = chunk.convertToString();
            }
            return result;
        }
    }
    function LoginListener(aCallback) {
        var callback = aCallback;
        this.sidUpdated = function(aSid) {
            sid = aSid;
            var handler = new UpdateRequestHandler(sid, this);
            httpClient.execute(handler);
        };
        this.ridUpdated = function(aRid) {
            rid = aRid;
            callback(200);
        };
        this.fail = function(code) {
            callback(code);
        };

    }
    function checkLogin() {
        if (sid == null || rid == null) {
            throw new Error("Login not completed.");
        }
    }
    this.secureLogin = function(password, callback) {
        if (typeof(password) != 'undefined') {
            httpClient.setPassword(password);
        }
        this.login(callback);
    };
    this.login = function(callback) {
        var l = new LoginListener(callback);
        var handler = new LoginRequestHandler(l);
        httpClient.execute(handler);
    };
    this.fetchStreams = function(callback) {
        checkLogin();
        var handler = new DatabaseRequestHandler(sid, rid, SERVER, callback);
        httpClient.execute(handler);
    };

}
function _utf8_decode(utftext) {
	var string = "";
	var i = 0;
	var c =0, c1 = 0, c2 = 0,c3;
	while ( i < utftext.length ) {
		c = utftext.charCodeAt(i);
		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		}else if((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i+1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		}
		else {
			c2 = utftext.charCodeAt(i+1);
			c3 = utftext.charCodeAt(i+2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return string;
}