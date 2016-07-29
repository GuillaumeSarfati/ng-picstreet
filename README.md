

# NG PICSTREET


## BOWER SETUP

```sh
	bower install https://github.com/GuillaumeSarfati/ng-picstreet.git --save
```

## LESS SETUP

```less
	@import '@{bower-components}/ng-picstreet/src/directives/markers/monument/monument.marker.less';
	@import '@{bower-components}/ng-picstreet/src/directives/markers/photographer/photographer.marker.less';
```

## ANGULAR SETUP

```coffee
	angular.module 'picstreet', [

		...
		'ngPicstreet'
		...
	]
```

## HOW TO USE
```coffee
	angular.module "picstreet.xxx"

	.controller "xxxCtrl", ($picstreet, photographers, monuments)->
		
		# Authentification to Mapbox server
		$picstreet.init '<MAPBOX KEY>'
		
		# Render New Mapbox GL Map
		$picstreet.map = $picstreet.createMap
			center: 
				lat: 48.8534100
				lng: 2.3488000
			zoom: 11
		
		# Show Monuments from data in monuments
		$picstreet.createMonuments monuments

		# Show Photographers from data in photographers
		$picstreet.createMonuments monuments
```