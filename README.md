appcache Safari reload bug #1470 & appcache double download issue 
=================


## Issue: #1470
* Safari on all versions has a problem loading resources which are references with a hash in the filename.
* tested on Safari 5, 6 on os x & Mobile Safari on ios 5, 6, 7

## Issue:

The current appcache implemation downloads each resource in public folder twice. This is by design to enable users to change a static resource, but leaving the same name in place.  
It's implemented by hashing the file and appending the hash to the filename which is linked in the app.manifest file.
[@awwx explains how it works in the current implemenation using image1.jpg as an example:] (https://github.com/meteor/meteor/issues/1470#issuecomment-26092570)

>Both image1.jpg and image1.jpg?a237bf23.. will be downloaded. image1.jpg will be downloaded because it is referenced in an img tag; image1.jpg?a237bf23.. because it is referenced in the cache manifest.

That means, when a user opens a meteor app with the appcache package enabled and there a 4mb of images, fonts,... in the public folder, 8mb are being downloaded instead of 4mb.

Here is a screenshot of the cache content in Safari 6, osx:

(https://raw.github.com/akralj/meteor-appCacheSafariBug/master/screenshots/safari_double_download_bug.png)

and one for Chrome 30, osx

(https://raw.github.com/akralj/meteor-appCacheSafariBug/master/screenshots/safari_double_download_bug.png)


In both cases the font and the image are being downloaded twice. In chrome there are just seperated in the gui. 
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


There is no issue with changed files / same name, not being reloaded anymore in chrome, safari & opera. 
Firefox & ie10 have different caching rules. so they seem to wait for the 1week expiration which static resources get from meteor at the moment:
(https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js#L267)
I tried changing it to one minute to test with firefox & ie. They are reloading it some times, but I am not sure why they do not do it every time. Anyway I don't think it would be a could idea to change the expiry header to less then one week. 
Here a quick video showing different browsers loading the new appcache version, after the image is change, but left with the same name:
(http://youtu.be/-lzbIqQBUo8)

