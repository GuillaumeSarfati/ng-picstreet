angular.module("ngPicstreet").run(["$templateCache", function($templateCache) {$templateCache.put("me.marker.html","\n<div id=\"me-marker\">\n  <div id=\"item-current-location\">\n    <div class=\"sonar-location\"><img src=\"location.svg\">\n      <div class=\"sonar-wave\"></div>\n    </div>\n  </div>\n</div>");
$templateCache.put("monument.marker.html","\n<div id=\"marker-monument\" ng-click=\"onClick($event)\">\n  <div id=\"item-reserve-free-shooting\"><img ng-src=\"{{api}}/api/Buckets/picstreet-location/download/{{monument.picture}}\">\n    <div class=\"name\">{{monument.name}}</div>\n  </div>\n  <div id=\"item-current-location-bar\"><img src=\"location-bar.svg\"></div>\n</div>");
$templateCache.put("photographer.marker.html","\n<div id=\"marker-photographer\" ng-click=\"onClick($event)\"><img src=\"photographer.svg\">\n  <div id=\"item-current-location-bar\"><img src=\"photographe-bar.svg\"></div>\n  <div id=\"item-current-location\">\n    <div class=\"sonar-location\"><img src=\"photographer-location.svg\">\n      <div class=\"sonar-wave\"></div>\n    </div>\n  </div>\n</div>");}]);