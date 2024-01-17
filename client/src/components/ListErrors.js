import React from "react";

class ListErrors extends React.Component {
  render() {
    const errors = this.props.errors;
    if (errors) {
      if (typeof errors === "string") {
        return <p className="error-messages">{errors}</p>;
      }

      return (
        <ul className="error-messages">
          {Object.keys(errors).map((key) => {
            return <li key={key}>{errors[key]}</li>;
          })}
        </ul>
      );
    } else {
      return null;
    }
  }
}

export default ListErrors;
