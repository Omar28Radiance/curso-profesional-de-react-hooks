'use strict';

var GetIntrinsic = require('get-intrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var callBound = require('call-bind/callBound');
var forEach = require('../helpers/forEach');
var isLeadingSurrogate = require('../helpers/isLeadingSurrogate');
var isTrailingSurrogate = require('../helpers/isTrailingSurrogate');

var $charCodeAt = callBound('String.prototype.charCodeAt');

var StringToCodePoints = require('./StringToCodePoints');
var Type = require('./Type');
var UnicodeEscape = require('./UnicodeEscape');
var UTF16EncodeCodePoint = require('./UTF16EncodeCodePoint');

var has = require('has');

// https://ecma-international.org/ecma-262/12.0/#sec-quotejsonstring

var escapes = {
	'\u0008': '\\b',
	'\u0009': '\\t',
	'\u000A': '\\n',
	'\u000C': '\\f',
	'\u000D': '\\r',
	'\u0022': '\\"',
	'\u005c': '\\\\'
};

module.exports = function QuoteJSONString(value) {
	if (Type(value) !== 'String') {
		throw new $TypeError('Assertion failed: `value` must be a String');
	}
	var product = '"';
	if (value) {
		forEach(StringToCodePoints(value), function (C) {
			if (has(escapes, C)) {
				product += escapes[C];
			} else {
				var cCharCode = $charCodeAt(C, 0);
				if (cCharCode < 0x20 || isLeadingSurrogate(C) || isTrailingSurrogate(C)) {
					product += UnicodeEscape(C);
				} else {
					product += UTF16EncodeCodePoint(cCharCode);
				}
			}
		});
	}
	product += '"';
	return product;
};
