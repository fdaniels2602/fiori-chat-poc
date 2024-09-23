sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("za.co.fuad.chatapp.controller.Home", {
            onInit: function () {

            },

            onActionPressed: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const sMessagePath = oEvent.getSource().getParent().getBindingContext().getPath();
                oRouter.navTo("citations", {
                    messagePath: encodeURIComponent(sMessagePath)
                });
            }

        });
    });
