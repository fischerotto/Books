sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageToast",
  ],
  function (Controller, ResourceModel, MessageToast) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.BookList", {
      onInit: function () {
        // set Book model on view
        var oViewModel = new sap.ui.model.json.JSONModel({
          Isbn: null,
          Title: null,
          Author: null,
          Language: null,
          PublishDate: null,
          AvailableBookNr: null,
          TotalBookNr: null,
        });
        this.getView().setModel(oViewModel, "view");

        // set edit model on view
        var isEditingModel = new sap.ui.model.json.JSONModel({
          isEditLive: false,
        });

        this.getView().setModel(isEditingModel, "editModel");

        // set i18n model on view
        var i18nModel = new ResourceModel({
          bundleName: "org.ubb.books.i18n.i18n",
        });
        this.getView().setModel(i18nModel, "i18n");
      },
      deleteBook: function (oEvent) {
        var oButton = oEvent.getSource();
        var oRow = oButton.getParent();
        var selectedIsbn = oRow.getCells()[0].mProperties.text;

        var current = this;
        var oModel = this.getView().getModel();
        oModel.remove("/Books('" + selectedIsbn + "')", {
          method: "DELETE",
          success: function (data) {
            MessageToast.show(
              current
                .getView()
                .getModel("i18n")
                .getResourceBundle()
                .getText("deleteBookSuccessMsg")
            );
          },
          error: function (e) {
            MessageToast.show(
              current
                .getView()
                .getModel("i18n")
                .getResourceBundle()
                .getText("requestErrorMsg")
            );
          },
        });
      },
      addBook: function () {
        // GET INPUT DATA
        var oViewModel = this.getView().getModel("view");
        var book = {
          Isbn: oViewModel.oData.Isbn,
          Title: oViewModel.oData.Title,
          Author: oViewModel.oData.Author,
          Language: oViewModel.oData.Language,
          PublishDate: new Date(oViewModel.oData.PublishDate),
          AvailableBookNr: parseInt(oViewModel.oData.AvailableBookNr),
          TotalBookNr: parseInt(oViewModel.oData.TotalBookNr),
        };

        // Request
        var current = this;
        var oModel = this.getView().getModel();
        oModel.create("/Books", book, {
          method: "POST",
          success: function (data) {
            oViewModel.setProperty("/Isbn", null);
            oViewModel.setProperty("/Title", null);
            oViewModel.setProperty("/Author", null);
            oViewModel.setProperty("/PublishDate", null);
            oViewModel.setProperty("/Language", null);
            oViewModel.setProperty("/AvailableBookNr", null);
            oViewModel.setProperty("/TotalBookNr", null);
            MessageToast.show(
              current
                .getView()
                .getModel("i18n")
                .getResourceBundle()
                .getText("createBookSuccessMsg")
            );
          },
          error: function (e) {
            MessageToast.show(
              current
                .getView()
                .getModel("i18n")
                .getResourceBundle()
                .getText("requestErrorMsg")
            );
          },
        });
      },
      startBookEdit: function (oEvent) {
        var oViewModel = this.getView().getModel("view");
        var oButton = oEvent.getSource();
        var oRow = oButton.getParent();
        var bookDate = new Date(oRow.getCells()[2].mProperties.text);
        console.log(oRow.getCells()[0].mProperties);
        oViewModel.setProperty("/Isbn", oRow.getCells()[0].mProperties.text);
        oViewModel.setProperty("/Title", oRow.getCells()[0].mProperties.title);
        oViewModel.setProperty("/Author", oRow.getCells()[1].mProperties.text);
        oViewModel.setProperty(
          "/PublishDate",
          bookDate.getFullYear() +
            "-" +
            String(bookDate.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(bookDate.getDate()).padStart(2, "0")
        );
        oViewModel.setProperty(
          "/Language",
          oRow.getCells()[3].mProperties.text
        );
        oViewModel.setProperty(
          "/AvailableBookNr",
          oRow.getCells()[4].mProperties.text
        );
        oViewModel.setProperty(
          "/TotalBookNr",
          oRow.getCells()[5].mProperties.text
        );

        var oEditModel = this.getView().getModel("editModel");
        oEditModel.setProperty("/isEditLive", true);
      },

      editBook: function () {
        var oViewModel = this.getView().getModel("view");
        var book = {
          Isbn: oViewModel.oData.Isbn,
          Title: oViewModel.oData.Title,
          Author: oViewModel.oData.Author,
          Language: oViewModel.oData.Language,
          PublishDate: new Date(oViewModel.oData.PublishDate),
          AvailableBookNr: parseInt(oViewModel.oData.AvailableBookNr),
          TotalBookNr: parseInt(oViewModel.oData.TotalBookNr),
        };

        // Request
        var current = this;
        var oModel = this.getView().getModel();
        oModel.update("/Books('" + book.Isbn + "')", book, {
          method: "PATCH",
          success: function (data) {
            oViewModel.setProperty("/Isbn", null);
            oViewModel.setProperty("/Title", null);
            oViewModel.setProperty("/Author", null);
            oViewModel.setProperty("/PublishDate", null);
            oViewModel.setProperty("/Language", null);
            oViewModel.setProperty("/AvailableBookNr", null);
            oViewModel.setProperty("/TotalBookNr", null);
            MessageToast.show(
              current
                .getView()
                .getModel("i18n")
                .getResourceBundle()
                .getText("editBookSuccessMsg")
            );
          },
          error: function (e) {
            MessageToast.show(
              current
                .getView()
                .getModel("i18n")
                .getResourceBundle()
                .getText("requestErrorMsg")
            );
          },
        });
      },
    });
  }
);
