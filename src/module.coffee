angular.module 'ngPicstreet', []

.service '$picstreet', ($rootScope, $timeout, $templateCache, $compile, Location) ->
	
	currentPosition = {}

	photographersOnMap = {}
	monumentsOnMap = {}
	customer = {}
	map = {}

	return $picstreet =
		init: (accessToken) ->
			mapboxgl.accessToken = accessToken
		
		createMap: (opts) ->

			map = new mapboxgl.Map

				container: opts.map or 'map'
				zoom: opts.zoom or 11
				center: opts.center or lat: 48.8534100, lng: 2.3488000
				width: opts.width or '100vw'
				height: opts.height or '100vh'
				style: opts.style or 'mapbox://styles/pixer42/ciqozlkde003bcaneqk26ipny'
				interactive: opts.interactive

		createMarker: (templateName, scope) ->
			template = $templateCache.get "#{templateName}.marker.html"
			element = $compile(template)(scope)[0]
			marker = new mapboxgl.Marker element

		createCustomer: (opts) ->
			scope = $rootScope.$new()
			customer = $picstreet.createMarker 'me', scope
			customer.setLngLat(opts.center)
			customer.addTo(map);

		updateCustomerPosition: (position) ->
			customer.marker.setLngLat position.coord
			
		createMonumentInBdd: (monument) ->
			Location.create monument
			.$promise
			.then (monument) -> 
				$picstreet.createMonument monument
			.catch (err) -> console.log 'err : ', err

		updateMonumentInBdd: (monument) ->
			
			monumentsOnMap[monument.id].marker.remove()
			
			Location.upsert monument
			.$promise
			.then (monument) -> 
				$picstreet.createMonument monument
			.catch (err) -> console.log 'err : ', err

		deleteMonumentInBdd: (monument) ->
			
			monumentsOnMap[monument.id].marker.remove()
			
			Location.deleteById id: monument.id
			.$promise
			.then (monument) -> console.log 'success delete'
			.catch (err) -> console.log 'err : ', err

		createMonuments: (monuments) ->
			$picstreet.createMonument monument for monument in monuments

		createMonument: (opts) ->
			scope = $rootScope.$new()
			scope.monument = opts
			scope.api = __API_URL__
			scope.onClick = (e) ->
				e.preventDefault()
				e.stopPropagation()
				
				$rootScope.$broadcast 'monument:click', opts

			monument = $picstreet.createMarker 'monument', scope
			monument.setLngLat
				lat: opts.lat
				lng: opts.lng

			monumentsOnMap[opts.id] = {}
			monumentsOnMap[opts.id].marker = monument
			monument.addTo map

		createPhotographer: (photographer) ->
			if photographer.positions[0]
				$picstreet.photographerAddToMap photographer.id, photographer.positions[photographer.positions.length - 1]
				
		createPhotographers: (photographers) ->
			$picstreet.createPhotographer photographer for photographer in photographers

		updatePhotographerPosition: (opts) ->
			$picstreet.photographerAddToMap opts.photographerId, opts.position

		watchPhotographer: -> return


		photographerAssignPosition: (photographerId, position) ->
			if position.available

				scope = $rootScope.$new()
				
				scope.onClick = (e) ->
					e.preventDefault()
					e.stopPropagation()

					$picstreet.center position.coord
					$rootScope.$broadcast 'photographer:click', opts

				photographersOnMap[photographerId] =
					photographer:
						id: photographerId
						positions: [
							position
						]
					marker: $picstreet.createMarker 'photographer', scope
				
				photographersOnMap[photographerId]
				.marker
				.setLngLat(position.coord)
				.addTo(map)

			return

		photographerUpdatePosition: (photographerId, position) ->
			
			if position.available
				photographersOnMap[photographerId].photographer.positions.push position
				photographersOnMap[photographerId].marker.setLngLat position.coord
			
			else
				photographersOnMap[photographerId].marker.remove()
				photographersOnMap[photographerId] = undefined
			
			return

		photographerIsAlreadyAvailable: (photographerId) ->

			return false unless photographersOnMap[photographerId]
			return false unless photographersOnMap[photographerId].photographer
			return false unless photographersOnMap[photographerId].photographer.positions[photographersOnMap[photographerId].photographer.positions.length - 1]
			return false unless photographersOnMap[photographerId].photographer.positions[photographersOnMap[photographerId].photographer.positions.length - 1].available
			return true

		photographerAddToMap: (photographerId, position) ->

			if $picstreet.photographerIsAlreadyAvailable photographerId
				$picstreet.photographerUpdatePosition photographerId, position
			
			else
				$picstreet.photographerAssignPosition photographerId, position
		
		center: (location=currentPosition, zoom=15)->
			setTimeout ->

				ionic.requestAnimationFrame ->
					map.flyTo 
						center:
							lat: location.lat
							lng: location.lng
						zoom: zoom
						speed: 2
						curve: 1

			, 100
		setCurrentPosition: (coord) ->
			currentPosition = coord
		getCurrentPosition: ->
			currentPosition

		goTo: (opts)->
			window.open "http://maps.apple.com/?daddr=#{opts.lat},#{opts.lng}&dirflg=w", '_system'
		

