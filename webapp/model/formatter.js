sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sStatus value to be formatted
		 * @returns {string} formatted status
		 */
		status : function (sStatus) {
		var datime ="Last Run: "+sStatus.slice(6,8)+"/"+sStatus.slice(4,6)+"/"+sStatus.slice(0,4)+" "+sStatus.slice(9,21);
			return datime;
		// return sStatus;
		},
	
	
			status1 :  function (sStatus) {
			if (sStatus === "PASS") {
					return "Success";
				} else if (sStatus === "RUNNING") {
					return "Warning";
				} else if (sStatus === "FAIL"){
					return "Error";
				} else {
					return "None";
				}
		}
	};
});