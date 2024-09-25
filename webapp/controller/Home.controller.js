sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("za.co.fuad.chatapp.controller.Home", {

            _addFact: function () {

                // get a reference to the facts model
                const oFactsModel = this.oComponent.getModel("facts");

                // get the array of facts from the facts model
                const aFacts = oFactsModel.getData().black_hole_facts;

                // randomly read one of the entries in the aFacts array
                const iRandomIndex = Math.floor(Math.random() * aFacts.length);
                const randomFact = aFacts[iRandomIndex].fact;

                // get the default JSON model
                const oModel = this.oComponent.getModel();
                let oData = oModel.getData();

                const now = new Date();
                const formattedDate = this._formatDate(now);

                oData.chat_history.push({
                    "role": "bot",
                    "message": randomFact,
                    "timestamp": formattedDate,
                    "citation_count": 0
                });

                // set the data of the model with the values from the aData array
                oModel.setData(oData);

                // scroll the list to the last entry
                this.oList.scrollToIndex(oData.chat_history.length - 1);

                // enable feed input control
                this.oFeedInput.setEnabled(true);
            },

            _delayBySeconds: async function (seconds) {

                var that = this;

                return new Promise(function (resolve, reject) {
                    setTimeout.call(this, function () {
                        that._addFact();
                    }, seconds * 1000);
                });
            },

            _formatDate: function (date) {
                const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
                return date.toLocaleString('en-GB', options).replace(',', '');
            },

            onInit: function () {
                this.oFeedInput = this.getView().byId("FeedInput");
                this.oList = this.getView().byId("HomeList");
                this.oComponent = this.getOwnerComponent();
            },

            onActionPressed: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const sMessagePath = oEvent.getSource().getParent().getBindingContext().getPath();
                oRouter.navTo("citations", {
                    messagePath: encodeURIComponent(sMessagePath)
                });
            },

            onPost: async function (oEvent) {

                // get the default JSON model
                const oModel = this.oComponent.getModel();

                // add a new entry to the end of the model
                let oData = oModel.getData();

                // get the value of the text of the feedinput UI control
                //const oFeedInput = this.getView().byId("FeedInput");
                const sValue = this.oFeedInput.getValue();

                // disable feed input control
                this.oFeedInput.setEnabled(false);

                // get current timestamp
                const now = new Date();
                const formattedDate = this._formatDate(now);

                oData.chat_history.push({
                    "role": "human",
                    "message": sValue,
                    "timestamp": formattedDate,
                    "citation_count": 0
                });

                oModel.setData(oData);

                this.oList.scrollToIndex(oData.chat_history.length - 1);

                //simulate wait for bot to respond
                await this._delayBySeconds(2);

            }

        });
    });
