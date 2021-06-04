sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/json/JSONModel",
  ],
  function (
    Controller,
    ResourceModel,
    MessageToast,
    Sorter,
    Filter,
    FilterOperator
  ) {
    "use strict";

    return Controller.extend("org.ubb.books.controller.CheckedOutBooks", {
      onInit: function () {
        this._oGlobalFilter = null;
        this._oPriceFilter = null;

        // set i18n model on view
        var i18nModel = new ResourceModel({
          bundleName: "org.ubb.books.i18n.i18n",
        });
        this.getView().setModel(i18nModel, "i18n");
      },
      _filter: function () {
        var oFilter = null;

        if (this._oGlobalFilter && this._oPriceFilter) {
          oFilter = new Filter([this._oGlobalFilter, this._oPriceFilter], true);
        } else if (this._oGlobalFilter) {
          oFilter = this._oGlobalFilter;
        } else if (this._oPriceFilter) {
          oFilter = this._oPriceFilter;
        }

        this.byId("table").getBinding().filter(oFilter, "Application");
      },

      filterGlobally: function (oEvent) {
        var sQuery = oEvent.getParameter("query");
        this._oGlobalFilter = null;

        if (sQuery) {
          this._oGlobalFilter = new Filter(
            [new Filter("PublishDate", FilterOperator.Contains, sQuery)],
            false
          );
        }

        this._filter();
      },
      formatDate: function (date) {
        if (date != null)
          return (
            date.slice(6, 8) + "." + date.slice(4, 6) + "." + date.slice(0, 4)
          );
      },
      checkout: function (oEvent) {
        var oButton = oEvent.getSource();
        var oRow = oButton.getParent();
        var currentIsbn = oRow.getCells()[0].mProperties.text;

        var book = {
          Isbn: currentIsbn,
          Title: null,
          Author: null,
          Language: null,
          PublishDate: null,
          AvailableBookNr: null,
          TotalBookNr: null,
        };
        // request
        var oModel = this.getView().getModel();
        oModel.update("/CBooks('" + currentIsbn + "')", book, {
          method: "PATCH",
          success: function (data) {
            console.log("pina");
          },
          error: function (e) {
            console.log("csöcs");
          },
        });
      },
    });
  }
);
