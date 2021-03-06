﻿/*    
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
 * @param {Object} [config] config object to set properties on cretaion
 * @param {number} config.zoom Set to a zoom level to override default zooming behaviour and always zoom to the desired level
 */
Ext.define('OpenEMap.view.SearchFastighet', {
    extend : 'Ext.form.Panel',
    requires : [
                'OpenEMap.form.SearchRegisterenhet',
                'OpenEMap.form.SearchAddress',
                'OpenEMap.form.SearchPlacename',
                'OpenEMap.form.SearchES',
                'GeoExt.selection.FeatureModel',
                'GeoExt.data.FeatureStore'],
    border: false,
    draggable: false,
    initComponent : function() {

        if (!this.renderTo) {
            this.title = 'Sök';
            this.bodyPadding = 5;
        }
        
        var selectedValue = '';
        var data = [];
        
        if (this.search && this.search.searchEstates) {
			data.push(['searchregisterenhet', 'Fastighet' ]);
			selectedValue = "searchregisterenhet";
		}
        if (this.search && this.search.searchAddresses) {
			data.push(['searchaddress', 'Adress']);
			selectedValue = selectedValue === "" ? "searchaddress" : selectedValue;
		}
        if (this.search && this.search.searchPlacenames) {
			data.push(['searchplacename', 'Ort']);
			selectedValue = selectedValue === "" ? "searchplacename" : selectedValue;
		}
		if (this.search && this.search.searchES && this.search.searchES.detaljplan) {
			data.push(['searches', 'Detaljplaner']);
			selectedValue = selectedValue === "" ? "searches" : selectedValue;
		}
//        data.push(['searchbyggnad', 'Byggnad']);

        var columns = [ {
            text : 'Namn',
            dataIndex : 'name',
            flex : 1
        } ];

        var store = Ext.create('GeoExt.data.FeatureStore', {
            layer : this.mapPanel.searchLayer,
            featureFilter: new OpenLayers.Filter.Function({
                evaluate: function(context) {
                    if (context.attributes.name) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }),
            fields : [ {
                name : 'name'
            }, {
                name : 'fid'
            }, {
                name : 'objid'
            } ]
        });
        
        // Creating selectControl to make it stopDown, which will make mousedown event available to other handlers too
        // thus making map panable even when grabbing inside a feature 
        var selectControl = new OpenLayers.Control.SelectFeature(this.mapPanel.searchLayer);
        selectControl.handlers.feature.stopDown = false;
        this.mapPanel.map.addControl(selectControl);
        var selectionModel = Ext.create('GeoExt.selection.FeatureModel', {selectControl: selectControl});
        
        var grid = Ext.create('Ext.grid.Panel', {
            columns : columns,
            store : store,
            selModel : selectionModel
        });
        
        function defSearchCombo(type) {
            var searchCriteria = null;
            if (type === 'searchregisterenhet'){
                searchCriteria = this.search && this.search.searchEstates ? this.search.searchEstates : null; 
            } else if (type === 'searchaddress'){
                searchCriteria = this.search && this.search.searchAddresses ? this.search.searchAddresses : null;
            } else {
                searchCriteria = this.search && this.search.searchPlacenames ? this.search.searchPlacenames : null;
            }

            return {
                xtype : type,
                mapPanel : this.mapPanel,
                basePath: this.basePath,
                search : searchCriteria,
                resultPanel : grid
            };
        }
        
        function onChange(combo, value) {
            var container = this.down('#search');
            this.mapPanel.searchLayer.destroyFeatures();
            container.removeAll();
            container.add(defSearchCombo.call(this,value));
        }

        this.items = [ {
            layout : 'column',
            border: false,
            items : [ {
                xtype : 'combo',
                width : 110,
                store : data,
                forceSelection : true,
                queryMode : 'local',
                value : selectedValue,
                border: false,
                listeners : {
                    change : onChange,
                    scope : this
                }
            }, {
                itemId : 'search',
                columnWidth : 1,
                layout : 'fit',
                border: false,
                items : defSearchCombo.call(this,selectedValue)
            } ]    
        } ];
        
        //if (!this.renderTo) {
        this.items.push(grid);
        //}

        this.callParent(arguments);
    }
});
