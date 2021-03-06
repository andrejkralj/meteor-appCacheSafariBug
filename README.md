##Test repo for meteor issues #1470, #1488
Please clone and run with or without the modified [appcache-server.js](https://github.com/akralj/meteor/blob/aed65875f11d5ac198c1cf1becc87a2ba4c55465/packages/appcache/appcache-server.js) or clone [my meteor fork.](https://github.com/akralj/meteor)


### #1470 Appcache Safari reload bug 
Safari on all versions has a problem loading resources which are references with a hash in the filename.
tested on Safari 5, 6, 7 on os x & Mobile Safari on ios 5, 6, 7

### #1488 Appcache downloads static files twice

The current appcache implementation downloads each resource in public folder twice. This is by design to enable users to change a static resource, but leaving the same name in place.  
It's implemented by hashing the file and appending the hash to the filename which is linked in the app.manifest file.

[@awwx explains how it works in the current implementation using image1.jpg as an example:] (https://github.com/meteor/meteor/issues/1470#issuecomment-26092570)

>Both image1.jpg and image1.jpg?a237bf23.. will be downloaded. image1.jpg will be downloaded because it is referenced in an img tag; image1.jpg?a237bf23.. because it is referenced in the cache manifest.

This means, when a user opens a meteor app with the appcache package enabled for the first time and there a 4mb of images, fonts,... in the public folder, 8mb are being downloaded instead of 4mb.

I think this is a really bad idea, esp. when thinking about users on mobile, experiencing the app for the first time.

To demonstrate how the current appcache downloads resources, I deployed [this repo](https://github.com/akralj/meteor-appCacheSafariBug) to http://appcachetest.meteor.com with meteor 0.6.5.1. Here are the screen shots of the cache content after loading the page with an empty browser cache & appcache:

[Safari 6 (osx)](https://raw.github.com/akralj/meteor-appCacheSafariBug/master/screenshots/safari_double_download_bug.png)

[Chrome 30 (osx)](https://raw.github.com/akralj/meteor-appCacheSafariBug/master/screenshots/chrome_double_download_bug.png)

Tools to view the content of the different caches:
* Chrome: Appcache Entries: chrome://appcache-internals/ | Browser Cache: chrome://cache/
* Firefox: Appcache Entries: about:cache?device=offline |  Browser Cache: about:cache?device=disk
* Safari: http://www.beecubu.com/en/desktop-apps/#SafariCacheExplorer (Testversion is enough)

For some strange reason the networking tools of the browsers don't show what is really going over the wire. That's why I put firefox behind Charles Proxy:

[Charles Proxy Output Screenshot](https://github.com/akralj/meteor-appCacheSafariBug/blob/master/screenshots/charles_firefox_network_monitoring.png)

In both cases the font and the image are being downloaded twice. In chrome there are just separated in the gui. 
So I suggest getting rid of the hashed versions of the files and just using the simple filenames. A example app.manifest looks like this:

    CACHE MANIFEST

    # e51969a6ca54db713f9b1369f2b825f7858586a8

    CACHE:
    /
    /c60b3811dbecf8ca322d717a4a079c7b4b3fab72.js
    /7ce345f6e0d9d0904517543ad029bb7a7b2b7c1c.css
    /font/fontawesome.ttf
    /img/frog.jpg

    FALLBACK:
    / /

    NETWORK:
    /sockjs/
    *

I deployed a version of the test app with my modified version of the appcache to:
(http://appcache2.meteor.com)

I tested my PR [#1489](https://github.com/meteor/meteor/pull/1489) with safari 6 (osx), mobileSafari on ios 6.12, Opera 17 (osx), chrome 30 (osx), firefox 24 (osx), ie10 (win7), firefox 24 (win7), opera 16 (win7) 

Concerning the convenience that a dev can change an image for example, but keep the same name:

This does not change so much with the new implementation. Chrome, Opera & Safari just reload it on a hot code push, put it into the browser cache and immediately update change files in the appcache.

IE10 & firefox wait till the one day expiration time, which is [set in for static resources:](https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js#L267)

I checked this by changing the time one my server install & changing the time in windows. 

[Short video demonstrating what happens after an image is being replaced, but the name stays the same & also showing that the app is still working offline:] (http://youtu.be/-lzbIqQBUo8)

I recommend to explain in in the appcache docs, that the safest approach when working with the appcache is to append a version number to any static resource, which is being changed. 
This is the recommended way to handle static files in the MANIFEST file, anyway.
