import React from "react";
import {
  StyleSheet,
  Alert,
  View,
  Image,
  TouchableHighlight,
  BackHandler
} from "react-native";
import Status from "./components/Status";
import Toolbar from "./components/Toolbar";

import MessageList from "./components/MessageList";
import ImageGrid from "./components/ImageGrid";
import {
  createTextMessage,
  createImageMessage,
  createLocationMessage
} from "./utils/MessageUtils";

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage("https://unsplash.it/300/300"),
      createTextMessage("World"),
      createTextMessage("Hello"),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324
      })
    ],
    fullscreenImageId: null,
    isInputFocused: false,
    isIME: false
  };

  componentWillMount() {
    this.subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (this.state.fullscreenImageId) {
          this.dismissFullscreenImage();
          return true;
        }
        return false;
      }
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image) return null;
    const { uri } = image;
    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
      >
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  handlePressImage = uri => {
    const { messages } = this.state;
    this.setState({
      messages: [createImageMessage(uri), ...messages]
    });
  };

  handlePressToolbarCamera = () => {
    this.setState({ isIME: !this.state.isIME });
  };
  handlePressToolbarLocation = () => {
    const { messages } = this.state;
    // navigator.geolocation.getCurrentPosition(position => {
    //   const {
    //     coords: { latitude, longitude }
    //   } = position;
    //   this.setState({
    //     messages: [
    //       createLocationMessage({
    //         latitude: 38.78825,
    //         longitude: -122.4324
    //         // latitude,
    //         // longitude
    //       }),
    //       ...messages
    //     ]
    //   });
    // });
    this.setState({
      messages: [
        createLocationMessage({
          latitude: 49.9935,
          longitude: 36.2304
        }),
        ...messages
      ]
    });
  };
  handleChangeFocus = isFocused => {
    this.setState({ isInputFocused: isFocused });
  };
  handleSubmit = text => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages]
    });
  };

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case "text":
        Alert.alert(
          "Delete message?",
          "Are you sure you want to permanently delete this message?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                const { messages } = this.state;
                this.setState({
                  messages: messages.filter(message => message.id !== id)
                });
              }
            }
          ]
        );
        break;
      case "image":
        this.setState({ fullscreenImageId: id, isInputFocused: false });
        break;
      default:
        break;
    }
  };

  renderMessageList() {
    const { messages } = this.state;
    return (
      <View style={styles.content}>
        <MessageList
          messages={messages}
          onPressMessage={this.handlePressMessage}
        />
      </View>
    );
  }
  renderInputMethodEditor() {
    if (!this.state.isIME) return null;
    return (
      <View style={styles.inputMethodEditor}>
        <ImageGrid onPressImage={this.handlePressImage} />
      </View>
    );
  }
  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <Status />
        {this.renderMessageList()}
        {this.renderToolbar()}
        {this.renderInputMethodEditor()}
        {this.renderFullscreenImage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  content: {
    flex: 1,
    backgroundColor: "#fff"
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: "#fff"
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.4)",
    backgroundColor: "#fff"
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 2
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: "contain"
  }
});
