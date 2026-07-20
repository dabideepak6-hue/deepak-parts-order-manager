/* ==========================================================
   DEEPAK DABI SMART PARTS AI V10
   SERVICE WORKER
========================================================== */

const CACHE_NAME = "deepak-parts-ai-v10";

const FILES_TO_CACHE = [

"/",
"index.html",
"style.css",
"script.js",
"manifest.json",

"assets/icon-192.png",
"assets/icon-512.png"

];

/* ===========================
   INSTALL
=========================== */

self.addEventListener("install",(event)=>{

event.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>{

return cache.addAll(FILES_TO_CACHE);

})

);

self.skipWaiting();

});

/* ===========================
   ACTIVATE
=========================== */

self.addEventListener("activate",(event)=>{

event.waitUntil(

caches.keys()

.then(keys=>{

return Promise.all(

keys.map(key=>{

if(key!==CACHE_NAME){

return caches.delete(key);

}

})

);

})

);

self.clients.claim();

});

/* ===========================
   FETCH
=========================== */

self.addEventListener("fetch",(event)=>{

event.respondWith(

caches.match(event.request)

.then(response=>{

if(response){

return response;

}

return fetch(event.request)

.then(networkResponse=>{

if(

event.request.method==="GET" &&

networkResponse.status===200

){

let responseClone=

networkResponse.clone();

caches.open(CACHE_NAME)

.then(cache=>{

cache.put(

event.request,

responseClone

);

});

}

return networkResponse;

})

.catch(()=>{

return caches.match("index.html");

});

})

);

});

/* ===========================
   MESSAGE
=========================== */

self.addEventListener("message",(event)=>{

if(event.data==="skipWaiting"){

self.skipWaiting();

}

});
