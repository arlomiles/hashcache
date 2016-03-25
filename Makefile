hashcache: build/jsmin
	cat hashcache.js sha256.js > build/hashcache-client.js
	build/jsmin < build/hashcache-client.js > build/hashcache-client.min.js
	tr "\n" " " < build/hashcache-client.min.js | sed "s/\\\"/\\\\\\\"/g" > build/hashcache-client-index.min.js
	m4 index.js.m4 > build/index.js
hashcache-server: build/jsmin
	cat server/server.js sha256.js > build/hashcache-server.js
	build/jsmin < build/hashcache-server.js > build/hashcache-server.min.js
build/jsmin:
	gcc jsmin/jsmin.c -o build/jsmin
clean:
	rm build/*
