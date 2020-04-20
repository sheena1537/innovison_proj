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
		},
	
	
			status1 :  function (sStatus) {
			console.log("AJHS");
		}
	};
});