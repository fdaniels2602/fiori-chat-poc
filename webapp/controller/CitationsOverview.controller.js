sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/PDFViewer"
],
    function (Controller, PDFViewer) {
        "use strict";

        return Controller.extend("za.co.fuad.chatapp.controller.CitationsOverview", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("citationsOverview").attachMatched(this._citationRouteMatched, this);
            },

            _citationRouteMatched: function (oEvent) {
                const sMessagePath = decodeURIComponent(oEvent.getParameter("arguments").messagePath);
                this.getView().bindElement(sMessagePath);
            },

            onDocSelected: function (oEvent) {
                const oSelect = oEvent.getSource();
                const sKey = oSelect.getSelectedItem().getKey();
                const oPdf = this.getView().byId("pdfViewer");
                oPdf.setSource(sKey);
            },

            onLinkPress: function (oEvent) {
                debugger;
                const oContext = oEvent.getSource().getBindingContext();
                const sUrl = oContext.getProperty("url");
                const sSource = oContext.getProperty("source");

                if (!this._pdfViewer) {
                    this._pdfViewer = new PDFViewer({
                        width: "100%",
                        height: "100vh"
                    });
                    this.getView().addDependent(this._pdfViewer);
                }

                this._pdfViewer.setSource(sUrl);
                this._pdfViewer.setTitle(sSource);
                this._pdfViewer.open();

                //const sUrl = oLink.getText();
                //window.open(sUrl, "_blank");
            }

        });
    });