﻿/*Copyright (C) 2008-2010 Markus Gutschke markus@shellinabox.com*/
function VT100(t) {
    "undefined" == typeof linkifyURLs || linkifyURLs <= 0 ? this.urlRE = null : this.urlRE = new RegExp("(?:http|https|ftp)://(?:[^:@/  ]*(?::[^@/  ]*)?@)?(?:[1-9][0-9]{0,2}(?:[.][1-9][0-9]{0,2}){3}|[0-9a-fA-F]{0,4}(?::{1,2}[0-9a-fA-F]{1,4})+|(?!-)[^[!\"#$%&'()*+,/:;<=>?@\\^_`{|}~\0- - ]+)(?::[1-9][0-9]*)?(?:/(?:(?![/  ]|[,.)}\"'!]+[  ]|[,.)}\"'!]+$).)*)*|" + (linkifyURLs <= 1 ? "" : "(?:[^:@/  ]*(?::[^@/  ]*)?@)?(?:[1-9][0-9]{0,2}(?:[.][1-9][0-9]{0,2}){3}|localhost|(?:(?!-)[^.[!\"#$%&'()*+,/:;<=>?@\\^_`{|}~\0- - ]+[.]){2,}(?:(?:com|net|org|edu|gov|aero|asia|biz|cat|coop|info|int|jobs|mil|mobi|museum|name|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(?![a-zA-Z0-9])|[Xx][Nn]--[-a-zA-Z0-9]+))(?::[1-9][0-9]{0,4})?(?:/(?:(?![/  ]|[,.)}\"'!]+[  ]|[,.)}\"'!]+$).)*)*|") + "(?:mailto:)" + (linkifyURLs <= 1 ? "" : "?") + "[-_.+a-zA-Z0-9]+@(?!-)[-a-zA-Z0-9]+(?:[.](?!-)[-a-zA-Z0-9]+)?[.](?:(?:com|net|org|edu|gov|aero|asia|biz|cat|coop|info|int|jobs|mil|mobi|museum|name|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(?![a-zA-Z0-9])|[Xx][Nn]--[-a-zA-Z0-9]+)(?:[?](?:(?![  ]|[,.)}\"'!]+[  ]|[,.)}\"'!]+$).)*)?"), 
    this.getUserSettings(), this.initializeElements(t), this.maxScrollbackLines = 2e3, 
    this.npar = 0, this.par = [], this.isQuestionMark = !1, this.savedX = [], this.savedY = [], 
    this.savedAttr = [], this.savedAttrFg = [], this.savedAttrBg = [], this.savedUseGMap = 0, 
    this.savedGMap = [ this.Latin1Map, this.VT100GraphicsMap, this.CodePage437Map, this.DirectToFontMap ], 
    this.savedValid = [], this.respondString = "", this.titleString = "", this.internalClipboard = void 0, 
    this.reset(!0);
}

function extend(t, e) {
    function s() {}
    s.prototype = e.prototype, t.prototype = new s(), t.prototype.constructor = t, t.prototype.superClass = e.prototype;
}

