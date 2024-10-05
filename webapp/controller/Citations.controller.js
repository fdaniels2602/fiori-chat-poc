sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("za.co.fuad.chatapp.controller.Citations", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("citations").attachMatched(this._citationRouteMatched, this);
            },

            _citationRouteMatched: function (oEvent) {
                const sMessagePath = decodeURIComponent(oEvent.getParameter("arguments").messagePath);
                this.getView().bindElement(sMessagePath);
            },

            onLinkPress: function (oEvent) {
                debugger;
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("pdf", {
                });
            }

        });
    });