import QtQuick 2.2
import QtWebSockets 1.0
import QtQuick.Controls 2.5
import QtQuick 2.5
import QtQuick.Window 2.2
Rectangle {
    width: 360
    height: 360

    Component.onCompleted: {
    }

    WebSocket {
        id: socket
        url: "ws://192.168.3.1:80/"
        active: true
        onTextMessageReceived: {
            messageBox.text = messageBox.text + "\nReceived message: " + message
        }
        onStatusChanged: if (socket.status == WebSocket.Error) {
                             console.log("Error: " + socket.errorString)
                         } else if (socket.status == WebSocket.Open) {
                             socket.sendTextMessage("Hello World")
                         } else if (socket.status == WebSocket.Closed) {
                             messageBox.text += "\nSocket closed"
                         }

    }


    Text {
        id: messageBox
        color:  socket.status == WebSocket.Open ? "green":"red"
        text: socket.status == WebSocket.Open ? qsTr("Connected") : qsTr("Welcome!")
        anchors.centerIn: parent
    }
    Row{
        TextField{
            id:tf
            width: 200
            height: 40

        }
        Button{
             text: "Send"
             onClicked: {
                 if(socket.status == WebSocket.Closed)
                 {
                     socket.active = !socket.active
                 }
                 else{
                     socket.sendTextMessage(tf.text)
                        tf.text=""
                 }
             }
        }
    }

//    MouseArea {
//        anchors.fill: parent
//        onClicked: {
//            socket.active = !socket.active
//            secureWebSocket.active =  !secureWebSocket.active;
//            //Qt.quit();
//        }
//    }
}
