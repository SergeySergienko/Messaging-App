import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const ToolbarButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
);
ToolbarButton.propTypes = {
  title: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
};

const iconCamera = <Entypo name="camera" size={32} color="rgb(16,135,255)" />;
const iconLocation = <Entypo name="location-pin" size={32} color="red" />;

export default class Toolbar extends Component {
  state = {
    text: ""
  };
  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    onChangeFocus: PropTypes.func,
    onSubmit: PropTypes.func,
    onPressCamera: PropTypes.func,
    onPressLocation: PropTypes.func
  };
  static defaultProps = {
    onChangeFocus: () => {},
    onSubmit: () => {},
    onPressCamera: () => {},
    onPressLocation: () => {}
  };
  setInputRef = ref => {
    this.input = ref;
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.isFocused !== this.props.isFocused) {
      if (nextProps.isFocused) {
        this.input.focus();
      } else {
        this.input.blur();
      }
    }
  }
  handleFocus = () => {
    const { onChangeFocus } = this.props;
    onChangeFocus(true);
  };
  handleBlur = () => {
    const { onChangeFocus } = this.props;
    onChangeFocus(false);
  };

  handleChangeText = text => {
    this.setState({ text });
  };
  handleSubmitEditing = () => {
    const { text } = this.state;
    const { onSubmit } = this.props;

    if (!text) return;

    onSubmit(text);
    this.setState({ text: "" });
  };
  render() {
    const { onPressCamera, onPressLocation } = this.props;
    const { text } = this.state;
    return (
      <View style={styles.toolbar}>
        <ToolbarButton title={iconCamera} onPress={onPressCamera} />
        <ToolbarButton title={iconLocation} onPress={onPressLocation} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            underlineColorAndroid={"transparent"}
            placeholder={"Type something..."}
            blurOnSubmit={false}
            value={text}
            onChangeText={this.handleChangeText}
            onSubmitEditing={this.handleSubmitEditing}
            ref={this.setInputRef}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingLeft: 16,
    backgroundColor: "white"
  },
  button: {
    top: -2,
    marginRight: 16,
    fontSize: 28,
    color: "grey"
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)"
  },
  input: {
    flex: 1,
    fontSize: 18
  }
});
