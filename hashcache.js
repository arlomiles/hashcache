/*
		HashCache - a caching system for the web
		Copyright (C) 2016  Arlo Miles

		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var hashcache = {
	HASHCACHE_DOMAIN: 'hashcache.org',
	hash: function(data) {
		return SHA256_hash(data);
	},
	get: function(hash, url, cb) {
		if(typeof hashTable[hash] === 'string') return hashTable[hash];
		// Check that the hash is valid
		hash = hash.replace(/[^0-9a-fA-F]/g, '');
		if(hash.length === 64) {
			// If it is, then create an iframe to access the cache
			var iframe = document.createElement('iframe');
			iframe.src = 'https://' + hash + '.' + this.HASHCACHE_DOMAIN;
			iframe.style.visibility = 'hidden';
			document.body.appendChild(iframe);
			// Listen for the message from the iframe
			var iframeMessageListener = function(e) {
				// Check that it is from the correct domain
				if((e.origin || e.originalEvent.origin) === iframe.src) {
					if(e.data.cached && this.hash(e.data.data) === hash) {
						// If the file is cached and the hash is correct, remove the frame
						// and return the data
						iframe.parentElement.removeChild(iframe);
						cb(e.data.data);
					} else {
						// If not, retrieve the object
						this.getObj(url, function(resText) {
							// Send the object to the iframe
							window.postMessage({text: resText}, '*');
							// Wait until the iframe acknowledges that it has received the message
							// before removing it, then return the object
							window.removeEventListener('message', iframeMessageListener, false);
							iframeMessageListener = function(e) {
								if((e.origin || e.originalEvent.origin) === iframe.src
									&& e.data.remove === hash) {
										iframe.parentElement.removeChild(iframe);
										cb(resText);
								}
							}
							window.addEventListener('message', iframeMessageListener, false);
						});
					}
				}
			};
			window.addEventListener('message', iframeMessageListener, false);
		} else {
			// If not, retrieve the object and return it
			this.getObj(url, function(resText) {
				cb(resText);
			});
		}
	},
	getObj: function(url, cb) {
		// Create a new XHR object
		var xhr = new XMLHttpRequest();
		// When a response is received, return the response contents
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4 && xhr.status === 200) {
				cb(xhr.responseText);
			}
		};
		// Send the request
		xhr.open('GET', url, true);
		xhr.send();
	},
	getBlob: function(hash, url, cb) {
		this.get(hash, url, function(obj) {
			cb(URL.createObjectURL(new Blob([obj])));
		});
	}
};
