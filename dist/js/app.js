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
