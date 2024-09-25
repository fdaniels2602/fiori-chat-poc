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
            },

            onPost: function (oEvent) {
                // Assume "myList" is the ID of your sap.m.List control
                var oList = this.getView().byId("HomeList");

                // Get the number of items in the list
                var itemCount = oList.getItems().length;

                // Scroll to the last item (index is zero-based, so we subtract 1)
                if (itemCount > 0) {
                    oList.scrollToIndex(itemCount - 1);
                }

            }

        });
    });
