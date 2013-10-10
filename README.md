appCacheSafariBug
=================

Meteor bug on safari 5, 6 &amp; Mobile Safari 5, 6

After looking more into how browsers work with browser cache vs. appcache I found that it is indeed, that with the current implementation, each resource is being downloaded twice. So image1.jpg and image1.jpg?dklasf213421342314fds always exists in the cache of the browser.
here a screenshot for Safari 6, osx:

(https://raw.github.com/akralj/meteor-appCacheSafariBug/master/screenshots/safari_double_download_bug.png)

and one for Chrome 30, osx

(https://raw.github.com/akralj/meteor-appCacheSafariBug/master/screenshots/safari_double_download_bug.png)

In both cases the font and the image are in the cache twice. In chrome there are just seperated in the gui. 
So I suggest getting rid of the hashed versions of the files and just using the simple filenames. Apart from addition download it is a much cleaner manifest file, like this one:

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

I deployed a version with my changed version to:
(http://appcache2.meteor.com)

There is no issue with changed files / same name, not being reloaded anymore in chrome, safari & opera. 
Firefox & ie10 have different caching rules. so they seem to wait for the 1week expiration which static resources get from meteor at the moment:
(https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js#L267)
I tried changing it to one minute to test with firefox & ie. They are reloading it some times, but I am not sure why they do not do it every time. Anyway I don't think it would be a could idea to change the expiry header to less then one week. 
Here a quick video showing different browsers loading the new appcache version, after the image is change, but left with the same name:
(http://youtu.be/-lzbIqQBUo8)

