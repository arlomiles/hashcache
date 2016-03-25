# HashCache
(not to be confused with HashCash)

HashCache is a lightweight, secure way to cache commonly-used files on the web, such as JavaScript and CSS libraries. Because all files are stored by their hashes, there is no need to trust that a third-party hosting provider has not modified their files, either as part of an upgrade, or for malicious purposes.

## API

`hashcache.hash(data)`

Return the SHA256 hash of the provided data. This function only exists so that the hash of a file can be calculated.

`hashcache.get(hash, url, cb)`

Retrieve a file by its hash, or from the provided URL, and call `cb` with the file contents as the parameter. If it is not already cached, then cache it. The URL must be on the same domain as the calling page, because XHR is used to retrieve the file. If the provided hash is not equal to the hash of the file, no data will be returned or cached.

`hashcache.getBlob(hash, URL, cb)`

This does the same thing as `hashcache.get`, but returns a blob URI instead of the file's contents.

## Examples

TODO

## Internals

`hashcache.get(hash, url, cb)` creates an invisible iframe, and loads https://&lt;hash&gt;.hashcache.org. This is a wildcard domain that loads the same page for every hash. This frame then sends a message to its parent to inform the parent that the frame has loaded, and if the file is cached, it sends the data to the parent. If the file is not cached, the parent retrieves the data and sends it to the iframe, where it is stored using LocalStorage. The data is then passed to the callback function.

There are two security mechanisms in place. First, there is a mechanism to verify that the hash under which any data is being stored is correct. Web pages cannot cache data under the wrong hash. Second, there is a mechanism to verify that the data that gets retrieved has the correct hash. This takes place on the retrieving web page, so this mechanism cannot be compromised, even if an attacker has full access to the hashcache.org server.
