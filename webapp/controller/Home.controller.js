sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("za.co.fuad.chatapp.controller.Home", {

            _formatDate: function (date) {
                const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
                return date.toLocaleString('en-GB', options).replace(',', '');
            },

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

                // get the parent component for the current view
                const oComponent = this.getOwnerComponent();

                // get the default JSON model
                const oModel = oComponent.getModel();

                // add a new entry to the end of the model
                let oData = oModel.getData();

                // get the value of the text of the feedinput UI control
                const sValue = this.getView().byId("FeedInput").getValue();

                // get current timestamp
                const now = new Date();
                const formattedDate = this._formatDate(now);

                debugger;

                oData.chat_history.push({
                    "role": "human",
                    "message": sValue,
                    "timestamp": formattedDate,
                    "citation_count": 0
                });

                debugger;

                // get a reference to the facts model
                const oFactsModel = oComponent.getModel("facts");

                // get the array of facts from the facts model
                const aFacts = oFactsModel.getData().black_hole_facts;

                // randomly read one of the entries in the aFacts array
                const iRandomIndex = Math.floor(Math.random() * aFacts.length);
                const randomFact = aFacts[iRandomIndex].fact;

                oData.chat_history.push({
                    "role": "bot",
                    "message": randomFact,
                    "timestamp": formattedDate,
                    "citation_count": 0
                });

                // set the data of the model with the values from the aData array
                oModel.setData(oData);

                // scroll the list to the last entry
                oList.scrollToIndex(oData.chat_history.length - 1);


            }

        });
    });
