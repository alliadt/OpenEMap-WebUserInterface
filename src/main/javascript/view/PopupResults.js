/*    
    Copyright (C) 2014 Härnösands kommun

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @class OpenEMap.view.PopupResults
 * @author Anders Erlandsson, Sundsvalls kommun 
 * 
 * Holds the definition for popup window that shows when a feature in a popup layer is
 * selected
 */
Ext.define('OpenEMap.view.PopupResults', {
    extend : 'GeoExt.window.Popup',
    autoScroll : true,
    layout: {
        type: 'vbox',
        pack:'start',
        align: 'stretch'
    },
    popup: null,
	 /** 
	 * Creates a new popup window for a popup layer
	 * @param {Object} [config] Configuration of the popup behaviour   
	 * @param {Number} [config.tolerance=3] Tolerance to use when identifying in map. Radius in image pixels.
	 * @param {OpenLayers.Feature.Vector} [config.location] Where to anchor the popup
	 * @param {String} [config.icon] Path to image that should be used as icon in the header of the popup
	 * @param {String} [config.title] Title in the popup header
	 * @param {String} [config.popupText] Text to show in the body of the popup. Can be formatted as HTML. Must be URLEncoded
	 * @param {OpenEMap.view.Map} [config.mapPanel] 
	 * @param {OpenLayers.Feature.Vector} [feature] Feature that this popup is connected to
	 */
   constructor: function(config) {
        if (this.popup) {
            this.popup.destroy();
        }
	    this.popup = Ext.create('GeoExt.window.Popup', {
            ancCls: 'oep-popup-anc',
            popupCls: 'oep-popup',
            bodyCls: 'oep-popup-body',
            anchored: true,
            anchorPosition: 'bottom-left',
            animCollapse: true,
            collapsible: false,
            draggable: false,
			feature: config.feature,
		    html: config.popupText,
			icon: config.icon,
            layout: 'fit',
		    location: config.location,
            map: config.mapPanel,
            maxWidth: 300,
            maximizable : false,
            minimizable : false,
            resizable: false,
			title: config.title,
            unpinnable: false,
            listeners : {
                beforeclose : function(){
			        if (this) {
			            this.destroy();
			        }
		            // Unhiglight feature
		    		this.feature.renderIntent = 'default';
		    		this.feature.layer.drawFeature(this.feature);
			    	// Fire action "popupfeatureunselected" on the feature including layer and featureid
			    	map.events.triggerEvent("popupfeatureunselected",{layer: this.feature.layer, featureid: this.feature.attributes[this.feature.layer.idAttribute]});
                }
            }
		});
		return this.popup;
    }
});