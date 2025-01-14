const { Schema, model } = require("mongoose");

const messageSchema = Schema({
    conversationId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "ConversationModel",
    },
    senderId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "UserModel",
    },
    messageContent: {
        required: true,
        type: String,
        validate: {
            validator: function (value) {
                return value ? true : false;
            },
            message: "can't be empty",
        },
    },
    timeStamp: {
        type: Date,
        default: new Date.now(),
    },
    messageStatus: {
        type: Boolean,
        default: false,
    },
});

const MessageModel = model("MessageModel", messageSchema);

module.exports = MessageModel;