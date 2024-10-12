sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "@langchain/openai",
    "@langchain/core/messages"
],
    function (Controller, openai, messages) {
        "use strict";

        return Controller.extend("za.co.fuad.chatapp.controller.Home", {

            _key: 0,

            _formatDate: function (date) {
                const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
                return date.toLocaleString('en-GB', options).replace(',', '');
            },

            getUniqueKey: function () {
                this._key++;
                return this._key;
            },

            _getBotResponse: async function (sPrompt) {

                //add an entry to the end of the List
                const oModel = this.oComponent.getModel();

                let oData = oModel.getData();

                oData.chat_history.push({
                    "role": "bot",
                    "message": "",
                    "timestamp": "",
                    "citation_count": 0
                });

                const oAiModel = new openai.ChatOpenAI({
                    modelName: 'gpt-3.5-turbo'
                });

                // stream the response from the bot
                const response = await oAiModel.stream([
                    new messages.HumanMessage(sPrompt),
                ]);
                this.oList.setBusy(false);

                // get the index of the last entry in the chat_history array
                const iLastIndex = oData.chat_history.length - 1;

                this._typewriter(oData, response, iLastIndex, oModel);

                this.oList.scrollToIndex(oData.chat_history.length - 1);
                this.oFeedInput.setEnabled(true);
            },

            _typewriter: async function (oData, response, iLastIndex, oModel) {

                for await (const chunk of response) {
                    oData.chat_history[iLastIndex].message += chunk.content;
                    oModel.setData(oData);
                    setTimeout(this._typewriter, 200);
                    this.oList.scrollToIndex(iLastIndex);
                };
            },

            onInit: function () {
                this.oFeedInput = this.getView().byId("FeedInput");
                this.oList = this.getView().byId("HomeList");
                this.oComponent = this.getOwnerComponent();
                //this.oList.setVisible(false);
            },

            onActionPressed: function (oEvent) {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                const sMessagePath = oEvent.getSource().getParent().getBindingContext().getPath();
                oRouter.navTo("citationsOverview", {
                    messagePath: encodeURIComponent(sMessagePath)
                });
            },

            onPost: async function (oEvent) {

                if (!this.oList.getVisible()) {
                    this.oList.setVisible(true);
                }
                // disable the list while we wait for the bot response
                this.oList.setBusyIndicatorDelay(10).setBusy(true);

                // disable feed input control
                this.oFeedInput.setEnabled(false);

                // get the default JSON model
                const oModel = this.oComponent.getModel();

                // get the value of the text of the feedinput UI control
                //const oFeedInput = this.getView().byId("FeedInput");
                const sValue = this.oFeedInput.getValue();

                // get current timestamp
                const now = new Date();
                const formattedDate = this._formatDate(now);

                // add a new entry to the end of the model
                let oData = oModel.getData();

                oData.chat_history.push({
                    "role": "human",
                    "message": sValue,
                    "timestamp": formattedDate,
                    "citation_count": 0
                });

                oModel.setData(oData);

                this.oList.scrollToIndex(oData.chat_history.length - 1);

                //simulate wait for bot to respond
                this._getBotResponse(sValue);

            }

        });
    });
