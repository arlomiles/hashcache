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

// Get the cached data if it exists, and put it in the cache variable
var cache = window.localStorage.getItem('cache');
// If it does not exist, then set the cache variable to indicate so
if(cache === undefined) {
  cache = {cached: false, data: undefined}
}
// Send the cache variable to the parent window
window.postMessage(cache, '*');
// If the data was not cached, wait for the parent window to send back data
if(!cache.cached) {
  var hash = window.location.host.split('.')[0];
  // Get the data from the parent frame
  var parentMessageListener = function(e) {
    if((typeof e.data) === 'object'
      && e.data.text !== undefined
      && SHA256_hash(e.data.text) === hash) {
        // Store the data and tell the parent window to remove this frame
        window.localStorage.setItem('cache', {cached: true, data: e.data.text});
        window.postMessage({remove: hash}, '*');
    }
  }
  window.addEventListener('message', parentMessageListener, false);
}
