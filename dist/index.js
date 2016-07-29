angular.module('ngPicstreet', []).service('$picstreet', function($rootScope, $timeout, $templateCache, $compile, Location) {
  var $picstreet, currentPosition, customer, map, monumentsOnMap, photographersOnMap;
  currentPosition = {};
  photographersOnMap = {};
  monumentsOnMap = {};
  customer = {};
  map = {};
  return $picstreet = {
    init: function(accessToken) {
      return mapboxgl.accessToken = accessToken;
    },
    createMap: function(opts) {
      return map = new mapboxgl.Map({
        container: opts.map || 'map',
        zoom: opts.zoom || 11,
        center: opts.center || {
          lat: 48.8534100,
          lng: 2.3488000
        },
        width: opts.width || '100vw',
        height: opts.height || '100vh',
        style: opts.style || 'mapbox://styles/pixer42/ciqozlkde003bcaneqk26ipny'
      });
    },
    createMarker: function(templateName, scope) {
      var element, marker, template;
      template = $templateCache.get(templateName + ".marker.html");
      element = $compile(template)(scope)[0];
      return marker = new mapboxgl.Marker(element);
    },
    createCustomer: function(opts) {
      var scope;
      scope = $rootScope.$new();
      customer = $picstreet.createMarker('me', scope);
      customer.setLngLat(opts.center);
      return customer.addTo(map);
    },
    updateCustomerPosition: function(position) {
      return customer.marker.setLngLat(position.coord);
    },
    createMonumentInBdd: function(monument) {
      return Location.create(monument).$promise.then(function(monument) {
        return $picstreet.createMonument(monument);
      })["catch"](function(err) {
        return console.log('err : ', err);
      });
    },
    updateMonumentInBdd: function(monument) {
      monumentsOnMap[monument.id].marker.remove();
      return Location.upsert(monument).$promise.then(function(monument) {
        return $picstreet.createMonument(monument);
      })["catch"](function(err) {
        return console.log('err : ', err);
      });
    },
    deleteMonumentInBdd: function(monument) {
      monumentsOnMap[monument.id].marker.remove();
      return Location.deleteById({
        id: monument.id
      }).$promise.then(function(monument) {
        return console.log('success delete');
      })["catch"](function(err) {
        return console.log('err : ', err);
      });
    },
    createMonuments: function(monuments) {
      var i, len, monument, results;
      results = [];
      for (i = 0, len = monuments.length; i < len; i++) {
        monument = monuments[i];
        results.push($picstreet.createMonument(monument));
      }
      return results;
    },
    createMonument: function(opts) {
      var monument, scope;
      scope = $rootScope.$new();
      scope.monument = opts;
      scope.api = __API_URL__;
      scope.onClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return $rootScope.$broadcast('monument:click', opts);
      };
      monument = $picstreet.createMarker('monument', scope);
      monument.setLngLat({
        lat: opts.lat,
        lng: opts.lng
      });
      monumentsOnMap[opts.id] = {};
      monumentsOnMap[opts.id].marker = monument;
      return monument.addTo(map);
    },
    createPhotographer: function(photographer) {
      if (photographer.positions[0]) {
        return $picstreet.photographerAddToMap(photographer.id, photographer.positions[photographer.positions.length - 1]);
      }
    },
    createPhotographers: function(photographers) {
      var i, len, photographer, results;
      results = [];
      for (i = 0, len = photographers.length; i < len; i++) {
        photographer = photographers[i];
        results.push($picstreet.createPhotographer(photographer));
      }
      return results;
    },
    updatePhotographerPosition: function(opts) {
      return $picstreet.photographerAddToMap(opts.photographerId, opts.position);
    },
    watchPhotographer: function() {},
    photographerAssignPosition: function(photographerId, position) {
      var scope;
      if (position.available) {
        scope = $rootScope.$new();
        scope.onClick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          $picstreet.center(position.coord);
          return $rootScope.$broadcast('photographer:click', opts);
        };
        photographersOnMap[photographerId] = {
          photographer: {
            id: photographerId,
            positions: [position]
          },
          marker: $picstreet.createMarker('photographer', scope)
        };
        photographersOnMap[photographerId].marker.setLngLat(position.coord).addTo(map);
      }
    },
    photographerUpdatePosition: function(photographerId, position) {
      if (position.available) {
        photographersOnMap[photographerId].photographer.positions.push(position);
        photographersOnMap[photographerId].marker.setLngLat(position.coord);
      } else {
        photographersOnMap[photographerId].marker.remove();
        photographersOnMap[photographerId] = void 0;
      }
    },
    photographerIsAlreadyAvailable: function(photographerId) {
      if (!photographersOnMap[photographerId]) {
        return false;
      }
      if (!photographersOnMap[photographerId].photographer) {
        return false;
      }
      if (!photographersOnMap[photographerId].photographer.positions[photographersOnMap[photographerId].photographer.positions.length - 1]) {
        return false;
      }
      if (!photographersOnMap[photographerId].photographer.positions[photographersOnMap[photographerId].photographer.positions.length - 1].available) {
        return false;
      }
      return true;
    },
    photographerAddToMap: function(photographerId, position) {
      if ($picstreet.photographerIsAlreadyAvailable(photographerId)) {
        return $picstreet.photographerUpdatePosition(photographerId, position);
      } else {
        return $picstreet.photographerAssignPosition(photographerId, position);
      }
    },
    center: function(location, zoom) {
      if (location == null) {
        location = currentPosition;
      }
      if (zoom == null) {
        zoom = 15;
      }
      return setTimeout(function() {
        return ionic.requestAnimationFrame(function() {
          return map.flyTo({
            center: {
              lat: location.lat,
              lng: location.lng
            },
            zoom: zoom,
            speed: 2,
            curve: 1
          });
        });
      }, 100);
    },
    setCurrentPosition: function(coord) {
      return currentPosition = coord;
    },
    getCurrentPosition: function() {
      return currentPosition;
    },
    goTo: function(opts) {
      return window.open("http://maps.apple.com/?daddr=" + opts.lat + "," + opts.lng + "&dirflg=w", '_system');
    }
  };
});

