/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */
 L.qq = L.Class.extend({
	includes: L.Mixin.Events,
	
	options:{
		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,
		subdomains:'kenneth',
		errorTileUrl:'',
		attribution:'',
		opacity:1,
		continuousWorld:false,
		noWrap: false,
	},
	//possible types: 
	initialize: function(type,options){
		L.Util.setOptions(this, options);
		
		this._type ="coordinate";
	},
	onAdd: function(map, insertAtTheBottom){
		this._map=map;
		this._insertAtTheBottom = insertAtTheBottom;
		
		//create a container div for tileSize
		this._initContainer();
		this._initMapObject();
		
		//set up events
		map.on('viewreset', this._resetCallback, this);
		
		this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
		map.on('move', this._update, this);
		
		this._reset();
		this._update();
	},
	
	onRemove: function(map){
		this._map._container.removeChild(this._container);
		
		this._map.off('viewreset', this._resetCallback, this);
		
		this._map.off('move', this._update, this);
	},
	
	getAttribution: function(){
		return this.options.attribution;
	},
	
	setOpacity: function(opacity){
		this.options.opacity = opacity;
		if(opacity <1){
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},
	
	_initContainer: function(){
		var tilePane = this._map._container,
			first = tilePane.firstChild;
			
		if(!this._container){
			this._container = L.DomUtil.create('div', 'leaflet-qq-layer leaflet-top leaf-left');
			this._container.id = "_QMapContainer";
		}
		
		if(true){
			tilePane.insertBefore(this._container, first);
			
			this.setOpacity(this.options.opacity);
			var size = this._map.getSize();
			this._container.style.width = size.x +'px';
			this._container.style.height = size.y + 'px';
		}
	},
	
	
	_initMapObject: function(){
		this._qq_center = new qq.maps.LatLng(0, 0);
		var map = new qq.maps.Map(this._container,{
			center:this._qq_center,
			zoom:0,
			disableDefaultUI: true,
			keyboardShortcuts: false,
			draggable: false,
			disableDoubleClickZoom: true,
			scrollwheel: false,
			streeViewControl: false
		});
		
		var _this = this;
		this._reposition = qq.maps.event.addListener(map, "center_changed",
			function(){
				_this.onReposition();
			});
			
		map.backgroundColor = '#FBF8F8';
		this._qq = map;
	},
	
	_resetCallback: function(e){
		this._reset(e.hard);
	},
	
	_reset: function(clearOldContainer){
		this._initContainer();
	},
	
	_update:function(){
		this._resize();
		
		var bounds = this._map.getBounds();
		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();
		var qq_bounds = new qq.maps.LatLngBounds(
			new qq.maps.LatLng(sw.lat, sw.lng),
			new qq.maps.LatLng(ne.lat, ne.lng)
		);
		
		var center = this._map.getCenter();
		var _center = new qq.maps.LatLng(center.lat, center.lng);
		
		this._qq.setCenter(_center);
		this._qq.setZoom(this._map.getZoom());
		
		qq.maps.event.trigger(this._qq, 'resize');
	},
	
	_resize: function() {
		var size = this._map.getSize();
		if (this._container.style.width == size.x &&
		    this._container.style.height == size.y)
			return;
		this._container.style.width = size.x + 'px';
		this._container.style.height = size.y + 'px';
		qq.maps.event.trigger(this._qq, "resize");
	},

	onReposition: function() {
		//google.maps.event.trigger(this._google, "resize");
	}
	
	
 })