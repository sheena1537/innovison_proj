sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	'sap/ui/Device'

], function (Controller, JSONModel, formatter, Filter, FilterOperator, Sorter, Device) {
	"use strict";

	return Controller.extend("com.sap.innovision.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.innovision.view.Master
		 */
		formatter: formatter,
		onInit: function () {
			console.log(this.createId("list"));
			this._mViewSettingsDialogs = {};
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			var oList = this.byId("list");
			$.ajax({
				type: "GET",
				dataType: "json",
				url: "http://127.0.0.1:3005/output",
				cors: true,
				secure: true,
				async: false,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
					var oModel = new JSONModel();
					oModel.setData(data.robot.suite);
					oList.setModel(oModel);
				}
			});
		},

		onSelectionChange: function (oEvent) {
			var evnt = (oEvent.getParameter("listItem") || oEvent.getSource());
			var botname = evnt.getBindingContext().getProperty("_attributes/source");
			var system_name = evnt.getBindingContext().getProperty("_attributes/name");
			system_name = (system_name.split('-'))[0];
			botname = (botname.split('\\')).slice(-2, -1);
			var oR = sap.ui.core.UIComponent.getRouterFor(this);
			var oModel = this.getView().getModel("app");
			oModel.setProperty("/layout", "TwoColumnsMidExpanded");
			oR.navTo("Detail_r", {
				"botid": botname[0],
				"sysid": system_name
			});
		},

		onSearch: function (evt) {
			// create model filter
			var filters = [];
			var query = evt.getParameter("query");
			if (query && query.length > 0) {
				var filter = new sap.ui.model.Filter("_attributes/source", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("list");

			var binding = list.getBinding("items");
			binding.filter(filters);
		},

		onSort: function (evt) {
			this.createViewSettingsDialog("com.sap.innovision.view.SortingDialog").open();
			// var oView = this.getView();
			// var oList = this.byId("list");
			// var oBinding = oList.getBinding("items");

			// var SORTKEY = "status/_attributes/starttime";
			// var DESCENDING = false;
			// var GROUP = false;
			// var aSorter = [];

			// aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			// oBinding.sort(aSorter);

			// var oModel = this.getView().getModel();
			// oModel.refresh();

		},
		createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},
		handleFilterButtonPressed: function () {
			this.createViewSettingsDialog("com.sap.innovision.view.FilterDialog").open();
		},
		handleFilterDialogConfirm: function (oEvent) {
			var mParams = oEvent.getParameters(),
				aFilters = [];
			// 	console.log(oEvent);
			// console.log(mParams);
			mParams.filterItems.forEach(function (oItem) {
				// console.log(oItem.oParent.getId());
				var ParentKey = oItem.getParent().getKey();
				var aSplit = oItem.getKey(),
					sPath = aSplit,
					oFilter;
				if (ParentKey === "STATUS")
					oFilter = new sap.ui.model.Filter("status/_attributes/status", sap.ui.model.FilterOperator.Contains, sPath);
				else if (ParentKey === "SYSTEM")
					oFilter = new sap.ui.model.Filter("_attributes/name", sap.ui.model.FilterOperator.Contains, sPath);
				aFilters.push(oFilter);
			});

			var list = this.getView().byId("list");

			var binding = list.getBinding("items");
			binding.filter(aFilters);

			// apply filter settings
		},
		handleSortingDialogConfirm: function (oEvent) {
		//	var oView = this.getView();
			var oList = this.byId("list");
			var oBinding = oList.getBinding("items");

			var mParams = oEvent.getParameters();
			var aSorter = [];
			// 	console.log(oEvent);
			// console.log(mParams);
			mParams.filterItems.forEach(function (oItem) {
				// console.log(oItem.oParent.getId());
				var ParentKey = oItem.getParent().getKey();
				var aSplit = oItem.getKey(),
					sOrder = aSplit;
				if (ParentKey === "STARTTIME") {
					var SORTKEY = "status/_attributes/starttime";
					var DESCENDING;
					if(sOrder==="ACSENDING")
						DESCENDING=false;
					else
						DESCENDING=true;
					var GROUP = false;
					aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
				} 
			});
			oBinding.sort(aSorter);

			var oModel = this.getView().getModel();
			oModel.refresh();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.sap.innovision.view.Master
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.sap.innovision.view.Master
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.sap.innovision.view.Master
		 */
		//	onExit: function() {
		//
		//	}

	});

});