function ShellInABox(t, e) {
    if (void 0 == t ? (this.rooturl = window.top.DOMAIN, this.url = window.top.DOMAIN+"shell") : (this.rooturl = t, 
    this.url = t), "" != document.location.hash) {
        var s = decodeURIComponent(document.location.hash).replace(/^#/, "");
        this.nextUrl = s.replace(/,.*/, ""), this.session = s.replace(/[^,]*,/, "");
    } else this.nextUrl = this.url, this.session = null;
    this.pendingKeys = "", this.keysInFlight = !1, this.connected = !1, this.replayOnOutput = !1, 
    this.replayOnSession = !1, this.superClass.constructor.call(this, e), setTimeout(function(t) {
        return function() {
            t.messageInit(), t.sendRequest();
        };
    }(this), 1);
}

serverSupportsSSL = !0, disableSSLMenu = !1, suppressAllAudio = !0, linkifyURLs = 1, 
userCSSList = [ [ "White On Black", !0, !0 ] ], serverMessagesOrigin = !1, VT100.prototype.reset = function(t) {
    if (this.isEsc = 0, this.needWrap = !1, this.autoWrapMode = !0, this.dispCtrl = !1, 
    this.toggleMeta = !1, this.insertMode = !1, this.applKeyMode = !1, this.cursorKeyMode = !1, 
    this.crLfMode = !1, this.offsetMode = !1, this.mouseReporting = !1, this.printing = !1, 
    void 0 !== this.printWin && this.printWin && !this.printWin.closed && this.printWin.close(), 
    this.printWin = null, this.utfEnabled = this.utfPreferred, this.utfCount = 0, this.utfChar = 0, 
    this.color = "ansiDef bgAnsiDef", this.style = "", this.attr = 24816, this.attrFg = !1, 
    this.attrBg = !1, this.useGMap = 0, this.GMap = [ this.Latin1Map, this.VT100GraphicsMap, this.CodePage437Map, this.DirectToFontMap ], 
    this.translate = this.GMap[this.useGMap], this.top = 0, this.bottom = this.terminalHeight, 
    this.lastCharacter = " ", this.userTabStop = [], t) for (var e = 0; e < 2; e++) for (;this.console[e].firstChild; ) this.console[e].removeChild(this.console[e].firstChild);
    this.enableAlternateScreen(!1);
    var s = !1, i = this.getTransformName();
    if (i) {
        for (var e = 0; e < 2; ++e) s |= "" != this.console[e].style[i], this.console[e].style[i] = "";
        this.cursor.style[i] = "", this.space.style[i] = "", "filter" == i && (this.console[this.currentScreen].style.width = "");
    }
    this.scale = 1, s && this.resizer(), this.gotoXY(0, 0), this.showCursor(), this.isInverted = !1, 
    this.refreshInvertedState(), this.clearRegion(0, 0, this.terminalWidth, this.terminalHeight, this.color, this.style);
}, VT100.prototype.addListener = function(t, e, s) {
    try {
        t.addEventListener ? t.addEventListener(e, s, !1) : t.attachEvent("on" + e, s);
    } catch (t) {}
}, VT100.prototype.getUserSettings = function() {
    if (this.signature = 3, this.utfPreferred = !0, this.visualBell = "undefined" != typeof suppressAllAudio && suppressAllAudio, 
    this.autoprint = !0, this.softKeyboard = !1, this.blinkingCursor = !0, this.disableAlt = !1, 
    -1 != navigator.platform.indexOf("Mac") && (this.disableAlt = !0), null == navigator.userAgent.match(/iPad|iPhone|iPod/i) && null == navigator.userAgent.match(/PlayStation Vita|Kindle/i) || (this.softKeyboard = !1), 
    this.visualBell && (this.signature = Math.floor(16807 * this.signature + 1) % ((1 << 31) - 1)), 
    "undefined" != typeof userCSSList) for (var t = 0; t < userCSSList.length; ++t) {
        for (var e = userCSSList[t][0], s = 0; s < e.length; ++s) this.signature = Math.floor(16807 * this.signature + e.charCodeAt(s)) % ((1 << 31) - 1);
        userCSSList[t][1] && (this.signature = Math.floor(16807 * this.signature + 1) % ((1 << 31) - 1));
    }
    var i = "shellInABox=" + this.signature + ":", r = document.cookie.indexOf(i);
    if (r >= 0 && (r = document.cookie.substr(r + i.length).replace(/([0-1]*).*/, "$1"), 
    r.length == 6 + ("undefined" == typeof userCSSList ? 0 : userCSSList.length) && (this.utfPreferred = "0" != r.charAt(0), 
    this.visualBell = "0" != r.charAt(1), this.autoprint = "0" != r.charAt(2), this.softKeyboard = "0" != r.charAt(3), 
    this.blinkingCursor = "0" != r.charAt(4), this.disableAlt = "0" != r.charAt(5), 
    "undefined" != typeof userCSSList))) for (var t = 0; t < userCSSList.length; ++t) userCSSList[t][2] = "0" != r.charAt(t + 6);
    this.utfEnabled = this.utfPreferred;
}, VT100.prototype.storeUserSettings = function() {
    var t = "shellInABox=" + this.signature + ":" + (this.utfEnabled ? "1" : "0") + (this.visualBell ? "1" : "0") + (this.autoprint ? "1" : "0") + (this.softKeyboard ? "1" : "0") + (this.blinkingCursor ? "1" : "0") + (this.disableAlt ? "1" : "0");
    if ("undefined" != typeof userCSSList) for (var e = 0; e < userCSSList.length; ++e) t += userCSSList[e][2] ? "1" : "0";
    var s = new Date();
    s.setDate(s.getDate() + 3653), document.cookie = t + ";expires=" + s.toGMTString();
}, VT100.prototype.initializeUserCSSStyles = function() {
    if (this.usercssActions = [], "undefined" != typeof userCSSList) {
        for (var t = "", e = "", s = 1, i = 0, r = 0; r <= userCSSList.length; ++r) {
            if (r < userCSSList.length) {
                var n = userCSSList[r][0], h = userCSSList[r][1], o = userCSSList[r][2], a = document.createElement("link");
                a.setAttribute("id", "usercss-" + r), a.setAttribute("href", "usercss-" + r + ".css"), 
                a.setAttribute("rel", "stylesheet"), a.setAttribute("type", "text/css"), document.getElementsByTagName("head")[0].appendChild(a), 
                o || ("onload" in a ? a.onload = function(t) {
                    return function() {
                        t.disabled = !0;
                    };
                }(a) : a.disabled = !0);
            }
            if (h || r == userCSSList.length) {
                0 != i && (r - i > 1 || !s) && (t += "<hr />"), s = r - i < 1, t += e, e = "";
                for (var c = i; c < r; ++c) this.usercssActions[this.usercssActions.length] = function(t, e, s, i) {
                    return function() {
                        for (var r = t.getChildById(t.menu, "beginusercss"), n = -1, h = -1, o = i; o > 0; ++h) {
                            if ("LI" == r.tagName && ++n >= s) {
                                --o;
                                var a = t.usercss.childNodes[h];
                                if (void 0 === a.textContent) {
                                    var c = a.innerText;
                                    a.innerHTML = "", a.appendChild(document.createTextNode(c));
                                } else a.textContent = a.textContent;
                                var l = document.getElementById("usercss-" + n);
                                n == e ? (l.disabled = 1 == i && !l.disabled, l.disabled || (a.setAttribute("enabled", "enabled"), 
                                a.innerHTML = a.innerHTML)) : l.disabled = !0, userCSSList[n][2] = !l.disabled;
                            }
                            r = r.nextSibling;
                        }
                        for (this.cursor.style.cssText = "", this.cursorWidth = this.cursor.clientWidth, 
                        this.cursorHeight = this.lineheight.clientHeight, n = 0; n < this.console.length; ++n) for (var d = this.console[n].firstChild; d; d = d.nextSibling) d.style.height = this.cursorHeight + "px";
                        t.resizer();
                    };
                }(this, c, i, r - i);
                if (r == userCSSList.length) break;
                i = r;
            }
            e += "<li " + (o ? 'enabled="enabled"' : "") + ">" + n + "</li>";
        }
        this.usercss.innerHTML = t;
    }
}, VT100.prototype.resetLastSelectedKey = function(t) {
    var e = this.lastSelectedKey;
    if (!e) return !1;
    var s = this.mousePosition(t), i = this.keyboard.firstChild;
    return (s[0] < i.offsetLeft + e.offsetWidth || s[1] < i.offsetTop + e.offsetHeight || s[0] >= i.offsetLeft + i.offsetWidth - e.offsetWidth || s[1] >= i.offsetTop + i.offsetHeight - e.offsetHeight || s[0] < i.offsetLeft + e.offsetLeft - e.offsetWidth || s[1] < i.offsetTop + e.offsetTop - e.offsetHeight || s[0] >= i.offsetLeft + e.offsetLeft + 2 * e.offsetWidth || s[1] >= i.offsetTop + e.offsetTop + 2 * e.offsetHeight) && (this.lastSelectedKey.className && log.console("reset: deselecting"), 
    this.lastSelectedKey.className = "", this.lastSelectedKey = void 0), !1;
}, VT100.prototype.showShiftState = function(t) {
    var e = document.getElementById("shift_state");
    t ? this.setTextContentRaw(e, "#vt100 #keyboard .shifted {display: inline }#vt100 #keyboard .unshifted {display: none }") : this.setTextContentRaw(e, "");
    for (var s = this.keyboard.getElementsByTagName("I"), i = 0; i < s.length; ++i) "16" == s[i].id && (s[i].className = t ? "selected" : "");
}, VT100.prototype.showCtrlState = function(t) {
    var e = this.getChildById(this.keyboard, "17");
    e && (e.className = t ? "selected" : "");
}, VT100.prototype.showAltState = function(t) {
    var e = this.getChildById(this.keyboard, "18");
    e && (e.className = t ? "selected" : "");
}, VT100.prototype.clickedKeyboard = function(t, e, s, i, r, n, h) {
    var o = [];
    return o.charCode = s, o.keyCode = i, o.ctrlKey = n, o.shiftKey = r, o.altKey = h, 
    o.metaKey = h, this.handleKey(o);
}, VT100.prototype.addKeyBinding = function(t, e, s, i, r) {
    if (void 0 != t) {
        " " == e && (e = " "), void 0 != e && void 0 == i && (i = e.toUpperCase()), void 0 == r && void 0 != s ? r = s : void 0 == r && void 0 != i && (r = i.charCodeAt(0)), 
        void 0 == s && void 0 != e && (s = e.charCodeAt(0)), e = e ? e.charCodeAt(0) : 0, 
        i = i ? i.charCodeAt(0) : 0, this.addListener(t, "mousedown", function(t, e, s) {
            return function(i) {
                return 1 == (i.which || i.button) && (t.lastSelectedKey && (t.lastSelectedKey.className = ""), 
                16 == s ? !e.className != t.isShift && t.showShiftState(!t.isShift) : 17 == s ? !e.className != t.isCtrl && t.showCtrlState(!t.isCtrl) : 18 == s ? !e.className != t.isAlt && t.showAltState(!t.isAlt) : e.className = "selected", 
                t.lastSelectedKey = e), !1;
            };
        }(this, t, s));
        var n = s >= 16 && s <= 18 ? function(t, e) {
            return function(i) {
                return e == t.lastSelectedKey && (16 == s ? (t.isShift = !t.isShift, t.showShiftState(t.isShift)) : 17 == s ? (t.isCtrl = !t.isCtrl, 
                t.showCtrlState(t.isCtrl)) : 18 == s && (t.isAlt = !t.isAlt, t.showAltState(t.isAlt)), 
                t.lastSelectedKey = void 0), t.lastSelectedKey && (t.lastSelectedKey.className = "", 
                t.lastSelectedKey = void 0), !1;
            };
        }(this, t) : function(t, e, s, i, r, n) {
            return function(h) {
                return t.lastSelectedKey && (e == t.lastSelectedKey && (t.isShift ? t.clickedKeyboard(h, e, r, n, !0, t.isCtrl, t.isAlt) : t.clickedKeyboard(h, e, s, i, !1, t.isCtrl, t.isAlt), 
                t.isShift = !1, t.showShiftState(!1), t.isCtrl = !1, t.showCtrlState(!1), t.isAlt = !1, 
                t.showAltState(!1)), t.lastSelectedKey.className = "", t.lastSelectedKey = void 0), 
                e.className = "", !1;
            };
        }(this, t, e, s, i, r);
        this.addListener(t, "mouseup", n), this.addListener(t, "click", n), this.addListener(t, "mouseout", function(t, e, s) {
            return function(i) {
                return 16 == s ? !e.className == t.isShift && t.showShiftState(t.isShift) : 17 == s ? !e.className == t.isCtrl && t.showCtrlState(t.isCtrl) : 18 == s ? !e.className == t.isAlt && t.showAltState(t.isAlt) : e.className ? (e.className = "", 
                t.lastSelectedKey = e) : t.lastSelectedKey && t.resetLastSelectedKey(i), !1;
            };
        }(this, t, s)), this.addListener(t, "mouseover", function(t, e, s) {
            return function(i) {
                return e == t.lastSelectedKey ? 16 == s ? !e.className != t.isShift && t.showShiftState(!t.isShift) : 17 == s ? !e.className != t.isCtrl && t.showCtrlState(!t.isCtrl) : 18 == s ? !e.className != t.isAlt && t.showAltState(!t.isAlt) : e.className || (e.className = "selected") : t.resetLastSelectedKey(i), 
                !1;
            };
        }(this, t, s));
    }
}, VT100.prototype.initializeKeyBindings = function(t) {
    if (t && ("I" == t.nodeName || "B" == t.nodeName)) if (t.id) {
        var e = parseInt(t.id);
        e && this.addKeyBinding(t, void 0, e);
    } else {
        var s = t.firstChild;
        if (s) if ("#text" == s.nodeName) {
            var i = this.getTextContent(s) || this.getTextContent(t);
            this.addKeyBinding(t, i.toLowerCase());
        } else s.nextSibling && this.addKeyBinding(t, this.getTextContent(s), void 0, this.getTextContent(s.nextSibling));
    }
    for (t = t.firstChild; t; t = t.nextSibling) this.initializeKeyBindings(t);
}, VT100.prototype.initializeKeyboardButton = function() {
    this.addListener(this.keyboardImage, "click", function(t) {
        return function(e) {
            return "" != t.keyboard.style.display ? "" != t.reconnectBtn.style.visibility && (t.initializeKeyboard(), 
            t.showSoftKeyboard()) : (t.hideSoftKeyboard(), t.input.focus()), !1;
        };
    }(this)), this.softKeyboard && (this.keyboardImage.style.visibility = "visible");
}, VT100.prototype.initializeKeyboard = function() {
    if (!this.keyboard.firstChild) {
        this.keyboard.innerHTML = this.layout.contentDocument.body.innerHTML;
        var t = this.keyboard.firstChild;
        this.hideSoftKeyboard(), this.addListener(this.keyboard, "click", function(t) {
            return function(e) {
                return t.hideSoftKeyboard(), t.input.focus(), !1;
            };
        }(this)), this.addListener(this.keyboard, "selectstart", this.cancelEvent), this.addListener(t, "click", this.cancelEvent), 
        this.addListener(t, "mouseup", function(t) {
            return function(e) {
                return t.lastSelectedKey && (t.lastSelectedKey.className = "", t.lastSelectedKey = void 0), 
                !1;
            };
        }(this)), this.addListener(t, "mouseout", function(t) {
            return function(e) {
                return t.resetLastSelectedKey(e);
            };
        }(this)), this.addListener(t, "mouseover", function(t) {
            return function(e) {
                return t.resetLastSelectedKey(e);
            };
        }(this));
        var e = document.createElement("style"), s = document.createAttribute("id");
        s.nodeValue = "shift_state", e.setAttributeNode(s);
        var i = document.createAttribute("type");
        i.nodeValue = "text/css", e.setAttributeNode(i), document.getElementsByTagName("head")[0].appendChild(e), 
        this.initializeKeyBindings(t);
    }
}, VT100.prototype.initializeElements = function(t) {
    if (t ? this.container = t : (this.container = document.getElementById("vt100")) || (this.container = document.createElement("div"), 
    this.container.id = "vt100", document.body.appendChild(this.container)), !(this.getChildById(this.container, "reconnect") && this.getChildById(this.container, "menu") && this.getChildById(this.container, "keyboard") && this.getChildById(this.container, "kbd_button") && this.getChildById(this.container, "kbd_img") && this.getChildById(this.container, "layout") && this.getChildById(this.container, "scrollable") && this.getChildById(this.container, "console") && this.getChildById(this.container, "alt_console") && this.getChildById(this.container, "ieprobe") && this.getChildById(this.container, "padding") && this.getChildById(this.container, "cursor") && this.getChildById(this.container, "lineheight") && this.getChildById(this.container, "usercss") && this.getChildById(this.container, "space") && this.getChildById(this.container, "input") && this.getChildById(this.container, "cliphelper"))) {
        try {
            void 0 !== navigator.mimeTypes["audio/x-wav"].enabledPlugin.name && ("undefined" != typeof suppressAllAudio && suppressAllAudio ? "" : '<embed classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" id="beep_embed" src="beep.wav" autostart="false" volume="100" enablejavascript="true" type="audio/x-wav" height="16" width="200" style="position:absolute;left:-1000px;top:-1000px" />');
        } catch (t) {}
        this.container.innerHTML = '<div id="reconnect" style="visibility: hidden"><input type="button" value="Connect" onsubmit="return false" /></div><div id="cursize" style="visibility: hidden"></div><div id="menu"></div><div id="keyboard" unselectable="on"></div><div id="scrollable"><pre id="lineheight">&nbsp;</pre><pre id="console"><pre></pre><div id="ieprobe"><span>&nbsp;</span></div></pre><pre id="alt_console" style="display: none"></pre><div id="padding"></div><pre id="cursor">&nbsp;</pre></div><div class="hidden"><div id="usercss"></div><div id="usercss"></div><pre><div><span id="space"></span></div></pre><input type="text" id="input" autocorrect="off" autocapitalize="off" /><input type="text" id="cliphelper" /></div>';
    }
    "undefined" != typeof suppressAllAudio && suppressAllAudio ? this.beeper = void 0 : (this.beeper = this.getChildById(this.container, "beep_embed"), 
    this.beeper && this.beeper.Play || (this.beeper = this.getChildById(this.container, "beep_bgsound"), 
    this.beeper && void 0 !== this.beeper.src || (this.beeper = void 0))), this.reconnectBtn = this.getChildById(this.container, "reconnect"), 
    this.curSizeBox = this.getChildById(this.container, "cursize"), this.menu = this.getChildById(this.container, "menu"), 
    this.keyboard = this.getChildById(this.container, "keyboard"), this.keyboardImage = this.getChildById(this.container, "kbd_img"), 
    this.layout = this.getChildById(this.container, "layout"), this.scrollable = this.getChildById(this.container, "scrollable"), 
    this.lineheight = this.getChildById(this.container, "lineheight"), this.console = [ this.getChildById(this.container, "console"), this.getChildById(this.container, "alt_console") ];
    var e = this.getChildById(this.container, "ieprobe");
    this.padding = this.getChildById(this.container, "padding"), this.cursor = this.getChildById(this.container, "cursor"), 
    this.usercss = this.getChildById(this.container, "usercss"), this.space = this.getChildById(this.container, "space"), 
    this.input = this.getChildById(this.container, "input"), this.cliphelper = this.getChildById(this.container, "cliphelper"), 
    this.initializeUserCSSStyles(), this.cursorWidth = this.cursor.clientWidth, this.cursorHeight = this.lineheight.clientHeight, 
    this.isIE = e.offsetTop > 1, e = void 0, this.console.innerHTML = "";
    for (var s = parseInt(this.getCurrentComputedStyle(document.body, "marginTop")), i = parseInt(this.getCurrentComputedStyle(document.body, "marginLeft")), r = parseInt(this.getCurrentComputedStyle(document.body, "marginRight")), n = this.container.offsetLeft, h = this.container.offsetTop, o = this.container; o = o.offsetParent; ) n += o.offsetLeft, 
    h += o.offsetTop;
    var a = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - r - (n + this.container.offsetWidth);
    if (this.isEmbedded = s != h || i != n || 0 != a && -1 != a, !this.isEmbedded) {
        this.indicateSize = !1, setTimeout(function(t) {
            return function() {
                t.indicateSize = !0;
            };
        }(this), 100), this.addListener(window, "resize", function(t) {
            return function() {
                t.hideContextMenu(), t.resizer(), t.showCurrentSize();
            };
        }(this)), document.body.style.margin = "0px";
        try {
            document.body.style.overflow = "hidden";
        } catch (t) {}
        try {
            document.body.oncontextmenu = function() {
                return !1;
            };
        } catch (t) {}
    }
    this.initializeKeyboardButton(), this.hideContextMenu(), this.addListener(this.reconnectBtn.firstChild, "click", function(t) {
        return function() {
            var e = t.reconnect();
            return t.input.focus(), e;
        };
    }(this)), this.addListener(this.input, "blur", function(t) {
        return function() {
            t.blurCursor();
        };
    }(this)), this.addListener(this.input, "focus", function(t) {
        return function() {
            t.focusCursor();
        };
    }(this)), this.addListener(this.input, "keydown", function(t) {
        return function(e) {
            return e || (e = window.event), t.keyDown(e);
        };
    }(this)), this.addListener(this.input, "keypress", function(t) {
        return function(e) {
            return e || (e = window.event), t.keyPressed(e);
        };
    }(this)), this.addListener(this.input, "keyup", function(t) {
        return function(e) {
            return e || (e = window.event), t.keyUp(e);
        };
    }(this));
    var c = function(t, e) {
        return function(s) {
            return s || (s = window.event), t.mouseEvent(s, e);
        };
    };
    this.addListener(this.scrollable, "mousedown", c(this, 0)), this.addListener(this.scrollable, "mouseup", c(this, 1)), 
    this.addListener(this.scrollable, "click", c(this, 2)), this.currentScreen = 0, 
    this.cursorX = 0, this.cursorY = 0, this.numScrollbackLines = 0, this.top = 0, this.bottom = 2147483647, 
    this.scale = 1, this.resizer(), this.focusCursor(), this.input.focus();
}, VT100.prototype.getChildById = function(t, e) {
    var s = t.all || t.getElementsByTagName("*");
    if (void 0 === s.namedItem) {
        for (var i = 0; i < s.length; i++) if (s[i].id == e) return s[i];
        return null;
    }
    var r = (t.all || t.getElementsByTagName("*")).namedItem(e);
    return r ? r[0] || r : null;
}, VT100.prototype.getCurrentComputedStyle = function(t, e) {
    return void 0 !== t.currentStyle ? t.currentStyle[e] : document.defaultView.getComputedStyle(t, null)[e];
}, VT100.prototype.reconnect = function() {
    return !1;
}, VT100.prototype.showReconnect = function(t) {
    t ? (this.hideSoftKeyboard(), this.reconnectBtn.style.visibility = "") : this.reconnectBtn.style.visibility = "hidden";
}, VT100.prototype.repairElements = function(t) {
    for (var e = t.firstChild; e; e = e.nextSibling) if (!e.clientHeight) {
        var s = document.createElement(e.tagName);
        if (s.style.cssText = e.style.cssText, s.className = e.className, "DIV" == e.tagName) for (var i = e.firstChild; i; i = i.nextSibling) {
            var r = document.createElement(i.tagName);
            r.style.cssText = i.style.cssText, r.className = i.className, this.setTextContent(r, this.getTextContent(i)), 
            s.appendChild(r);
        } else this.setTextContent(s, this.getTextContent(e));
        e.parentNode.replaceChild(s, e), e = s;
    }
}, VT100.prototype.resized = function(t, e) {}, VT100.prototype.resizer = function() {
    this.hideSoftKeyboard();
    var t = document.createElement("pre");
    if (this.setTextContent(t, " "), t.id = "cursor", t.style.cssText = this.cursor.style.cssText, 
    this.cursor.parentNode.insertBefore(t, this.cursor), !t.clientHeight) return void t.parentNode.removeChild(t);
    this.cursor.parentNode.removeChild(this.cursor), this.cursor = t, this.repairElements(this.console[0]), 
    this.repairElements(this.console[1]), this.cursorWidth > 0 && (this.cursor.style.width = this.cursorWidth + "px"), 
    this.cursorHeight > 0 && (this.cursor.style.height = this.cursorHeight + "px");
    var e = this.console[this.currentScreen], s = (this.isEmbedded ? this.container.clientHeight : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 1;
    null != navigator.userAgent.match(/iPad|iPhone|iPod/i) && (s -= 1);
    var i = s % this.cursorHeight;
    this.scrollable.style.height = (s > 0 ? s : 0) + "px", this.padding.style.height = (i > 0 ? i : 0) + "px";
    var r = this.terminalHeight;
    this.updateWidth(), this.updateHeight();
    var n = this.cursorX, h = this.cursorY + this.numScrollbackLines;
    for (this.updateNumScrollbackLines(); this.currentScreen && this.numScrollbackLines > 0; ) e.removeChild(e.firstChild), 
    this.numScrollbackLines--;
    h -= this.numScrollbackLines, n < 0 ? n = 0 : n > this.terminalWidth && (n = this.terminalWidth - 1) < 0 && (n = 0), 
    h < 0 ? h = 0 : h > this.terminalHeight && (h = this.terminalHeight - 1) < 0 && (h = 0), 
    (this.bottom > this.terminalHeight || this.bottom == r) && (this.bottom = this.terminalHeight), 
    this.top >= this.bottom && (this.top = this.bottom - 1, this.top < 0 && (this.top = 0)), 
    this.truncateLines(this.terminalWidth), this.putString(n, h, "", void 0), this.scrollable.scrollTop = this.numScrollbackLines * this.cursorHeight + 1;
    for (var o = e.firstChild, a = 0; a < this.numScrollbackLines; a++) o.className = "scrollback", 
    o = o.nextSibling;
    for (;o; ) o.className = "", o = o.nextSibling;
    this.reconnectBtn.style.left = (this.terminalWidth * this.cursorWidth / this.scale - this.reconnectBtn.clientWidth) / 2 + "px", 
    this.reconnectBtn.style.top = (this.terminalHeight * this.cursorHeight - this.reconnectBtn.clientHeight) / 2 + "px", 
    this.resized(this.terminalWidth, this.terminalHeight);
}, VT100.prototype.showCurrentSize = function() {
    this.indicateSize && (this.curSizeBox.innerHTML = this.terminalWidth + "x" + this.terminalHeight, 
    this.curSizeBox.style.left = (this.terminalWidth * this.cursorWidth / this.scale - this.curSizeBox.clientWidth) / 2 + "px", 
    this.curSizeBox.style.top = (this.terminalHeight * this.cursorHeight - this.curSizeBox.clientHeight) / 2 + "px", 
    this.curSizeBox.style.visibility = "", this.curSizeTimeout && clearTimeout(this.curSizeTimeout), 
    this.curSizeTimeout = setTimeout(function(t) {
        return function() {
            t.curSizeTimeout = null, t.curSizeBox.style.visibility = "hidden";
        };
    }(this), 1e3));
}, VT100.prototype.selection = function() {
    try {
        return "" + (window.getSelection && window.getSelection() || document.selection && "Text" == document.selection.type && document.selection.createRange().text || "");
    } catch (t) {}
    return "";
}, VT100.prototype.cancelEvent = function(t) {
    try {
        t.stopPropagation(), t.preventDefault();
    } catch (t) {}
    try {
        t.cancelBubble = !0, t.returnValue = !1, t.button = 0, t.keyCode = 0;
    } catch (t) {}
    return !1;
}, VT100.prototype.mousePosition = function(t) {
    for (var e = this.container.offsetLeft, s = this.container.offsetTop, i = this.container; i = i.offsetParent; ) e += i.offsetLeft, 
    s += i.offsetTop;
    return [ t.clientX - e, t.clientY - s ];
}, VT100.prototype.mouseEvent = function(t, e) {
    var s = this.selection();
    1 != e && 2 != e || s.length || this.input.focus();
    var i = this.mousePosition(t), r = Math.floor(i[0] / this.cursorWidth), n = Math.floor((i[1] + this.scrollable.scrollTop) / this.cursorHeight) - this.numScrollbackLines, h = !0;
    r >= this.terminalWidth && (r = this.terminalWidth - 1, h = !1), r < 0 && (r = 0, 
    h = !1), n >= this.terminalHeight && (n = this.terminalHeight - 1, h = !1), n < 0 && (n = 0, 
    h = !1);
    var o = 0 != e ? 3 : void 0 !== t.pageX ? t.button : [ void 0, 0, 2, 0, 1, 0, 1, 0 ][t.button];
    if (void 0 != o && (t.shiftKey && (o |= 4), (t.altKey || t.metaKey) && (o |= 8), 
    t.ctrlKey && (o |= 16)), this.mouseReporting && !s.length && (0 != e || !t.shiftKey) && (h || 0 != e) && void 0 != o) {
        var a = "[M" + String.fromCharCode(o + 32) + String.fromCharCode(r + 33) + String.fromCharCode(n + 33);
        return 2 != e && this.keysPressed(a), this.cancelEvent(t);
    }
    if (2 == o && !t.shiftKey) return 0 == e && this.showContextMenu(i[0], i[1]), this.cancelEvent(t);
    if (2 == (t.which || t.button) && s.length && (1 == e && setTimeout(function(t) {
        return function() {
            t.keysPressed(s), t.input.focus();
        };
    }(this), 10), 0 == e)) return this.cancelEvent(t);
    if (this.mouseReporting) try {
        t.shiftKey = !1;
    } catch (t) {}
    return !0;
}, VT100.prototype.replaceChar = function(t, e, s) {
    for (var i = -1; !((i = t.indexOf(e, i + 1)) < 0); ) t = t.substr(0, i) + s + t.substr(i + 1);
    return t;
}, VT100.prototype.htmlEscape = function(t) {
    return this.replaceChar(this.replaceChar(this.replaceChar(this.replaceChar(t, "&", "&amp;"), "<", "&lt;"), '"', "&quot;"), " ", " ");
}, VT100.prototype.getTextContent = function(t) {
    return t.textContent || (void 0 === t.textContent ? t.innerText : "");
}, VT100.prototype.setTextContentRaw = function(t, e) {
    if (void 0 === t.textContent) {
        if (t.innerText != e) try {
            t.innerText = e;
        } catch (s) {
            t.innerHTML = "", t.appendChild(document.createTextNode(this.replaceChar(e, " ", " ")));
        }
    } else t.textContent != e && (t.textContent = e);
}, VT100.prototype.setTextContent = function(t, e) {
    if (this.urlRE && this.urlRE.test(e)) {
        for (var s = ""; ;) {
            var i = 0;
            null != RegExp.leftContext && (s += this.htmlEscape(RegExp.leftContext), i += RegExp.leftContext.length);
            var r = this.htmlEscape(RegExp.lastMatch), n = r;
            if (r.indexOf("http://") < 0 && r.indexOf("https://") < 0 && r.indexOf("ftp://") < 0 && r.indexOf("mailto:") < 0) {
                var h = r.indexOf("/"), o = r.indexOf("@"), a = r.indexOf("?");
                n = o > 0 && (o < a || a < 0) && (h < 0 || a > 0 && h > a) ? "mailto:" + r : (0 == r.indexOf("ftp.") ? "ftp://" : "http://") + r;
            }
            if (s += '<a target="vt100Link" href="' + n + '">' + r + "</a>", i += RegExp.lastMatch.length, 
            e = e.substr(i), !this.urlRE.test(e)) {
                null != RegExp.rightContext && (s += this.htmlEscape(RegExp.rightContext));
                break;
            }
        }
        return void (t.innerHTML = s);
    }
    this.setTextContentRaw(t, e);
}, VT100.prototype.insertBlankLine = function(t, e, s) {
    e || (e = "ansiDef bgAnsiDef"), s || (s = "");
    var i;
    if ("ansiDef bgAnsiDef" == e || s) {
        i = document.createElement("div");
        var r = document.createElement("span");
        r.style.cssText = s, r.className = e, this.setTextContent(r, this.spaces(this.terminalWidth)), 
        i.appendChild(r);
    } else i = document.createElement("pre"), this.setTextContent(i, "\n");
    i.style.height = this.cursorHeight + "px";
    var n = this.console[this.currentScreen];
    n.childNodes.length > t ? n.insertBefore(i, n.childNodes[t]) : n.appendChild(i);
}, VT100.prototype.updateWidth = function() {
    return this.cursorWidth <= 0 ? this.cursor.clientWidth <= 0 ? this.terminalWidth = 80 : (this.cursorWidth = this.cursor.clientWidth, 
    this.terminalWidth = Math.floor(this.console[this.currentScreen].offsetWidth / this.cursorWidth * this.scale)) : "ActiveXObject" in window ? this.terminalWidth = Math.floor(this.console[this.currentScreen].offsetWidth / this.cursorWidth * this.scale * .95) : this.terminalWidth = Math.floor(this.console[this.currentScreen].offsetWidth / this.cursorWidth * this.scale), 
    this.terminalWidth;
}, VT100.prototype.updateHeight = function() {
    return this.isEmbedded ? this.terminalHeight = Math.floor((this.container.clientHeight - 1) / this.cursorHeight) : this.terminalHeight = Math.floor(((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 1) / this.cursorHeight), 
    this.terminalHeight;
}, VT100.prototype.updateNumScrollbackLines = function() {
    var t = Math.floor(this.console[this.currentScreen].offsetHeight / this.cursorHeight) - this.terminalHeight;
    return this.numScrollbackLines = t < 0 ? 0 : t, this.numScrollbackLines;
}, VT100.prototype.truncateLines = function(t) {
    t < 0 && (t = 0);
    for (var e = this.console[this.currentScreen].firstChild; e; e = e.nextSibling) if ("DIV" == e.tagName) {
        for (var s = 0, i = e.firstChild; i; i = i.nextSibling) {
            var r = this.getTextContent(i), n = r.length;
            if (s + n > t) {
                for (this.setTextContent(i, r.substr(0, t - s)); i.nextSibling; ) e.removeChild(e.lastChild);
                break;
            }
            s += n;
        }
        for (var i = e.lastChild; i && "ansiDef bgAnsiDef" == i.className && !i.style.cssText.length; ) {
            for (var r = this.getTextContent(i), h = r.length; h--; ) if (" " != r.charAt(h) && " " != r.charAt(h)) {
                h + 1 != r.length && this.setTextContent(r.substr(0, h + 1)), i = null;
                break;
            }
            if (i) {
                var o = i;
                if (i = i.previousSibling) e.removeChild(o); else {
                    var a = document.createElement("pre");
                    a.style.height = this.cursorHeight + "px", this.setTextContent(a, "\n"), e.parentNode.replaceChild(a, e);
                }
            }
        }
    }
}, VT100.prototype.putString = function(t, e, s, i, r) {
    i || (i = "ansiDef bgAnsiDef"), r || (r = "");
    var n, h, o, a, c = e + this.numScrollbackLines, l = 0, d = this.console[this.currentScreen];
    if (!s.length && (c >= d.childNodes.length || "DIV" != d.childNodes[c].tagName)) a = null; else {
        for (;d.childNodes.length <= c; ) this.insertBlankLine(c);
        if (n = d.childNodes[c], "DIV" != n.tagName) {
            var u = document.createElement("div");
            u.style.height = this.cursorHeight + "px", u.innerHTML = "<span></span>", d.replaceChild(u, n), 
            n = u;
        }
        a = n.firstChild;
        for (var p; a.nextSibling && l < t && (p = this.getTextContent(a).length, !(l + p > t)); ) l += p, 
        a = a.nextSibling;
        if (s.length) {
            o = this.getTextContent(a);
            var f = a.className, y = a.style.cssText;
            if (l + o.length < t) {
                "ansiDef bgAnsiDef" == f && "" == y || (a = document.createElement("span"), n.appendChild(a), 
                a.className = "ansiDef bgAnsiDef", a.style.cssText = "", f = "ansiDef bgAnsiDef", 
                y = "", l += o.length, o = "");
                do {
                    o += " ";
                } while (l + o.length < t);
            }
            var g = s.length - o.length + t - l;
            if (f != i || y != r && (y || r)) {
                if (l == t) s.length >= o.length ? o = s : (h = document.createElement("span"), 
                n.insertBefore(h, a), this.setTextContent(a, o.substr(s.length)), a = h, o = s); else {
                    var b = o.substr(t + s.length - l);
                    this.setTextContent(a, o.substr(0, t - l)), l = t, h = document.createElement("span"), 
                    a.nextSibling ? (n.insertBefore(h, a.nextSibling), a = h, b.length && (h = document.createElement("span"), 
                    h.className = f, h.style.cssText = y, this.setTextContent(h, b), n.insertBefore(h, a.nextSibling))) : (n.appendChild(h), 
                    a = h, b.length && (h = document.createElement("span"), h.className = f, h.style.cssText = y, 
                    this.setTextContent(h, b), n.appendChild(h))), o = s;
                }
                a.className = i, a.style.cssText = r;
            } else o = o.substr(0, t - l) + s + o.substr(t + s.length - l);
            for (this.setTextContent(a, o), h = a.nextSibling; g > 0 && h; ) {
                if (o = this.getTextContent(h), !((p = o.length) <= g)) {
                    this.setTextContent(h, o.substr(g));
                    break;
                }
                n.removeChild(h), g -= p, h = a.nextSibling;
            }
            h && a.className == h.className && a.style.cssText == h.style.cssText && (this.setTextContent(a, this.getTextContent(a) + this.getTextContent(h)), 
            n.removeChild(h));
        }
    }
    this.cursorX = t + s.length, this.cursorX >= this.terminalWidth && (this.cursorX = this.terminalWidth - 1, 
    this.cursorX < 0 && (this.cursorX = 0));
    var m = -1, k = -1;
    if (!this.cursor.style.visibility) {
        var v = this.cursorX - l;
        if (a) {
            k = a.offsetTop + a.offsetParent.offsetTop, o = this.getTextContent(a);
            var C = v - o.length;
            C < 0 ? (this.setTextContent(this.cursor, o.charAt(v)), m = a.offsetLeft + v * a.offsetWidth / o.length) : (0 == C && (m = a.offsetLeft + a.offsetWidth), 
            a.nextSibling ? (o = this.getTextContent(a.nextSibling), this.setTextContent(this.cursor, o.charAt(C)), 
            m < 0 && (m = a.nextSibling.offsetLeft + C * a.offsetWidth / o.length)) : this.setTextContent(this.cursor, " "));
        } else this.setTextContent(this.cursor, " ");
    }
    if (m >= 0 ? this.cursor.style.left = (m + (this.isIE ? 1 : 0)) / this.scale + "px" : (this.setTextContent(this.space, this.spaces(this.cursorX)), 
    this.cursor.style.left = (this.space.offsetWidth + d.offsetLeft) / this.scale + "px"), 
    this.cursorY = c - this.numScrollbackLines, this.cursor.style.top = k >= 0 ? k + "px" : c * this.cursorHeight + d.offsetTop + "px", 
    s.length) for ((h = a.previousSibling) && a.className == h.className && a.style.cssText == h.style.cssText && (this.setTextContent(a, this.getTextContent(h) + this.getTextContent(a)), 
    n.removeChild(h)), a = n.lastChild; a && "ansiDef bgAnsiDef" == a.className && !a.style.cssText.length; ) {
        o = this.getTextContent(a);
        for (var S = o.length; S--; ) if (" " != o.charAt(S) && " " != o.charAt(S)) {
            S + 1 != o.length && this.setTextContent(o.substr(0, S + 1)), a = null;
            break;
        }
        if (a) if (h = a, a = a.previousSibling) n.removeChild(h); else {
            var T = document.createElement("pre");
            T.style.height = this.cursorHeight + "px", this.setTextContent(T, "\n"), n.parentNode.replaceChild(T, n);
        }
    }
}, VT100.prototype.gotoXY = function(t, e) {
    t >= this.terminalWidth && (t = this.terminalWidth - 1), t < 0 && (t = 0);
    var s, i;
    this.offsetMode ? (s = this.top, i = this.bottom) : (s = 0, i = this.terminalHeight), 
    e >= i && (e = i - 1), e < s && (e = s), this.putString(t, e, "", void 0), this.needWrap = !1;
}, VT100.prototype.gotoXaY = function(t, e) {
    this.gotoXY(t, this.offsetMode ? this.top + e : e);
}, VT100.prototype.refreshInvertedState = function() {
    this.isInverted ? this.scrollable.className += " inverted" : this.scrollable.className = this.scrollable.className.replace(/ *inverted/, "");
}, VT100.prototype.enableAlternateScreen = function(t) {
    if ((t ? 1 : 0) == this.currentScreen) return void this.resizer();
    t && this.saveCursor(), this.currentScreen = t ? 1 : 0, this.console[1 - this.currentScreen].style.display = "none", 
    this.console[this.currentScreen].style.display = "";
    var e = this.getTransformName();
    if (e) {
        t && (this.console[1].style[e] = "");
        var s = this.console[this.currentScreen].style[e];
        this.cursor.style[e] = s, this.space.style[e] = s, this.scale = "" == s ? 1 : 1.65, 
        "filter" == e && (this.console[this.currentScreen].style.width = "" == s ? "165%" : "");
    }
    this.resizer(), t ? (this.gotoXY(0, 0), this.clearRegion(0, 0, this.terminalWidth, this.terminalHeight)) : this.restoreCursor();
}, VT100.prototype.hideCursor = function() {
    return !("hidden" == this.cursor.style.visibility || (this.cursor.style.visibility = "hidden", 
    0));
}, VT100.prototype.showCursor = function(t, e) {
    return !!this.cursor.style.visibility && (this.cursor.style.visibility = "", this.putString(void 0 == t ? this.cursorX : t, void 0 == e ? this.cursorY : e, "", void 0), 
    !0);
}, VT100.prototype.scrollBack = function() {
    var t = this.scrollable.scrollTop - this.scrollable.clientHeight;
    this.scrollable.scrollTop = t < 0 ? 0 : t;
}, VT100.prototype.scrollFore = function() {
    var t = this.scrollable.scrollTop + this.scrollable.clientHeight;
    this.scrollable.scrollTop = t > this.numScrollbackLines * this.cursorHeight + 1 ? this.numScrollbackLines * this.cursorHeight + 1 : t;
}, VT100.prototype.spaces = function(t) {
    for (var e = ""; t-- > 0; ) e += " ";
    return e;
}, VT100.prototype.clearRegion = function(t, e, s, i, r, n) {
    if (s += t, t < 0 && (t = 0), s > this.terminalWidth && (s = this.terminalWidth), 
    !((s -= t) <= 0 || (i += e, e < 0 && (e = 0), i > this.terminalHeight && (i = this.terminalHeight), 
    (i -= e) <= 0))) if (this.numScrollbackLines || s != this.terminalWidth || i != this.terminalHeight || void 0 != r && "ansiDef bgAnsiDef" != r || n) {
        for (var h = this.hideCursor(), o = this.cursorX, a = this.cursorY, c = this.spaces(s), l = e + i; l-- > e; ) this.putString(t, l, c, r, n);
        h ? this.showCursor(o, a) : this.putString(o, a, "", void 0);
    } else {
        for (var d = this.console[this.currentScreen]; d.lastChild; ) d.removeChild(d.lastChild);
        this.putString(this.cursorX, this.cursorY, "", void 0);
    }
}, VT100.prototype.copyLineSegment = function(t, e, s, i, r) {
    var n = [], h = [], o = [], a = this.console[this.currentScreen];
    if (i >= a.childNodes.length) n[0] = this.spaces(r), h[0] = void 0, o[0] = void 0; else {
        var c = a.childNodes[i];
        if ("DIV" == c.tagName && c.childNodes.length) {
            for (var l = 0, d = c.firstChild; d && r > 0; d = d.nextSibling) {
                var u = this.getTextContent(d), p = u.length;
                if (l + p > s) {
                    var f = s > l ? s - l : 0;
                    n[n.length] = u.substr(f, r), h[h.length] = d.className, o[o.length] = d.style.cssText, 
                    r -= p - f;
                }
                l += p;
            }
            r > 0 && (n[n.length] = this.spaces(r), h[h.length] = void 0, o[o.length] = void 0);
        } else n[0] = this.spaces(r), h[0] = void 0, o[0] = void 0;
    }
    for (var y = this.hideCursor(), g = this.cursorX, b = this.cursorY, m = 0; m < n.length; m++) {
        var k;
        k = h[m] ? h[m] : "ansiDef bgAnsiDef", this.putString(t, e - this.numScrollbackLines, n[m], k, o[m]), 
        t += n[m].length;
    }
    y ? this.showCursor(g, b) : this.putString(g, b, "", void 0);
}, VT100.prototype.scrollRegion = function(t, e, s, i, r, n, h, o) {
    var a = r < 0 ? -r : 0, c = r > 0 ? r : 0, l = n < 0 ? -n : 0, d = n > 0 ? n : 0, u = null;
    if (s += t, t < a && (t = a), s > this.terminalWidth - c && (s = this.terminalWidth - c), 
    (s -= t) <= 0 && (u = 1), i += e, e < l && (e = l), i > this.terminalHeight - d && (i = this.terminalHeight - d), 
    (i -= e) < 0 && (u = 1), !u) {
        o && o.indexOf("underline") && (o = o.replace(/text-decoration:underline;/, ""));
        var p = this.numScrollbackLines - (this.scrollable.scrollTop - 1) / this.cursorHeight, f = this.hideCursor(), y = this.cursorX, g = this.cursorY, b = this.console[this.currentScreen];
        if (r || t || s != this.terminalWidth) {
            if (n <= 0) for (var m = e + this.numScrollbackLines; m < e + this.numScrollbackLines + i; m++) this.copyLineSegment(t + r, m + n, t, m, s); else for (var m = e + this.numScrollbackLines + i; m-- > e + this.numScrollbackLines; ) this.copyLineSegment(t + r, m + n, t, m, s);
            r > 0 ? this.clearRegion(t, e, r, i, h, o) : r < 0 && this.clearRegion(t + s + r, e, -r, i, h, o), 
            n > 0 ? this.clearRegion(t, e, s, n, h, o) : n < 0 && this.clearRegion(t, e + i + n, s, -n, h, o);
        } else if (n < 0) if (this.currentScreen || e != -n || i != this.terminalHeight + n) {
            for (var m = -n; m-- > 0 && b.childNodes.length > this.numScrollbackLines + e + n; ) b.removeChild(b.childNodes[this.numScrollbackLines + e + n]);
            if (this.numScrollbackLines > 0 || b.childNodes.length > this.numScrollbackLines + e + i + n) for (var m = -n; m-- > 0; ) this.insertBlankLine(this.numScrollbackLines + e + i + n, h, o);
        } else {
            for (;b.childNodes.length < this.terminalHeight; ) this.insertBlankLine(this.terminalHeight);
            for (var m = 0; m < e; m++) this.insertBlankLine(b.childNodes.length, h, o);
            for (this.updateNumScrollbackLines(); this.numScrollbackLines > (this.currentScreen ? 0 : this.maxScrollbackLines); ) b.removeChild(b.firstChild), 
            this.numScrollbackLines--;
            for (var m = this.numScrollbackLines, k = -n; m-- > 0 && k-- > 0; ) b.childNodes[m].className = "scrollback";
        } else {
            for (var m = n; m-- > 0 && b.childNodes.length > this.numScrollbackLines + e + i; ) b.removeChild(b.childNodes[this.numScrollbackLines + e + i]);
            for (var m = n; m--; ) this.insertBlankLine(this.numScrollbackLines + e, h, o);
        }
        this.scrollable.scrollTop = (this.numScrollbackLines - p) * this.cursorHeight + 1, 
        f ? this.showCursor(y, g) : this.putString(y, g, "", void 0);
    }
}, VT100.prototype.copy = function(t) {
    if (void 0 == t && (t = this.selection()), this.internalClipboard = void 0, t.length) {
        try {
            this.cliphelper.value = t, this.cliphelper.select(), this.cliphelper.createTextRange().execCommand("copy");
        } catch (e) {
            this.internalClipboard = t;
        }
        this.cliphelper.value = "";
    }
}, VT100.prototype.copyLast = function() {
    this.copy(this.lastSelection);
}, VT100.prototype.pasteFnc = function() {
    var t = void 0;
    if (void 0 != this.internalClipboard) t = this.internalClipboard; else try {
        this.cliphelper.value = "", this.cliphelper.createTextRange().execCommand("paste"), 
        t = this.cliphelper.value;
    } catch (t) {}
    return this.cliphelper.value = "", t && "hidden" == this.menu.style.visibility ? function() {
        this.keysPressed("" + t);
    } : void 0;
}, VT100.prototype.pasteBrowserFnc = function() {
    var t = prompt("Paste into this box:", "");
    if (void 0 != t) return this.keysPressed("" + t);
}, VT100.prototype.toggleUTF = function() {
    this.utfEnabled = !this.utfEnabled, this.utfPreferred = this.utfEnabled;
}, VT100.prototype.toggleBell = function() {
    this.visualBell = !this.visualBell;
}, VT100.prototype.toggleSoftKeyboard = function() {
    this.softKeyboard = !this.softKeyboard, this.keyboardImage.style.visibility = this.softKeyboard ? "visible" : "";
}, VT100.prototype.toggleDisableAlt = function() {
    this.disableAlt = !this.disableAlt;
}, VT100.prototype.deselectKeys = function(t) {
    for (t && "selected" == t.className && (t.className = ""), t = t.firstChild; t; t = t.nextSibling) this.deselectKeys(t);
}, VT100.prototype.showSoftKeyboard = function() {
    this.lastSelectedKey = void 0, this.deselectKeys(this.keyboard), this.isShift = !1, 
    this.showShiftState(!1), this.isCtrl = !1, this.showCtrlState(!1), this.isAlt = !1, 
    this.showAltState(!1), this.keyboard.style.left = "0px", this.keyboard.style.top = "0px", 
    this.keyboard.style.width = this.container.offsetWidth + "px", this.keyboard.style.height = this.container.offsetHeight + "px", 
    this.keyboard.style.visibility = "hidden", this.keyboard.style.display = "";
    var t = this.keyboard.firstChild, e = 1, s = this.getTransformName();
    if (s) {
        t.style[s] = "", t.offsetWidth > .9 * this.container.offsetWidth && (e = t.offsetWidth / this.container.offsetWidth / .9), 
        t.offsetHeight > .9 * this.container.offsetHeight && (e = Math.max(t.offsetHeight / this.container.offsetHeight / .9));
        var i = this.getTransformStyle(s, e > 1 ? e : void 0);
        t.style[s] = i;
    }
    "filter" == s && (e = 1), t.style.left = (this.container.offsetWidth - t.offsetWidth / e) / 2 + "px", 
    t.style.top = (this.container.offsetHeight - t.offsetHeight / e) / 2 + "px", this.keyboard.style.visibility = "visible";
}, VT100.prototype.hideSoftKeyboard = function() {
    this.keyboard.style.display = "none";
}, VT100.prototype.toggleCursorBlinking = function() {
    this.blinkingCursor = !this.blinkingCursor;
}, VT100.prototype.about = function() {
    alert("VT100 Terminal Emulator 2.20 \nCopyright 2008-2010 by Markus Gutschke\nFor more information check http://shellinabox.com");
}, VT100.prototype.hideContextMenu = function() {
    this.menu.style.visibility = "hidden", this.menu.style.top = "-100px", this.menu.style.left = "-100px", 
    this.menu.style.width = "0px", this.menu.style.height = "0px";
}, VT100.prototype.extendContextMenu = function(t, e) {}, VT100.prototype.showContextMenu = function(t, e) {
    this.menu.innerHTML = '<table class="popup" cellpadding="0" cellspacing="0"><tr><td><ul id="menuentries"><li id="beginclipboard">Copy</li><li id="endclipboard">Paste</li><li id="browserclipboard">Paste from browser</li><hr /><li id="reset">Reset</li>';
    var s = this.menu.firstChild, i = this.getChildById(s, "menuentries");
    this.lastSelection = this.selection(), this.lastSelection.length || (i.firstChild.className = "disabled");
    var r = this.pasteFnc();
    r || (i.childNodes[1].className = "disabled");
    for (var n = [ this.copyLast, r, this.pasteBrowserFnc, this.reset, this.toggleUTF, this.toggleBell, this.toggleSoftKeyboard, this.toggleDisableAlt, this.toggleCursorBlinking ], h = 0; h < this.usercssActions.length; ++h) n[n.length] = this.usercssActions[h];
    n[n.length] = this.about, this.extendContextMenu(i, n);
    for (var o = i.firstChild, h = 0; o; o = o.nextSibling) "LI" == o.tagName && ("disabled" != o.className && (this.addListener(o, "mouseover", function(t, e) {
        return function() {
            e.className = "hover";
        };
    }(0, o)), this.addListener(o, "mouseout", function(t, e) {
        return function() {
            e.className = "";
        };
    }(0, o)), this.addListener(o, "mousedown", function(t, e) {
        return function(s) {
            return t.hideContextMenu(), e.call(t), t.storeUserSettings(), t.cancelEvent(s || window.event);
        };
    }(this, n[h])), this.addListener(o, "mouseup", function(t) {
        return function(e) {
            return t.cancelEvent(e || window.event);
        };
    }(this)), this.addListener(o, "mouseclick", function(t) {
        return function(e) {
            return t.cancelEvent(e || window.event);
        };
    }())), h++);
    this.menu.style.left = "0px", this.menu.style.top = "0px", this.menu.style.width = this.container.offsetWidth + "px", 
    this.menu.style.height = this.container.offsetHeight + "px", s.style.left = "0px", 
    s.style.top = "0px";
    t + s.clientWidth >= this.container.offsetWidth - 2 && (t = this.container.offsetWidth - s.clientWidth - 2 - 1), 
    t < 2 && (t = 2), e + s.clientHeight >= this.container.offsetHeight - 2 && (e = this.container.offsetHeight - s.clientHeight - 2 - 1), 
    e < 2 && (e = 2), s.style.left = t + "px", s.style.top = e + "px", this.addListener(this.menu, "click", function(t) {
        return function() {
            t.hideContextMenu();
        };
    }(this)), this.menu.style.visibility = "";
}, VT100.prototype.keysPressed = function(t) {
    for (var e = 0; e < t.length; e++) {
        var s = t.charCodeAt(e);
        this.vt100(s >= 7 && s <= 15 || 24 == s || 26 == s || 27 == s || s >= 32 ? String.fromCharCode(s) : "<" + s + ">");
    }
}, VT100.prototype.applyModifiers = function(t, e) {
    if (t) {
        if (e.ctrlKey && t >= 32 && t <= 127) switch (t) {
          case 51:
            t = 27;
            break;

          case 52:
            t = 28;
            break;

          case 53:
            t = 29;
            break;

          case 54:
            t = 30;
            break;

          case 55:
            t = 31;
            break;

          case 56:
          case 63:
            t = 127;
            break;

          default:
            t &= 31;
        }
        return String.fromCharCode(t);
    }
}, VT100.prototype.handleKey = function(t) {
    var e, s;
    if (void 0 !== t.charCode ? (e = t.charCode, s = t.keyCode) : (e = t.keyCode, s = void 0), 
    e && (s = void 0), void 0 != (e = this.applyModifiers(e, t))) this.scrollable.scrollTop = this.numScrollbackLines * this.cursorHeight + 1; else {
        if (!t.altKey && !t.metaKey || t.shiftKey || t.ctrlKey) {
            if (t.shiftKey && !t.ctrlKey && !t.altKey && !t.metaKey) switch (s) {
              case 33:
                return void this.scrollBack();

              case 34:
                return void this.scrollFore();
            }
        } else switch (s) {
          case 33:
            e = "<";
            break;

          case 34:
            e = ">";
            break;

          case 37:
            e = "b";
            break;

          case 38:
            e = "p";
            break;

          case 39:
            e = "f";
            break;

          case 40:
            e = "n";
            break;

          case 46:
            e = "d";
        }
        if (void 0 == e) {
            switch (s) {
              case 8:
                e = "";
                break;

              case 9:
                e = "\t";
                break;

              case 10:
                e = "\n";
                break;

              case 13:
                e = this.crLfMode ? "\r\n" : "\r";
                break;

              case 16:
              case 17:
              case 18:
              case 19:
              case 20:
                return;

              case 27:
                e = "";
                break;

              case 33:
                e = "[5~";
                break;

              case 34:
                e = "[6~";
                break;

              case 35:
                e = "OF";
                break;

              case 36:
                e = "OH";
                break;

              case 37:
                e = this.cursorKeyMode ? "OD" : "[D";
                break;

              case 38:
                e = this.cursorKeyMode ? "OA" : "[A";
                break;

              case 39:
                e = this.cursorKeyMode ? "OC" : "[C";
                break;

              case 40:
                e = this.cursorKeyMode ? "OB" : "[B";
                break;

              case 45:
                e = "[2~";
                break;

              case 46:
                e = "[3~";
                break;

              case 91:
              case 92:
              case 93:
                return;

              case 96:
                e = this.applyModifiers(48, t);
                break;

              case 97:
                e = this.applyModifiers(49, t);
                break;

              case 98:
                e = this.applyModifiers(50, t);
                break;

              case 99:
                e = this.applyModifiers(51, t);
                break;

              case 100:
                e = this.applyModifiers(52, t);
                break;

              case 101:
                e = this.applyModifiers(53, t);
                break;

              case 102:
                e = this.applyModifiers(54, t);
                break;

              case 103:
                e = this.applyModifiers(55, t);
                break;

              case 104:
                e = this.applyModifiers(56, t);
                break;

              case 105:
                e = this.applyModifiers(58, t);
                break;

              case 106:
                e = this.applyModifiers(42, t);
                break;

              case 107:
                e = this.applyModifiers(43, t);
                break;

              case 109:
                e = this.applyModifiers(45, t);
                break;

              case 110:
                e = this.applyModifiers(46, t);
                break;

              case 111:
                e = this.applyModifiers(47, t);
                break;

              case 112:
                e = "OP";
                break;

              case 113:
                e = "OQ";
                break;

              case 114:
                e = "OR";
                break;

              case 115:
                e = "OS";
                break;

              case 116:
                e = "[15~";
                break;

              case 117:
                e = "[17~";
                break;

              case 118:
                e = "[18~";
                break;

              case 119:
                e = "[19~";
                break;

              case 120:
                e = "[20~";
                break;

              case 121:
                e = "[21~";
                break;

              case 122:
                e = "[23~";
                break;

              case 123:
                e = "[24~";
                break;

              case 144:
              case 145:
                return;

              case 186:
                e = this.applyModifiers(59, t);
                break;

              case 188:
                e = this.applyModifiers(44, t);
                break;

              case 189:
                e = this.applyModifiers(45, t);
                break;

              case 190:
                e = this.applyModifiers(46, t);
                break;

              case 191:
                e = this.applyModifiers(47, t);
                break;

              case 220:
                e = this.applyModifiers(92, t);
                break;

              case 222:
                e = this.applyModifiers(39, t);
                break;

              default:
                return;
            }
            this.scrollable.scrollTop = this.numScrollbackLines * this.cursorHeight + 1;
        }
    }
    if (t.shiftKey || t.ctrlKey || t.altKey || t.metaKey) {
        var i, r, n, h;
        if ("[" == (i = e.substr(0, 2))) {
            for (n = i; n.length < e.length && (r = e.charCodeAt(n.length)) >= 48 && r <= 57; ) n = e.substr(0, n.length + 1);
            h = e.substr(n.length), n.length > 2 && (n += ";");
        } else "O" == i && (n = i, h = e.substr(2));
        void 0 != n ? e = n + ((t.shiftKey ? 1 : 0) + (t.altKey | t.metaKey ? 2 : 0) + (t.ctrlKey ? 4 : 0) + 1) + h : 1 != e.length || !t.altKey && !t.metaKey || this.disableAlt || (e = "" + e);
    }
    "hidden" == this.menu.style.visibility && this.keysPressed(e);
}, VT100.prototype.inspect = function(t, e) {
    void 0 == e && (e = 0);
    var s = "";
    if ("object" == typeof t && ++e < 2) {
        s = "[\r\n";
        for (i in t) {
            s += this.spaces(2 * e) + i + " -> ";
            try {
                s += this.inspect(t[i], e);
            } catch (t) {
                s += "???\r\n";
            }
        }
        s += "]\r\n";
    } else s += ("" + t).replace(/\n/g, " ").replace(/ +/g, " ") + "\r\n";
    return s;
}, VT100.prototype.checkComposedKeys = function(t) {
    var e = this.input.value;
    e.length && (this.input.value = "", "hidden" == this.menu.style.visibility && this.keysPressed(e));
}, VT100.prototype.fixEvent = function(t) {
    if (t.ctrlKey && t.altKey) {
        var e = [];
        return e.charCode = t.charCode, e.keyCode = t.keyCode, e.ctrlKey = !1, e.shiftKey = t.shiftKey, 
        e.altKey = !1, e.metaKey = t.metaKey, e;
    }
    var s = void 0, i = void 0;
    if (t.shiftKey) switch (this.lastNormalKeyDownEvent.keyCode) {
      case 39:
        s = 39, i = 34;
        break;

      case 44:
        s = 44, i = 60;
        break;

      case 45:
        s = 45, i = 95;
        break;

      case 46:
        s = 46, i = 62;
        break;

      case 47:
        s = 47, i = 63;
        break;

      case 48:
        s = 48, i = 41;
        break;

      case 49:
        s = 49, i = 33;
        break;

      case 50:
        s = 50, i = 64;
        break;

      case 51:
        s = 51, i = 35;
        break;

      case 52:
        s = 52, i = 36;
        break;

      case 53:
        s = 53, i = 37;
        break;

      case 54:
        s = 54, i = 94;
        break;

      case 55:
        s = 55, i = 38;
        break;

      case 56:
        s = 56, i = 42;
        break;

      case 57:
        s = 57, i = 40;
        break;

      case 59:
        s = 59, i = 58;
        break;

      case 61:
        s = 61, i = 43;
        break;

      case 91:
        s = 91, i = 123;
        break;

      case 92:
        s = 92, i = 124;
        break;

      case 93:
        s = 93, i = 125;
        break;

      case 96:
        s = 96, i = 126;
        break;

      case 109:
        s = 45, i = 95;
        break;

      case 111:
        s = 47, i = 63;
        break;

      case 186:
        s = 59, i = 58;
        break;

      case 187:
        s = 61, i = 43;
        break;

      case 188:
        s = 44, i = 60;
        break;

      case 189:
        s = 45, i = 95;
        break;

      case 190:
        s = 46, i = 62;
        break;

      case 191:
        s = 47, i = 63;
        break;

      case 192:
        s = 96, i = 126;
        break;

      case 219:
        s = 91, i = 123;
        break;

      case 220:
        s = 92, i = 124;
        break;

      case 221:
        s = 93, i = 125;
        break;

      case 222:
        s = 39, i = 34;
    } else {
        var r = this.lastNormalKeyDownEvent.keyCode;
        r >= 65 && r <= 90 && (s = r, i = 32 | s);
    }
    if (i && (t.charCode == s || 0 == t.charCode)) {
        var e = [];
        return e.charCode = i, e.keyCode = t.keyCode, e.ctrlKey = t.ctrlKey, e.shiftKey = t.shiftKey, 
        e.altKey = t.altKey, e.metaKey = t.metaKey, e;
    }
    return t;
}, VT100.prototype.keyDown = function(t) {
    this.checkComposedKeys(t), this.lastKeyPressedEvent = void 0, this.lastKeyDownEvent = void 0, 
    this.lastNormalKeyDownEvent = t;
    var e = 32 == t.keyCode || t.keyCode >= 48 && t.keyCode <= 57 || t.keyCode >= 65 && t.keyCode <= 90, s = e || t.keyCode >= 58 && t.keyCode <= 64 || t.keyCode >= 96 && t.keyCode <= 105 || 107 == t.keyCode || t.keyCode >= 160 && t.keyCode <= 192 || t.keyCode >= 219 && t.keyCode <= 223 || 226 == t.keyCode, i = s || 106 == t.keyCode || t.keyCode >= 109 && t.keyCode <= 111 || 229 == t.keyCode || 252 == t.keyCode;
    try {
        "Konqueror" == navigator.appName && (i |= t.keyCode < 128);
    } catch (t) {}
    if (this.disableAlt && i) return !0;
    if ((t.charCode || t.keyCode) && (s && (t.ctrlKey || t.altKey || t.metaKey) && !t.shiftKey && (!t.ctrlKey || !t.altKey) || this.catchModifiersEarly && i && !s && (t.ctrlKey || t.altKey || t.metaKey) || !i)) {
        this.lastKeyDownEvent = t;
        var r = [];
        r.ctrlKey = t.ctrlKey, r.shiftKey = t.shiftKey, r.altKey = t.altKey, r.metaKey = t.metaKey, 
        e ? (r.charCode = t.keyCode, r.keyCode = 0) : (r.charCode = 0, r.keyCode = t.keyCode), 
        r = this.fixEvent(r), this.handleKey(r), this.lastNormalKeyDownEvent = void 0;
        try {
            t.stopPropagation(), t.preventDefault();
        } catch (t) {}
        try {
            t.cancelBubble = !0, t.returnValue = !1, t.keyCode = 0;
        } catch (t) {}
        return !1;
    }
    return !0;
}, VT100.prototype.keyPressed = function(t) {
    this.lastKeyDownEvent ? this.lastKeyDownEvent = void 0 : this.handleKey(t.altKey || t.metaKey ? this.fixEvent(t) : t);
    try {
        t.preventDefault();
    } catch (t) {}
    try {
        t.cancelBubble = !0, t.returnValue = !1, t.keyCode = 0;
    } catch (t) {}
    return this.lastNormalKeyDownEvent = void 0, this.lastKeyPressedEvent = t, !1;
}, VT100.prototype.keyUp = function(t) {
    if (this.lastKeyPressedEvent) (t.target || t.srcElement).value = ""; else if (this.checkComposedKeys(t), 
    this.lastNormalKeyDownEvent) {
        this.catchModifiersEarly = !0;
        var e = 32 == t.keyCode || t.keyCode >= 48 && t.keyCode <= 49 || t.keyCode >= 51 && t.keyCode <= 57 || t.keyCode >= 65 && t.keyCode <= 90, s = e || 50 == t.keyCode || t.keyCode >= 96 && t.keyCode <= 105, i = (s || 59 == t.keyCode || 61 == t.keyCode || 106 == t.keyCode || 107 == t.keyCode || t.keyCode >= 109 && t.keyCode <= 111 || t.keyCode >= 186 && t.keyCode <= 192 || t.keyCode >= 219 && t.keyCode <= 223 || t.keyCode, 
        []);
        i.ctrlKey = t.ctrlKey, i.shiftKey = t.shiftKey, i.altKey = t.altKey, i.metaKey = t.metaKey, 
        e ? (i.charCode = t.keyCode, i.keyCode = 0) : (i.charCode = 0, i.keyCode = t.keyCode), 
        (t.ctrlKey || t.altKey || t.metaKey) && (i = this.fixEvent(i)), this.lastNormalKeyDownEvent = void 0, 
        this.handleKey(i);
    }
    try {
        t.cancelBubble = !0, t.returnValue = !1, t.keyCode = 0;
    } catch (t) {}
    return this.lastKeyDownEvent = void 0, this.lastKeyPressedEvent = void 0, !1;
}, VT100.prototype.animateCursor = function(t) {
    this.cursorInterval || (this.cursorInterval = setInterval(function(t) {
        return function() {
            t.animateCursor(), t.checkComposedKeys();
        };
    }(this), 500)), void 0 == t && "inactive" == this.cursor.className || (t ? this.cursor.className = "inactive" : this.blinkingCursor ? this.cursor.className = "bright" == this.cursor.className ? "dim" : "bright" : this.cursor.className = "bright");
}, VT100.prototype.blurCursor = function() {
    this.animateCursor(!0);
}, VT100.prototype.focusCursor = function() {
    this.animateCursor(!1);
}, VT100.prototype.flashScreen = function() {
    this.isInverted = !this.isInverted, this.refreshInvertedState(), this.isInverted = !this.isInverted, 
    setTimeout(function(t) {
        return function() {
            t.refreshInvertedState();
        };
    }(this), 100);
}, VT100.prototype.beep = function() {
    if (this.visualBell) this.flashScreen(); else try {
        this.beeper.Play();
    } catch (t) {
        try {
            this.beeper.src = "beep.wav";
        } catch (t) {}
    }
}, VT100.prototype.bs = function() {
    this.cursorX > 0 && (this.gotoXY(this.cursorX - 1, this.cursorY), this.needWrap = !1);
}, VT100.prototype.ht = function(t) {
    void 0 == t && (t = 1);
    for (var e = this.cursorX; t-- > 0; ) for (;e++ < this.terminalWidth; ) {
        var s = this.userTabStop[e];
        if (0 != s) {
            if (s) break;
            if (e % 8 == 0) break;
        }
    }
    e > this.terminalWidth - 1 && (e = this.terminalWidth - 1), e != this.cursorX && this.gotoXY(e, this.cursorY);
}, VT100.prototype.rt = function(t) {
    void 0 == t && (t = 1);
    for (var e = this.cursorX; t-- > 0; ) for (;e-- > 0; ) {
        var s = this.userTabStop[e];
        if (0 != s) {
            if (s) break;
            if (e % 8 == 0) break;
        }
    }
    e < 0 && (e = 0), e != this.cursorX && this.gotoXY(e, this.cursorY);
}, VT100.prototype.cr = function() {
    this.gotoXY(0, this.cursorY), this.needWrap = !1;
}, VT100.prototype.lf = function(t) {
    for (void 0 == t ? t = 1 : (t > this.terminalHeight && (t = this.terminalHeight), 
    t < 1 && (t = 1)); t-- > 0; ) this.cursorY == this.bottom - 1 ? this.scrollRegion(0, this.top + 1, this.terminalWidth, this.bottom - this.top - 1, 0, -1, this.color, this.style) : this.cursorY < this.terminalHeight - 1 && this.gotoXY(this.cursorX, this.cursorY + 1);
}, VT100.prototype.ri = function(t) {
    for (void 0 == t ? t = 1 : (t > this.terminalHeight && (t = this.terminalHeight), 
    t < 1 && (t = 1)); t-- > 0; ) this.cursorY == this.top ? this.scrollRegion(0, this.top, this.terminalWidth, this.bottom - this.top - 1, 0, 1, this.color, this.style) : this.cursorY > 0 && this.gotoXY(this.cursorX, this.cursorY - 1);
    this.needWrap = !1;
}, VT100.prototype.respondID = function() {
    this.respondString += "[?6c";
}, VT100.prototype.respondSecondaryDA = function() {
    this.respondString += "[>0;0;0c";
}, VT100.prototype.updateStyle = function() {
    var t = "", e = "";
    if (this.style = "", 512 & this.attr && (this.style += "text-decoration: underline;"), 
    4096 & this.attr && (this.style += "text-decoration: blink;"), this.attrFg ? t = this.attrFg : 8192 & this.attr ? t = "Def" : (t = 15 & this.attr, 
    2048 & this.attr && (t |= 8, this.style += "font-weight: bold;")), e = this.attrBg ? this.attrBg : 16384 & this.attr ? "Def" : this.attr >> 4 & 15, 
    256 & this.attr) {
        var s = t, i = e;
        t = "Def" == i ? "DefR" : i, e = "Def" == s ? "DefR" : s;
    }
    this.color = "ansi" + t + " bgAnsi" + e;
}, VT100.prototype.setAttrColors = function(t) {
    t != this.attr && (this.attr = t, this.updateStyle());
}, VT100.prototype.saveCursor = function() {
    this.savedX[this.currentScreen] = this.cursorX, this.savedY[this.currentScreen] = this.cursorY, 
    this.savedAttr[this.currentScreen] = this.attr, this.savedAttrFg[this.currentScreen] = this.attrFg, 
    this.savedAttrBg[this.currentScreen] = this.attrBg, this.savedUseGMap = this.useGMap;
    for (var t = 0; t < 4; t++) this.savedGMap[t] = this.GMap[t];
    this.savedValid[this.currentScreen] = !0;
}, VT100.prototype.restoreCursor = function() {
    if (this.savedValid[this.currentScreen]) {
        this.attr = this.savedAttr[this.currentScreen], this.attrFg = this.savedAttrFg[this.currentScreen], 
        this.attrBg = this.savedAttrBg[this.currentScreen], this.updateStyle(), this.useGMap = this.savedUseGMap;
        for (var t = 0; t < 4; t++) this.GMap[t] = this.savedGMap[t];
        this.translate = this.GMap[this.useGMap], this.needWrap = !1, this.gotoXY(this.savedX[this.currentScreen], this.savedY[this.currentScreen]);
    }
}, VT100.prototype.getTransformName = function() {
    for (var t = [ "transform", "WebkitTransform", "MozTransform", "filter" ], e = 0; e < t.length; ++e) if (void 0 !== this.console[0].style[t[e]]) return t[e];
}, VT100.prototype.getTransformStyle = function(t, e) {
    return e && 1 != e ? "filter" == t ? "progid:DXImageTransform.Microsoft.Matrix(M11=" + 1 / e + ",M12=0,M21=0,M22=1,sizingMethod='auto expand')" : "translateX(-50%) scaleX(" + 1 / e + ") translateX(50%)" : "";
}, VT100.prototype.set80_132Mode = function(t) {
    var e = this.getTransformName();
    if (e) {
        if ("" != this.console[this.currentScreen].style[e] == t) return;
        var s = t ? this.getTransformStyle(e, 1.65) : "";
        this.console[this.currentScreen].style[e] = s, this.cursor.style[e] = s, this.space.style[e] = s, 
        this.scale = t ? 1.65 : 1, "filter" == e && (this.console[this.currentScreen].style.width = t ? "165%" : ""), 
        this.resizer();
    }
}, VT100.prototype.setMode = function(t) {
    for (var e = 0; e <= this.npar; e++) if (this.isQuestionMark) switch (this.par[e]) {
      case 1:
        this.cursorKeyMode = t;
        break;

      case 3:
        this.set80_132Mode(t);
        break;

      case 5:
        this.isInverted = t, this.refreshInvertedState();
        break;

      case 6:
        this.offsetMode = t;
        break;

      case 7:
        this.autoWrapMode = t;
        break;

      case 1e3:
      case 9:
        this.mouseReporting = t;
        break;

      case 25:
        this.cursorNeedsShowing = t, t ? this.showCursor() : this.hideCursor();
        break;

      case 1047:
      case 1049:
      case 47:
        this.enableAlternateScreen(t);
    } else switch (this.par[e]) {
      case 3:
        this.dispCtrl = t;
        break;

      case 4:
        this.insertMode = t;
        break;

      case 20:
        this.crLfMode = t;
    }
}, VT100.prototype.statusReport = function() {
    this.respondString += "[0n";
}, VT100.prototype.cursorReport = function() {
    this.respondString += "[" + (this.cursorY + (this.offsetMode ? this.top + 1 : 1)) + ";" + (this.cursorX + 1) + "R";
}, VT100.prototype.setCursorAttr = function(t, e) {}, VT100.prototype.openPrinterWindow = function() {
    var t = !0;
    try {
        if (!this.printWin || this.printWin.closed) {
            this.printWin = window.open("", "print-output", "width=800,height=600,directories=no,location=no,menubar=yes,status=no,toolbar=no,titlebar=yes,scrollbars=yes,resizable=yes"), 
            this.printWin.document.body.innerHTML = '<link rel="stylesheet" href="' + document.location.protocol + "//" + document.location.host + document.location.pathname.replace(/[^\/]*$/, "") + 'print-styles.css" type="text/css">\n<div id="options"><input id="autoprint" type="checkbox"' + (this.autoprint ? " checked" : "") + '>Automatically, print page(s) when job is ready</input></div>\n<div id="spacer"><input type="checkbox">&nbsp;</input></div><pre id="print"></pre>\n';
            var e = this.printWin.document.getElementById("autoprint");
            this.addListener(e, "click", function(t, e) {
                return function() {
                    return t.autoprint = e.checked, t.storeUserSettings(), !1;
                };
            }(this, e)), this.printWin.document.title = "ShellInABox Printer Output";
        }
    } catch (e) {
        t = !1;
    }
    return t &= this.printWin && !this.printWin.closed && (this.printWin.innerWidth || this.printWin.document.documentElement.clientWidth || this.printWin.document.body.clientWidth) > 1, 
    t || 100 != this.printing || (this.printing = !0, setTimeout(function(t) {
        return function() {
            (!t || t.closed || (t.innerWidth || t.document.documentElement.clientWidth || t.document.body.clientWidth) <= 1) && alert("Attempted to print, but a popup blocker prevented the printer window from opening");
        };
    }(this.printWin), 2e3)), t;
}, VT100.prototype.sendToPrinter = function(t) {
    this.openPrinterWindow();
    try {
        var e = this.printWin.document, s = e.getElementById("print");
        s.lastChild && "#text" == s.lastChild.nodeName ? s.lastChild.textContent += this.replaceChar(t, " ", " ") : s.appendChild(e.createTextNode(this.replaceChar(t, " ", " ")));
    } catch (t) {}
}, VT100.prototype.sendControlToPrinter = function(t) {
    try {
        switch (t) {
          case 9:
            this.openPrinterWindow();
            var e = this.printWin.document, s = e.getElementById("print"), i = s.lastChild && "#text" == s.lastChild.nodeName ? s.lastChild.textContent.length : 0;
            this.sendToPrinter(this.spaces(8 - i % 8));
            break;

          case 10:
            break;

          case 12:
            this.openPrinterWindow();
            var r = this.printWin.document.createElement("div");
            r.className = "pagebreak", r.innerHTML = "<hr />", this.printWin.document.getElementById("print").appendChild(r);
            break;

          case 13:
            this.openPrinterWindow();
            var n = this.printWin.document.createElement("br");
            this.printWin.document.getElementById("print").appendChild(n);
            break;

          case 27:
            this.isEsc = 1;
            break;

          default:
            switch (this.isEsc) {
              case 1:
                switch (this.isEsc = 0, t) {
                  case 91:
                    this.isEsc = 2;
                }
                break;

              case 2:
                if (this.npar = 0, this.par = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
                this.isEsc = 3, this.isQuestionMark = 63 == t, this.isQuestionMark) break;

              case 3:
                if (59 == t) {
                    this.npar++;
                    break;
                }
                if (t >= 48 && t <= 57) {
                    var h = this.par[this.npar];
                    void 0 == h && (h = 0), this.par[this.npar] = 10 * h + (15 & t);
                    break;
                }
                this.isEsc = 4;

              case 4:
                if (this.isEsc = 0, this.isQuestionMark) break;
                switch (t) {
                  case 105:
                    this.csii(this.par[0]);
                }
                break;

              default:
                this.isEsc = 0;
            }
        }
    } catch (t) {}
}, VT100.prototype.csiAt = function(t) {
    0 == t && (t = 1), t > this.terminalWidth - this.cursorX && (t = this.terminalWidth - this.cursorX), 
    this.scrollRegion(this.cursorX, this.cursorY, this.terminalWidth - this.cursorX - t, 1, t, 0, this.color, this.style), 
    this.needWrap = !1;
}, VT100.prototype.csii = function(t) {
    switch (t) {
      case 0:
        window.print();
        break;

      case 4:
        try {
            if (this.printing && this.printWin && !this.printWin.closed) {
                for (var e = this.printWin.document.getElementById("print"); e.lastChild && "DIV" == e.lastChild.tagName && "pagebreak" == e.lastChild.className; ) e.removeChild(e.lastChild);
                this.autoprint && this.printWin.print();
            }
        } catch (t) {}
        this.printing = !1;
        break;

      case 5:
        this.printing || !this.printWin || this.printWin.closed || (this.printWin.document.getElementById("print").innerHTML = ""), 
        this.printing = 100;
    }
}, VT100.prototype.csiJ = function(t) {
    switch (t) {
      case 0:
        this.clearRegion(this.cursorX, this.cursorY, this.terminalWidth - this.cursorX, 1, this.color, this.style), 
        this.cursorY < this.terminalHeight - 2 && this.clearRegion(0, this.cursorY + 1, this.terminalWidth, this.terminalHeight - this.cursorY - 1, this.color, this.style);
        break;

      case 1:
        this.cursorY > 0 && this.clearRegion(0, 0, this.terminalWidth, this.cursorY, this.color, this.style), 
        this.clearRegion(0, this.cursorY, this.cursorX + 1, 1, this.color, this.style);
        break;

      case 2:
        this.clearRegion(0, 0, this.terminalWidth, this.terminalHeight, this.color, this.style);
        break;

      default:
        return;
    }
    this.needWrap = !1;
}, VT100.prototype.csiK = function(t) {
    switch (t) {
      case 0:
        this.clearRegion(this.cursorX, this.cursorY, this.terminalWidth - this.cursorX, 1, this.color, this.style);
        break;

      case 1:
        this.clearRegion(0, this.cursorY, this.cursorX + 1, 1, this.color, this.style);
        break;

      case 2:
        this.clearRegion(0, this.cursorY, this.terminalWidth, 1, this.color, this.style);
        break;

      default:
        return;
    }
    this.needWrap = !1;
}, VT100.prototype.csiL = function(t) {
    this.cursorY >= this.bottom || (0 == t && (t = 1), t > this.bottom - this.cursorY && (t = this.bottom - this.cursorY), 
    this.scrollRegion(0, this.cursorY, this.terminalWidth, this.bottom - this.cursorY - t, 0, t, this.color, this.style), 
    this.needWrap = !1);
}, VT100.prototype.csiM = function(t) {
    this.cursorY >= this.bottom || (0 == t && (t = 1), t > this.bottom - this.cursorY && (t = this.bottom - this.cursorY), 
    this.scrollRegion(0, this.cursorY + t, this.terminalWidth, this.bottom - this.cursorY - t, 0, -t, this.color, this.style), 
    this.needWrap = !1);
}, VT100.prototype.csim = function() {
    for (var t = 0; t <= this.npar; t++) switch (this.par[t]) {
      case 0:
        this.attr = 24816, this.attrFg = !1, this.attrBg = !1;
        break;

      case 1:
        this.attr = -1025 & this.attr | 2048;
        break;

      case 2:
        this.attr = -2049 & this.attr | 1024;
        break;

      case 4:
        this.attr |= 512;
        break;

      case 5:
        this.attr |= 4096;
        break;

      case 7:
        this.attr |= 256;
        break;

      case 10:
        this.translate = this.GMap[this.useGMap], this.dispCtrl = !1, this.toggleMeta = !1;
        break;

      case 11:
        this.translate = this.CodePage437Map, this.dispCtrl = !0, this.toggleMeta = !1;
        break;

      case 12:
        this.translate = this.CodePage437Map, this.dispCtrl = !0, this.toggleMeta = !0;
        break;

      case 21:
      case 22:
        this.attr &= -3073;
        break;

      case 24:
        this.attr &= -513;
        break;

      case 25:
        this.attr &= -4097;
        break;

      case 27:
        this.attr &= -257;
        break;

      case 38:
        this.npar >= t + 2 && 5 == this.par[t + 1] ? (this.attrFg = this.par[t + 2] >= 0 && this.par[t + 2] <= 255 && this.par[t + 2], 
        t += 2) : this.attr = 8704 | -3088 & this.attr;
        break;

      case 39:
        this.attr = -3600 & this.attr | 8192, this.attrFg = !1;
        break;

      case 48:
        this.npar >= t + 2 && 5 == this.par[t + 1] && (this.attrBg = this.par[t + 2] >= 0 && this.par[t + 2] <= 255 && this.par[t + 2], 
        t += 2);
        break;

      case 49:
        this.attr |= 16624, this.attrBg = !1;
        break;

      default:
        if (this.par[t] >= 30 && this.par[t] <= 37) {
            var e = this.par[t] - 30;
            this.attr = -8193 & (-16 & this.attr | e), this.attrFg = !1;
        } else if (this.par[t] >= 40 && this.par[t] <= 47) {
            var s = this.par[t] - 40;
            this.attr = -16385 & (-241 & this.attr | s << 4), this.attrBg = !1;
        }
    }
    this.updateStyle();
}, VT100.prototype.csiP = function(t) {
    0 == t && (t = 1), t > this.terminalWidth - this.cursorX && (t = this.terminalWidth - this.cursorX), 
    this.scrollRegion(this.cursorX + t, this.cursorY, this.terminalWidth - this.cursorX - t, 1, -t, 0, this.color, this.style), 
    this.needWrap = !1;
}, VT100.prototype.csiX = function(t) {
    0 == t && t++, t > this.terminalWidth - this.cursorX && (t = this.terminalWidth - this.cursorX), 
    this.clearRegion(this.cursorX, this.cursorY, t, 1, this.color, this.style), this.needWrap = !1;
}, VT100.prototype.settermCommand = function() {}, VT100.prototype.doControl = function(t) {
    if (this.printing) return this.sendControlToPrinter(t), "";
    var e = "";
    switch (t) {
      case 0:
        break;

      case 8:
        this.bs();
        break;

      case 9:
        this.ht();
        break;

      case 10:
      case 11:
      case 12:
      case 132:
        if (this.lf(), !this.crLfMode) break;

      case 13:
        this.cr();
        break;

      case 133:
        this.cr(), this.lf();
        break;

      case 14:
        this.useGMap = 1, this.translate = this.GMap[1], this.dispCtrl = !0;
        break;

      case 15:
        this.useGMap = 0, this.translate = this.GMap[0], this.dispCtrl = !1;
        break;

      case 24:
      case 26:
        this.isEsc = 0;
        break;

      case 27:
        this.isEsc = 1;
        break;

      case 127:
        break;

      case 136:
        this.userTabStop[this.cursorX] = !0;
        break;

      case 141:
        this.ri();
        break;

      case 142:
        this.isEsc = 18;
        break;

      case 143:
        this.isEsc = 19;
        break;

      case 154:
        this.respondID();
        break;

      case 155:
        this.isEsc = 2;
        break;

      case 7:
        if (17 != this.isEsc) {
            this.beep();
            break;
        }

      default:
        switch (this.isEsc) {
          case 1:
            switch (this.isEsc = 0, t) {
              case 37:
                this.isEsc = 13;
                break;

              case 40:
                this.isEsc = 8;
                break;

              case 45:
              case 41:
                this.isEsc = 9;
                break;

              case 46:
              case 42:
                this.isEsc = 10;
                break;

              case 47:
              case 43:
                this.isEsc = 11;
                break;

              case 35:
                this.isEsc = 7;
                break;

              case 55:
                this.saveCursor();
                break;

              case 56:
                this.restoreCursor();
                break;

              case 62:
                this.applKeyMode = !1;
                break;

              case 61:
                this.applKeyMode = !0;
                break;

              case 68:
                this.lf();
                break;

              case 69:
                this.cr(), this.lf();
                break;

              case 77:
                this.ri();
                break;

              case 78:
                this.isEsc = 18;
                break;

              case 79:
                this.isEsc = 19;
                break;

              case 72:
                this.userTabStop[this.cursorX] = !0;
                break;

              case 90:
                this.respondID();
                break;

              case 91:
                this.isEsc = 2;
                break;

              case 93:
                this.isEsc = 15;
                break;

              case 99:
                this.reset();
                break;

              case 103:
                this.flashScreen();
            }
            break;

          case 15:
            switch (t) {
              case 48:
              case 49:
              case 50:
                this.isEsc = 17, this.titleString = "";
                break;

              case 54:
              case 55:
                this.isEsc = 20;
                break;

              case 80:
                this.npar = 0, this.par = [ 0, 0, 0, 0, 0, 0, 0 ], this.isEsc = 16;
                break;

              case 82:
              default:
                this.isEsc = 0;
            }
            break;

          case 16:
            t >= 48 && t <= 57 || t >= 65 && t <= 70 || t >= 97 && t <= 102 ? (this.par[this.npar++] = t > 57 ? (223 & t) - 55 : 15 & t, 
            7 == this.npar && (this.isEsc = 0)) : this.isEsc = 0;
            break;

          case 2:
            if (this.npar = 0, this.par = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
            this.isEsc = 3, 91 == t) {
                this.isEsc = 6;
                break;
            }
            if (this.isQuestionMark = 63 == t, this.isQuestionMark) break;

          case 5:
          case 3:
            if (59 == t) {
                this.npar++;
                break;
            }
            if (t >= 48 && t <= 57) {
                var s = this.par[this.npar];
                void 0 == s && (s = 0), this.par[this.npar] = 10 * s + (15 & t);
                break;
            }
            if (5 == this.isEsc) {
                switch (t) {
                  case 99:
                    0 == this.par[0] && this.respondSecondaryDA();
                }
                this.isEsc = 0;
                break;
            }
            this.isEsc = 4;

          case 4:
            if (this.isEsc = 0, this.isQuestionMark) {
                switch (t) {
                  case 104:
                    this.setMode(!0);
                    break;

                  case 108:
                    this.setMode(!1);
                    break;

                  case 99:
                    this.setCursorAttr(this.par[2], this.par[1]);
                }
                this.isQuestionMark = !1;
                break;
            }
            switch (t) {
              case 33:
                this.isEsc = 12;
                break;

              case 62:
                this.npar || (this.isEsc = 5);
                break;

              case 71:
              case 96:
                this.gotoXY(this.par[0] - 1, this.cursorY);
                break;

              case 65:
                this.gotoXY(this.cursorX, this.cursorY - (this.par[0] ? this.par[0] : 1));
                break;

              case 66:
              case 101:
                this.gotoXY(this.cursorX, this.cursorY + (this.par[0] ? this.par[0] : 1));
                break;

              case 67:
              case 97:
                this.gotoXY(this.cursorX + (this.par[0] ? this.par[0] : 1), this.cursorY);
                break;

              case 68:
                this.gotoXY(this.cursorX - (this.par[0] ? this.par[0] : 1), this.cursorY);
                break;

              case 69:
                this.gotoXY(0, this.cursorY + (this.par[0] ? this.par[0] : 1));
                break;

              case 70:
                this.gotoXY(0, this.cursorY - (this.par[0] ? this.par[0] : 1));
                break;

              case 100:
                this.gotoXaY(this.cursorX, this.par[0] - 1);
                break;

              case 72:
              case 102:
                this.gotoXaY(this.par[1] - 1, this.par[0] - 1);
                break;

              case 73:
                this.ht(this.par[0] ? this.par[0] : 1);
                break;

              case 64:
                this.csiAt(this.par[0]);
                break;

              case 105:
                this.csii(this.par[0]);
                break;

              case 74:
                this.csiJ(this.par[0]);
                break;

              case 75:
                this.csiK(this.par[0]);
                break;

              case 76:
                this.csiL(this.par[0]);
                break;

              case 77:
                this.csiM(this.par[0]);
                break;

              case 109:
                this.csim();
                break;

              case 80:
                this.csiP(this.par[0]);
                break;

              case 88:
                this.csiX(this.par[0]);
                break;

              case 83:
                this.lf(this.par[0] ? this.par[0] : 1);
                break;

              case 84:
                this.ri(this.par[0] ? this.par[0] : 1);
                break;

              case 99:
                this.par[0] || this.respondID();
                break;

              case 103:
                if (0 == this.par[0]) this.userTabStop[this.cursorX] = !1; else if (2 == this.par[0] || 3 == this.par[0]) {
                    this.userTabStop = [];
                    for (var i = 0; i < this.terminalWidth; i++) this.userTabStop[i] = !1;
                }
                break;

              case 104:
                this.setMode(!0);
                break;

              case 108:
                this.setMode(!1);
                break;

              case 110:
                switch (this.par[0]) {
                  case 5:
                    this.statusReport();
                    break;

                  case 6:
                    this.cursorReport();
                }
                break;

              case 113:
                break;

              case 114:
                var r = this.par[0] ? this.par[0] : 1, n = this.par[1] ? this.par[1] : this.terminalHeight;
                r < n && n <= this.terminalHeight && (this.top = r - 1, this.bottom = n, this.gotoXaY(0, 0));
                break;

              case 98:
                var h = this.par[0] ? this.par[0] : 1;
                for (h > this.terminalWidth * this.terminalHeight && (h = this.terminalWidth * this.terminalHeight); h-- > 0; ) e += this.lastCharacter;
                break;

              case 115:
                this.saveCursor();
                break;

              case 117:
                this.restoreCursor();
                break;

              case 90:
                this.rt(this.par[0] ? this.par[0] : 1);
                break;

              case 93:
                this.settermCommand();
            }
            break;

          case 12:
            "p" == t && this.reset(), this.isEsc = 0;
            break;

          case 13:
            switch (this.isEsc = 0, t) {
              case 64:
                this.utfEnabled = !1;
                break;

              case 71:
              case 56:
                this.utfEnabled = !0;
            }
            break;

          case 6:
          case 7:
            this.isEsc = 0;
            break;

          case 8:
          case 9:
          case 10:
          case 11:
            var o = this.isEsc - 8;
            switch (this.isEsc = 0, t) {
              case 48:
                this.GMap[o] = this.VT100GraphicsMap;
                break;

              case 66:
              case 66:
                this.GMap[o] = this.Latin1Map;
                break;

              case 85:
                this.GMap[o] = this.CodePage437Map;
                break;

              case 75:
                this.GMap[o] = this.DirectToFontMap;
            }
            this.useGMap == o && (this.translate = this.GMap[o]);
            break;

          case 17:
            if (7 == t) {
                this.titleString && ";" == this.titleString.charAt(0) && (this.titleString = this.titleString.substr(1), 
                "" != this.titleString && (this.titleString += " - "), this.titleString += "Shell In A Box");
                try {
                    window.document.title = this.titleString;
                } catch (t) {}
                this.isEsc = 0;
            } else this.titleString += String.fromCharCode(t);
            break;

          case 18:
          case 19:
            if (t < 256) if (61440 == (65280 & (t = this.GMap[this.isEsc - 18 + 2][this.toggleMeta ? 128 | t : t]))) t &= 255; else if (65279 == t || t >= 8202 && t <= 8207) {
                this.isEsc = 0;
                break;
            }
            this.lastCharacter = String.fromCharCode(t), e += this.lastCharacter, this.isEsc = 0;
            break;

          case 20:
            7 != t && 92 != t || (this.isEsc = 0);
            break;

          default:
            this.isEsc = 0;
        }
    }
    return e;
}, VT100.prototype.renderString = function(t, e) {
    if (this.printing) return this.sendToPrinter(t), void (e && this.showCursor());
    var s = t.length;
    if (s > this.terminalWidth - this.cursorX) {
        if ((s = this.terminalWidth - this.cursorX) <= 0) return;
        t = t.substr(0, s - 1) + t.charAt(t.length - 1);
    }
    e && (this.cursor.style.visibility = ""), this.putString(this.cursorX, this.cursorY, t, this.color, this.style);
}, VT100.prototype.vt100 = function(t) {
    this.cursorNeedsShowing = this.hideCursor(), this.respondString = "";
    for (var e = "", s = 0; s < t.length; s++) {
        var i = t.charCodeAt(s);
        if (this.utfEnabled) if (i > 127) {
            if (!(this.utfCount > 0 && 128 == (192 & i))) {
                192 == (224 & i) ? (this.utfCount = 1, this.utfChar = 31 & i) : 224 == (240 & i) ? (this.utfCount = 2, 
                this.utfChar = 15 & i) : 240 == (248 & i) ? (this.utfCount = 3, this.utfChar = 7 & i) : 248 == (252 & i) ? (this.utfCount = 4, 
                this.utfChar = 3 & i) : 252 == (254 & i) ? (this.utfCount = 5, this.utfChar = 1 & i) : this.utfCount = 0;
                continue;
            }
            if (this.utfChar = this.utfChar << 6 | 63 & i, !(--this.utfCount <= 0)) continue;
            i = this.utfChar > 65535 || this.utfChar < 0 ? 65533 : this.utfChar;
        } else this.utfCount = 0;
        if ((i >= 32 && i <= 127 || i >= 160 || this.utfEnabled && i >= 128 || !(this.dispCtrl ? this.ctrlAlways : this.ctrlAction)[31 & i]) && (127 != i || this.dispCtrl) && 0 == this.isEsc) {
            if (i < 256 && (i = this.translate[this.toggleMeta ? 128 | i : i]), 61440 == (65280 & i)) i &= 255; else if (65279 == i || i >= 8202 && i <= 8207) continue;
            this.printing || ((this.needWrap || this.insertMode) && e && (this.renderString(e), 
            e = ""), this.needWrap && (this.cr(), this.lf()), this.insertMode && this.scrollRegion(this.cursorX, this.cursorY, this.terminalWidth - this.cursorX - 1, 1, 1, 0, this.color, this.style)), 
            this.lastCharacter = String.fromCharCode(i), e += this.lastCharacter, !this.printing && this.cursorX + e.length >= this.terminalWidth && (this.needWrap = this.autoWrapMode);
        } else {
            e && (this.renderString(e), e = "");
            var r = this.doControl(i);
            if (r.length) {
                var n = this.respondString;
                this.respondString = n + this.vt100(r);
            }
        }
    }
    return e ? this.renderString(e, this.cursorNeedsShowing) : this.cursorNeedsShowing && this.showCursor(), 
    this.respondString;
}, VT100.prototype.Latin1Map = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255 ], 
VT100.prototype.VT100GraphicsMap = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 8594, 8592, 8593, 8595, 47, 9608, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 160, 9670, 9618, 9225, 9228, 9229, 9226, 176, 177, 9617, 9227, 9496, 9488, 9484, 9492, 9532, 63488, 63489, 9472, 63491, 63492, 9500, 9508, 9524, 9516, 9474, 8804, 8805, 960, 8800, 163, 183, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255 ], 
VT100.prototype.CodePage437Map = [ 0, 9786, 9787, 9829, 9830, 9827, 9824, 8226, 9688, 9675, 9689, 9794, 9792, 9834, 9835, 9788, 9654, 9664, 8597, 8252, 182, 167, 9644, 8616, 8593, 8595, 8594, 8592, 8735, 8596, 9650, 9660, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 8962, 199, 252, 233, 226, 228, 224, 229, 231, 234, 235, 232, 239, 238, 236, 196, 197, 201, 230, 198, 244, 246, 242, 251, 249, 255, 214, 220, 162, 163, 165, 8359, 402, 225, 237, 243, 250, 241, 209, 170, 186, 191, 8976, 172, 189, 188, 161, 171, 187, 9617, 9618, 9619, 9474, 9508, 9569, 9570, 9558, 9557, 9571, 9553, 9559, 9565, 9564, 9563, 9488, 9492, 9524, 9516, 9500, 9472, 9532, 9566, 9567, 9562, 9556, 9577, 9574, 9568, 9552, 9580, 9575, 9576, 9572, 9573, 9561, 9560, 9554, 9555, 9579, 9578, 9496, 9484, 9608, 9604, 9612, 9616, 9600, 945, 223, 915, 960, 931, 963, 181, 964, 934, 920, 937, 948, 8734, 966, 949, 8745, 8801, 177, 8805, 8804, 8992, 8993, 247, 8776, 176, 8729, 183, 8730, 8319, 178, 9632, 160 ], 
VT100.prototype.DirectToFontMap = [ 61440, 61441, 61442, 61443, 61444, 61445, 61446, 61447, 61448, 61449, 61450, 61451, 61452, 61453, 61454, 61455, 61456, 61457, 61458, 61459, 61460, 61461, 61462, 61463, 61464, 61465, 61466, 61467, 61468, 61469, 61470, 61471, 61472, 61473, 61474, 61475, 61476, 61477, 61478, 61479, 61480, 61481, 61482, 61483, 61484, 61485, 61486, 61487, 61488, 61489, 61490, 61491, 61492, 61493, 61494, 61495, 61496, 61497, 61498, 61499, 61500, 61501, 61502, 61503, 61504, 61505, 61506, 61507, 61508, 61509, 61510, 61511, 61512, 61513, 61514, 61515, 61516, 61517, 61518, 61519, 61520, 61521, 61522, 61523, 61524, 61525, 61526, 61527, 61528, 61529, 61530, 61531, 61532, 61533, 61534, 61535, 61536, 61537, 61538, 61539, 61540, 61541, 61542, 61543, 61544, 61545, 61546, 61547, 61548, 61549, 61550, 61551, 61552, 61553, 61554, 61555, 61556, 61557, 61558, 61559, 61560, 61561, 61562, 61563, 61564, 61565, 61566, 61567, 61568, 61569, 61570, 61571, 61572, 61573, 61574, 61575, 61576, 61577, 61578, 61579, 61580, 61581, 61582, 61583, 61584, 61585, 61586, 61587, 61588, 61589, 61590, 61591, 61592, 61593, 61594, 61595, 61596, 61597, 61598, 61599, 61600, 61601, 61602, 61603, 61604, 61605, 61606, 61607, 61608, 61609, 61610, 61611, 61612, 61613, 61614, 61615, 61616, 61617, 61618, 61619, 61620, 61621, 61622, 61623, 61624, 61625, 61626, 61627, 61628, 61629, 61630, 61631, 61632, 61633, 61634, 61635, 61636, 61637, 61638, 61639, 61640, 61641, 61642, 61643, 61644, 61645, 61646, 61647, 61648, 61649, 61650, 61651, 61652, 61653, 61654, 61655, 61656, 61657, 61658, 61659, 61660, 61661, 61662, 61663, 61664, 61665, 61666, 61667, 61668, 61669, 61670, 61671, 61672, 61673, 61674, 61675, 61676, 61677, 61678, 61679, 61680, 61681, 61682, 61683, 61684, 61685, 61686, 61687, 61688, 61689, 61690, 61691, 61692, 61693, 61694, 61695 ], 
VT100.prototype.ctrlAction = [ !0, !1, !1, !1, !1, !1, !1, !0, !0, !0, !0, !0, !0, !0, !0, !0, !1, !1, !1, !1, !1, !1, !1, !1, !0, !1, !0, !0, !1, !1, !1, !1 ], 
VT100.prototype.ctrlAlways = [ !0, !1, !1, !1, !1, !1, !1, !1, !0, !1, !0, !1, !0, !0, !0, !0, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !0, !1, !1, !1, !1 ], 
"undefined" == typeof XMLHttpRequest && (XMLHttpRequest = function() {
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (t) {}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (t) {}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (t) {}
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (t) {}
    throw new Error("");
}), extend(ShellInABox, VT100), ShellInABox.prototype.sessionClosed = function() {
    try {
        this.connected = !1, this.session && (this.session = void 0, this.cursorX > 0 && this.vt100("\r\n"), 
        this.vt100("Session closed.")), this.showReconnect(!0), this.replayOnSession && this.messageReplay("session", "closed");
    } catch (t) {}
}, ShellInABox.prototype.reconnect = function() {
    return this.showReconnect(!1), this.session || ("" != document.location.hash ? parent.location = this.nextUrl : this.url != this.nextUrl ? document.location.replace(this.nextUrl) : (this.pendingKeys = "", 
    this.keysInFlight = !1, this.reset(!0), this.sendRequest())), !1;
}, ShellInABox.prototype.sendRequest = function(t) {
    void 0 == t && (t = new XMLHttpRequest()), t.open("POST", window.top.DOMAIN+"shell", !0), t.timeout = 3e4, 
    t.setRequestHeader("Cache-Control", "no-cache"), t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    var e = "width=" + this.terminalWidth + "&height=" + this.terminalHeight + (this.session ? "&session=" + encodeURIComponent(this.session) : "&rooturl=" + encodeURIComponent(this.rooturl));
    t.onreadystatechange = function(e) {
        return function() {
            try {
                return e.onReadyStateChange(t);
            } catch (t) {
                e.sessionClosed();
            }
        };
    }(this), t.send(e);
}, ShellInABox.prototype.onReadyStateChange = function(request) {
    if (4 == request.readyState) if (200 == request.status) {
        this.connected = !0;
        var response = eval("(" + request.responseText + ")");
        response.data && (this.replayOnOutput && this.messageReplay("output", response.data), 
        this.vt100(response.data)), !response.session || this.session && this.session != response.session ? this.sessionClosed() : (this.replayOnSession && !this.session && response.session && this.messageReplay("session", "alive"), 
        this.session = response.session, this.sendRequest(request));
    } else 0 == request.status ? setTimeout(function(t) {
        return function() {
            t.sendRequest();
        };
    }(this), 1e3) : this.sessionClosed();
}, ShellInABox.prototype.sendKeys = function(t) {
    if (this.connected) if (this.keysInFlight || void 0 == this.session) this.pendingKeys += t; else {
        this.keysInFlight = !0, t = this.pendingKeys + t, this.pendingKeys = "";
        var e = new XMLHttpRequest();
        e.open("POST", this.url + "?", !0), e.setRequestHeader("Cache-Control", "no-cache"), 
        e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        var s = "width=" + this.terminalWidth + "&height=" + this.terminalHeight + "&session=" + encodeURIComponent(this.session) + "&keys=" + encodeURIComponent(t);
        e.onreadystatechange = function(t) {
            return function() {
                try {
                    return t.keyPressReadyStateChange(e);
                } catch (t) {}
            };
        }(this), e.send(s);
    }
}, ShellInABox.prototype.keyPressReadyStateChange = function(t) {
    4 == t.readyState && (this.keysInFlight = !1, this.pendingKeys && this.sendKeys(""));
}, ShellInABox.prototype.keysPressed = function(t) {
    for (var e = "0123456789ABCDEF", s = "", i = 0; i < t.length; i++) {
        var r = t.charCodeAt(i);
        r < 128 ? s += e.charAt(r >> 4) + e.charAt(15 & r) : r < 2048 ? s += e.charAt(12 + (r >> 10)) + e.charAt(r >> 6 & 15) + e.charAt(8 + (r >> 4 & 3)) + e.charAt(15 & r) : r < 65536 ? s += "E" + e.charAt(r >> 12) + e.charAt(8 + (r >> 10 & 3)) + e.charAt(r >> 6 & 15) + e.charAt(8 + (r >> 4 & 3)) + e.charAt(15 & r) : r < 1114112 && (s += "F" + e.charAt(r >> 18) + e.charAt(8 + (r >> 16 & 3)) + e.charAt(r >> 12 & 15) + e.charAt(8 + (r >> 10 & 3)) + e.charAt(r >> 6 & 15) + e.charAt(8 + (r >> 4 & 3)) + e.charAt(15 & r));
    }
    this.sendKeys(s);
}, ShellInABox.prototype.resized = function(t, e) {
    this.session && this.sendKeys("");
}, ShellInABox.prototype.toggleSSL = function() {
    "" != document.location.hash ? (this.nextUrl.match(/\?plain$/) ? this.nextUrl = this.nextUrl.replace(/\?plain$/, "") : this.nextUrl = this.nextUrl.replace(/[?#].*/, "") + "?plain", 
    this.session || (parent.location = this.nextUrl)) : this.nextUrl = this.nextUrl.match(/^https:/) ? this.nextUrl.replace(/^https:/, "http:").replace(/\/*$/, "/plain") : this.nextUrl.replace(/^http/, "https").replace(/\/*plain$/, ""), 
    this.nextUrl.match(/^[:]*:\/\/[^\/]*$/) && (this.nextUrl += "/"), this.session && this.nextUrl != this.url && alert("This change will take effect the next time you login.");
}, ShellInABox.prototype.extendContextMenu = function(t, e) {
    for (var s = [], i = 0; i < e.length; i++) s[i] = e[i];
    for (var r = t.firstChild, i = 0, n = 0; r; r = r.nextSibling) if ("LI" == r.tagName && (e[i++] = s[n++], 
    "endconfig" == r.id)) {
        if (r.id = "", "undefined" != typeof serverSupportsSSL && serverSupportsSSL && ("undefined" == typeof disableSSLMenu || !disableSSLMenu)) {
            var h, o = document.createElement("li");
            h = "" != document.location.hash ? !this.nextUrl.match(/\?plain$/) : this.nextUrl.match(/^https:/), 
            o.innerHTML = (h ? "&#10004; " : "") + "Secure", r.nextSibling ? t.insertBefore(o, r.nextSibling) : t.appendChild(o), 
            e[i++] = this.toggleSSL, r = o;
        }
        r.id = "endconfig";
    }
}, ShellInABox.prototype.messageInit = function() {
    serverMessagesOrigin && window.postMessage && window.JSON && window.JSON.parse && window.JSON.stringify && (window.addEventListener ? window.addEventListener("message", function(t) {
        return function(e) {
            t.messageReceive(e);
        };
    }(this), !1) : window.attachEvent && window.attachEvent("onmessage", function(t) {
        return function(e) {
            t.messageReceive(e);
        };
    }(this)), parent.postMessage(JSON.stringify({
        type: "ready",
        data: ""
    }), "*"));
}, ShellInABox.prototype.messageReceive = function(t) {
    if ("*" === serverMessagesOrigin || serverMessagesOrigin === t.origin) {
        this.replaySource && this.replayOrigin || (this.replaySource = t.source, this.replayOrigin = t.origin);
        var e = JSON.parse(t.data);
        switch (e.type) {
          case "input":
            this.keysPressed(e.data);
            break;

          case "output":
            switch (e.data) {
              case "enable":
                this.replayOnOutput = !0;
                break;

              case "disable":
                this.replayOnOutput = !1;
                break;

              case "toggle":
                this.replayOnOutput = !this.replayOnOutput;
            }
            break;

          case "session":
            this.messageReplay("session", this.session ? "alive" : "closed");
            break;

          case "onsessionchange":
            switch (e.data) {
              case "enable":
                this.replayOnSession = !0;
                break;

              case "disable":
                this.replayOnSession = !1;
                break;

              case "toggle":
                this.replayOnSession = !this.replayOnSession;
            }
            break;

          case "reconnect":
            this.reconnect();
        }
    }
}, ShellInABox.prototype.messageReplay = function(t, e) {
    if (this.replaySource && this.replayOrigin) {
        var s = JSON.stringify({
            type: t,
            data: e
        });
        this.replaySource.postMessage(s, this.replayOrigin);
    }
}, ShellInABox.prototype.about = function() {
    alert("Shell In A Box 2.20 \n\nCopyright 2008-2015 by Markus Gutschke. For more information visit\nhttp://shellinabox.com or http://github.com/shellinabox/." + ("undefined" != typeof serverSupportsSSL && serverSupportsSSL ? "\n\nThis product includes software developed by the OpenSSL Project for\nuse in the OpenSSL Toolkit. (http://www.openssl.org/)\n\nThis product includes cryptographic software written by Eric Young\n(eay@cryptsoft.com)" : ""));
};