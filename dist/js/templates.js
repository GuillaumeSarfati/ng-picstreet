angular.module("ngPicstreet").run(["$templateCache", function($templateCache) {$templateCache.put("me.marker.html","\n<div id=\"me-marker\">\n  <div id=\"item-current-location\">\n    <div class=\"sonar-location\"><img src=\"location.svg\">\n      <div class=\"sonar-wave\"></div>\n    </div>\n  </div>\n</div>");
$templateCache.put("monument.marker.html","\n<div id=\"marker-monument\" ng-click=\"onClick($event)\">\n  <div id=\"item-reserve-free-shooting\"><img ng-src=\"{{api}}/api/Buckets/picstreet-location/download/{{monument.picture}}\">\n    <div class=\"name\">{{monument.name}}</div>\n  </div>\n  <div id=\"item-current-location-bar\"><img src=\"lib/ng-picstreet/src/svg/location-bar.svg\"></div>\n</div>");
$templateCache.put("photographer.marker.html","\n<div id=\"marker-photographer\" ng-click=\"onClick($event)\"><img ng-src=\"lib/ng-picstreet/src/svg/photographer.svg\">\n  <div id=\"item-current-location-bar\"><img ng-src=\"lib/ng-picstreet/src/svg/photographe-bar.svg\"></div>\n  <div id=\"item-current-location\">\n    <div class=\"sonar-location\"><img ng-src=\"lib/ng-picstreet/src/svg/photographer-location.svg\">\n      <div class=\"sonar-wave\"></div>\n    </div>\n  </div>\n</div>");}]);