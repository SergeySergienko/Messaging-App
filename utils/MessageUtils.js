import PropTypes from "prop-types";

export const MessageShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["text", "image", "location"]),
  text: PropTypes.string,
  uri: PropTypes.string,
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  })
});

let messageId = 0;

function getNextId() {
  return ++messageId;
}
export function createTextMessage(text) {
  return {
    type: "text",
    id: getNextId(),
    text
  };
}

export const createImageMessage = uri => ({
  type: "image",
  id: getNextId(),
  uri
});

export const createLocationMessage = coordinate => ({
  type: "location",
  id: getNextId(),
  coordinate
});
