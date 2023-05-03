'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "6df5abbf8beb2256146c2563b49513b4",
"index.html": "8cd9b18a3dc4c76279993ba9743c0d35",
"/": "8cd9b18a3dc4c76279993ba9743c0d35",
"main.dart.js": "ae86e288ce010b1955ad903496db0ea8",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"favicon.png": "2cca1f9a34fe36f1af0e01b15c60d1a1",
"icons/Icon-192-2.png": "afcaeb1ffbe7f8b9d90dba6e9a180597",
"icons/Icon-192.png": "2cca1f9a34fe36f1af0e01b15c60d1a1",
"icons/Icon-512-1.png": "cefd966fad3d118172d4edd70ab8f5f4",
"icons/Icon-512-2.png": "afcaeb1ffbe7f8b9d90dba6e9a180597",
"icons/Icon-512.png": "2cca1f9a34fe36f1af0e01b15c60d1a1",
"manifest.json": "5ae9869aa6fa869ef2b3d30bbc225dd7",
"analysis_options.yaml": "a1e00309d6ae6b9d085d2d8fb7afcbe0",
"assets/assets_rekruter/home.png": "0331ba55a30a267bdd2ec22c9ab10a3e",
"assets/assets_rekruter/login_page.png": "da7901e9b949d0709d03f934d8c0cd2b",
"assets/assets_rekruter/rekruter.png": "75a0eaed5ca4286f7108b6415aa2a44b",
"assets/AssetManifest.json": "a6672addc67796238c2cb73a7e6b0875",
"assets/NOTICES": "365d8e3322faf3ec7ac4fc4f93f6dd54",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/notif_sukses.png": "b932b6b64a5aac995c59fe8fdc5537d0",
"assets/assets/up.png": "c12d6fce7590276a8ffc0fbf736fc82d",
"assets/assets/down.png": "5a4ca96af9cf155d16a9b653491973ce",
"assets/assets/home_dashboard.png": "7b9dc7676cd6de6ed71352eb81419d8f",
"assets/assets/notif_gagal.png": "0c9c8e660694c5ca16ca650178b97662",
"assets/assets/error_dark.png": "4083b40eb26cf0f87fa550a98ade40c9",
"assets/assets/error_light.png": "2aa8d21a2c3b7302ef90fd7ffdc63332",
"assets/assets/main_bg.png": "2910815769c22037cd437316b67be9d7",
"assets/assets/empty_lowongan_2.png": "e47c2dbe8ee520bfc6bc86cf9cf56618",
"assets/assets/empty_lamaran.png": "b8f04c2704cbb1413cd17c6a7c99f05b",
"assets/assets/no_data.png": "cfae76d03c0b0d64b47425847b557625",
"assets/assets/user_guide.pdf": "39a79f0f5b9186b0b2b117f198c01137",
"assets/google_fonts/OpenSans-Italic-VariableFont_wdth,wght.ttf": "8813083d80a30128eb9dd1b5a342c629",
"assets/google_fonts/README.txt": "64ad77ca131eb14adb5e26101e4eea26",
"assets/google_fonts/LICENSE.txt": "d273d63619c9aeaf15cdaf76422c4f87",
"assets/google_fonts/OpenSans-VariableFont_wdth,wght.ttf": "fad3454a861bdaf75e6abfc2c9de46c5",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
