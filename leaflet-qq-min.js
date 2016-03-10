/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 * Author: Hu Chia Wei
 * Date: 2016.3.10
 * Email: Kenneth.hu@hotmail.com
 */
L.qq=L.Class.extend({includes:L.Mixin.Events,options:{minZoom:0,maxZoom:18,tileSize:256,subdomains:"kenneth",errorTileUrl:"",attribution:"",opacity:1,continuousWorld:!1,noWrap:!1},initialize:function(t,i){L.Util.setOptions(this,i),this._type="coordinate"},onAdd:function(t,i){this._map=t,this._insertAtTheBottom=i,this._initContainer(),this._initMapObject(),t.on("viewreset",this._resetCallback,this),this._limitedUpdate=L.Util.limitExecByInterval(this._update,150,this),t.on("move",this._update,this),this._reset(),this._update()},onRemove:function(t){this._map._container.removeChild(this._container),this._map.off("viewreset",this._resetCallback,this),this._map.off("move",this._update,this)},getAttribution:function(){return this.options.attribution},setOpacity:function(t){this.options.opacity=t,1>t&&L.DomUtil.setOpacity(this._container,t)},_initContainer:function(){var t=this._map._container,i=t.firstChild;this._container||(this._container=L.DomUtil.create("div","leaflet-qq-layer leaflet-top leaf-left"),this._container.id="_QMapContainer"),t.insertBefore(this._container,i),this.setOpacity(this.options.opacity);var e=this._map.getSize();this._container.style.width=e.x+"px",this._container.style.height=e.y+"px"},_initMapObject:function(){this._qq_center=new qq.maps.LatLng(0,0);var t=new qq.maps.Map(this._container,{center:this._qq_center,zoom:0,disableDefaultUI:!0,keyboardShortcuts:!1,draggable:!1,disableDoubleClickZoom:!0,scrollwheel:!1,streeViewControl:!1}),i=this;this._reposition=qq.maps.event.addListener(t,"center_changed",function(){i.onReposition()}),t.backgroundColor="#FBF8F8",this._qq=t},_resetCallback:function(t){this._reset(t.hard)},_reset:function(t){this._initContainer()},_update:function(){this._resize();var t=this._map.getBounds(),i=t.getNorthEast(),e=t.getSouthWest(),n=(new qq.maps.LatLngBounds(new qq.maps.LatLng(e.lat,e.lng),new qq.maps.LatLng(i.lat,i.lng)),this._map.getCenter()),s=new qq.maps.LatLng(n.lat,n.lng);this._qq.setCenter(s),this._qq.setZoom(this._map.getZoom()),qq.maps.event.trigger(this._qq,"resize")},_resize:function(){var t=this._map.getSize();(this._container.style.width!=t.x||this._container.style.height!=t.y)&&(this._container.style.width=t.x+"px",this._container.style.height=t.y+"px",qq.maps.event.trigger(this._qq,"resize"))},onReposition:function(){}});