angular.module('ngPicstreet.directives', []);

angular.module("ngPicstreet").run(["$templateCache", function($templateCache) {$templateCache.put("location-bar.svg","<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg width=\"3px\" height=\"57px\" viewBox=\"0 0 3 57\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <!-- Generator: Sketch 3.1.1 (8761) - http://www.bohemiancoding.com/sketch -->\n    <title>Line</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Artboard-15\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-187.000000, -376.000000)\" stroke=\"#000000\" stroke-width=\"3\" stroke-linecap=\"square\">\n            <path d=\"M188.5,431.5 L188.5,378.490567\" id=\"Line\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n    </g>\n</svg>");
$templateCache.put("location.svg","<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg width=\"21px\" height=\"21px\" viewBox=\"0 0 21 21\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <!-- Generator: Sketch 3.1.1 (8761) - http://www.bohemiancoding.com/sketch -->\n    <title>Oval 11</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Artboard-15\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-178.000000, -367.000000)\" stroke=\"#00DFFF\" stroke-width=\"3\" fill=\"#000000\">\n            <g id=\"position-2\" sketch:type=\"MSLayerGroup\" transform=\"translate(171.000000, 369.000000)\">\n                <circle id=\"Oval-11\" sketch:type=\"MSShapeGroup\" cx=\"17.5\" cy=\"8.5\" r=\"8.5\"></circle>\n            </g>\n        </g>\n    </g>\n</svg>");
$templateCache.put("photographe-bar.svg","<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg width=\"3px\" height=\"36px\" viewBox=\"0 0 3 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <!-- Generator: Sketch 3.1.1 (8761) - http://www.bohemiancoding.com/sketch -->\n    <title>Line</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Artboard-22\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-303.000000, -449.000000)\" stroke-linecap=\"square\" stroke=\"#000000\" stroke-width=\"3\">\n            <g id=\"PHOTOGRAPHER-2\" sketch:type=\"MSLayerGroup\" transform=\"translate(279.000000, 410.000000)\">\n                <path d=\"M25.5,40.5 L25.5,73.5\" id=\"Line\" sketch:type=\"MSShapeGroup\"></path>\n            </g>\n        </g>\n    </g>\n</svg>");
$templateCache.put("photographer-location.svg","<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg width=\"21px\" height=\"21px\" viewBox=\"0 0 21 21\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <!-- Generator: Sketch 3.1.1 (8761) - http://www.bohemiancoding.com/sketch -->\n    <title>Oval 11</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Artboard-15\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-178.000000, -367.000000)\" stroke=\"#00A185\" stroke-width=\"3\" fill=\"#000000\">\n            <g id=\"position-2\" sketch:type=\"MSLayerGroup\" transform=\"translate(171.000000, 369.000000)\">\n                <circle id=\"Oval-11\" sketch:type=\"MSShapeGroup\" cx=\"17.5\" cy=\"8.5\" r=\"8.5\"></circle>\n            </g>\n        </g>\n    </g>\n</svg>");
$templateCache.put("photographer.svg","<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg width=\"49px\" height=\"49px\" viewBox=\"0 0 49 49\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n    <!-- Generator: Sketch 3.1.1 (8761) - http://www.bohemiancoding.com/sketch -->\n    <title>Rectangle 63 + 1465658172_Photo_equipment_1 2</title>\n    <desc>Created with Sketch.</desc>\n    <defs></defs>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Artboard-22\" sketch:type=\"MSArtboardGroup\" transform=\"translate(-279.000000, -277.000000)\">\n            <g id=\"PHOTOGRAPHER-3\" sketch:type=\"MSLayerGroup\" transform=\"translate(279.000000, 277.000000)\">\n                <g id=\"Rectangle-63-+-1465658172_Photo_equipment_1-2\" sketch:type=\"MSShapeGroup\">\n                    <rect id=\"Rectangle-63\" fill=\"#000000\" x=\"0\" y=\"0\" width=\"49\" height=\"49\" rx=\"8\"></rect>\n                    <g id=\"1465658172_Photo_equipment_1-2\" transform=\"translate(15.895855, 8.934932)\" fill=\"#FFFFFF\">\n                        <g id=\"Group\">\n                            <path d=\"M17.1374496,30.3550673 L12.6347458,16.4992166 C12.5341783,16.2123762 12.1610583,15.4189465 11.097569,15.4189465 L10.1900323,15.4189465 C9.30047139,15.4189465 9.33982389,14.7412252 9.33982389,14.7412252 C9.33982389,14.2429007 9.83731727,14.1937976 10.0059015,14.1903944 L11.3103641,14.1903944 C11.984215,14.1903944 12.1187908,13.8559093 12.1421108,13.6507454 L12.1421108,13.3935614 C12.1372525,13.2384731 12.060005,12.7595955 11.2331166,12.7595955 L5.82336192,12.7595955 C4.95420601,12.7595955 4.99307268,13.4562774 4.99307268,13.4562774 L4.99307268,13.4903093 C4.99695935,13.6337295 5.06643352,14.1903944 5.89137859,14.1903944 L7.19584121,14.1903944 C7.19584121,14.1903944 7.79438792,14.1811571 7.79438792,14.7708816 L7.79438792,14.8146369 C7.79098709,14.9585433 7.72102708,15.4184603 6.94466535,15.4184603 L6.07453777,15.4184603 C4.85315267,15.3990135 4.50918264,16.4690741 4.5057818,16.4778251 L0.0453455809,30.2038684 C0.0400014137,30.2233152 -0.207773608,31.0498045 0.470935618,31.0498045 L0.940736492,31.0498045 C1.07725567,31.0395949 1.31385652,30.9725034 1.41928237,30.6467694 L5.53331939,17.988356 C5.6105669,17.7642315 5.95356526,16.9717741 6.94369368,16.9746911 C7.08021286,16.9776081 7.79390209,17.0490751 7.79390209,18.2119942 L7.79390209,25.2794504 C7.79390209,26.1628217 8.32200297,26.2513046 8.50273299,26.2556802 L8.54888716,26.2556802 C8.72135801,26.2513046 9.33933806,26.1618493 9.33933806,25.0961643 L9.33933806,18.0005102 C9.33933806,17.1079017 9.97043561,16.9975411 10.1555381,16.9839283 C11.0893099,17.031573 11.4522274,17.6106017 11.5741716,17.9091102 L15.6886944,30.5680098 C15.8325011,31.0094524 16.1818153,31.0468875 16.2784962,31.0498045 L16.5665954,31.0498045 C17.2317012,31.0551524 17.1967212,30.5894013 17.1374496,30.3550673 L17.1374496,30.3550673 Z\" id=\"Shape\"></path>\n                            <path d=\"M14.8700652,2.35992876 L12.3762825,2.35992876 C11.2593516,2.35992876 11.062589,1.75221602 11.0339249,1.43863624 L11.0339249,1.25632241 C11.0339249,1.25632241 11.015949,-0.0174435064 9.38160556,-0.0174435064 L7.54418374,-0.0174435064 C6.06482111,-0.0174435064 6.12992278,1.19652348 6.12992278,1.19652348 C6.12992278,1.19652348 6.17170445,2.35992876 4.75161349,2.35992876 L2.15580577,2.35992876 C1.83564157,2.36624898 0.812962315,2.49362557 0.812962315,3.89574042 L0.812962315,9.76624556 C0.819278148,10.0739913 0.936849825,11.2155189 2.34139411,11.2155189 L14.8584052,11.2155189 C16.0856203,11.2155189 16.3154195,10.4279232 16.3503995,10.0020381 L16.3503995,3.88309999 C16.3503995,2.31909047 14.8700652,2.35992876 14.8700652,2.35992876 L14.8700652,2.35992876 Z M14.893871,8.88822218 C14.8700652,9.2436126 14.704396,9.90188705 13.7842276,9.90188705 L3.52245505,9.90188705 C2.37200162,9.90188705 2.27580661,8.99031793 2.26949078,8.75549772 L2.26949078,4.7052138 C2.27483494,4.48935423 2.36325662,3.64439043 3.41508588,3.64439043 L5.55080939,3.64439043 C7.16134704,3.64439043 7.29932371,1.9238341 7.29932371,1.9238341 L7.30272455,1.92577878 C7.40474956,1.34188837 7.9105021,1.28354794 8.05430878,1.28014475 L8.96378886,1.28014475 C8.96378886,1.28014475 9.71780226,1.26896284 9.8538356,1.98557771 L9.86160894,1.98168835 C9.86160894,1.98168835 9.89415977,3.64390426 11.5892324,3.64390426 L13.7584784,3.64390426 C13.990221,3.64925213 14.8943569,3.73190106 14.8943569,4.71834039 L14.8943569,8.88822218 L14.893871,8.88822218 Z\" id=\"Shape\"></path>\n                            <path d=\"M8.58192383,4.50442551 C7.40232039,4.50442551 6.44620031,5.46169463 6.44620031,6.6416297 C6.44620031,7.82156477 7.40280622,8.77932006 8.58192383,8.77932006 C9.7620131,8.77932006 10.7176473,7.82205094 10.7176473,6.6416297 C10.7176473,5.46120846 9.7620131,4.50442551 8.58192383,4.50442551 L8.58192383,4.50442551 Z M8.60718716,7.68106158 C8.03341794,7.68106158 7.56750374,7.21482436 7.56750374,6.63968502 C7.56750374,6.06454567 8.03341794,5.59879462 8.60718716,5.59879462 C9.18192805,5.59879462 9.64735642,6.06454567 9.64735642,6.63968502 C9.64735642,7.21433819 9.18192805,7.68106158 8.60718716,7.68106158 L8.60718716,7.68106158 Z\" id=\"Shape\"></path>\n                        </g>\n                    </g>\n                </g>\n            </g>\n        </g>\n    </g>\n</svg>");}]);
angular.module("ngPicstreet").run(["$templateCache", function($templateCache) {$templateCache.put("me.marker.html","\n<div id=\"me-marker\">\n  <div id=\"item-current-location\">\n    <div class=\"sonar-location\"><img src=\"location.svg\">\n      <div class=\"sonar-wave\"></div>\n    </div>\n  </div>\n</div>");
$templateCache.put("monument.marker.html","\n<div id=\"marker-monument\" ng-click=\"onClick($event)\">\n  <div id=\"item-reserve-free-shooting\"><img ng-src=\"{{api}}/api/Buckets/picstreet-location/download/{{monument.picture}}\">\n    <div class=\"name\">{{monument.name}}</div>\n  </div>\n  <div id=\"item-current-location-bar\"><img src=\"location-bar.svg\"></div>\n</div>");
$templateCache.put("photographer.marker.html","\n<div id=\"marker-photographer\" ng-click=\"onClick($event)\"><img src=\"photographer.svg\">\n  <div id=\"item-current-location-bar\"><img src=\"photographe-bar.svg\"></div>\n  <div id=\"item-current-location\">\n    <div class=\"sonar-location\"><img src=\"photographer-location.svg\">\n      <div class=\"sonar-wave\"></div>\n    </div>\n  </div>\n</div>");}]);