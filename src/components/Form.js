import React from "react";
import { nanoid } from "nanoid";
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from "valid-url";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "bootstrap";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      longURL: "",
      preferredAlias: "",
      generatedURL: "",
      loading: false,
      errors: [],
      errorMessage: {},
      toolTipMessage: "Copy to Clip Board",
    };
  }
  // When user clicks submit, this will be called
  onSubmit = async (event) => {
    event.preventDefault(); // Prevents page from reloading when submit is clicked
    this.setState({
      loading: true,
      generatedURL: "",
    });

    //Validate the input the user has submitted
    var isFormValid = await this.validateInput();
    if (!isFormValid) {
      return;
    }

    // if the user has put in a preferred alias then we use it, if not
    // we generate one. Change generated link URL to mine.

    var generatedKey = nanoid(5);
    var generatedURL = "tinyLink.com/" + generatedKey;

    if (this.state.preferredAlias !== "") {
      generatedKey = this.state.preferredAlias;
      generatedURL = "tinyLink.com/" + this.state.preferredAlias;
    }

    const db = getDatabase();

    set(ref(db, "/" + generatedKey), {
      generatedKey: generatedKey,
      longURL: this.state.longURL,
      preferredAlias: this.state.preferredAlias,
      generatedURL: generatedURL,
    })
      .then((result) => {
        this.setState({
          generatedURL: generatedURL,
          loading: false,
        });
      })
      .catch((e) => {});
  };

  // check if field has error
  hasError = (key) => {
    return this.state.errors.indexOf(key) !== -1;
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  validateInput = async () => {
    var errors = [];
    var errorMessages = this.state.errorMessage;

    //Validate Long URL
    if (this.state.longURL.length === 0) {
      errors.push("longURL");
      errorMessages["longURL"] = "Please enter your URL!";
    } else if (!isWebUri(this.state.longURL)) {
      errors.push("longURL");
      errorMessages["longURL"] =
        "Please put a URL in the form of https://www.....";
    }

    // Preferred Alias
    if (this.state.preferredAlias !== "") {
      if (this.state.preferredAlias.length > 7) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "Please Enter an Alias less than 7 Characters";
      } else if (this.state.preferredAlias.indexOf(" ") >= 0) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] = "Spaces are not allowed in URLs";
      }

      var keyExists = await this.checkKeyExists();

      if (keyExists.exists()) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "The Alias you have entered already exists! Please enter another one";
      }
    }

    this.setState({
      errors: errors,
      errorMessages: errorMessages,
      loading: false,
    });

    if (errors.length > 0) {
      return false;
    }

    return true;
  };

  checkKeyExists = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${this.state.preferredAlias}`)).catch((error) => {
      return false;
    });
  };

  copyToClipboard = () => {
    navigator.clipboard.writeText(this.state.generatedURL);
    this.setState({
      toolTipMessage: "Copied!",
    });
  };

  render() {
    return (
      <div className="container">
        <form autoComplete="off">
          <h3>Mini Link isfs</h3>

          <div className="form-group">
            <label>Enter Your Long URL </label>
            <input
              id="longURL"
              onChange={this.handleChange}
              value={this.state.longURL}
              type="url"
              required
              className={
                this.hasError("longURL")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              placeholder="https://www..."
            />
          </div>
          <div
            className={
              this.hasError("longURL") ? "text-danger" : "visually-hidden"
            }
          >
            {this.state.errorMessage.longURL}
          </div>

          <div className="form-group">
            <label htmlFor="basic-url">Your Mini URL</label>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">minilinkit.com</span>
              </div>
              <input
                id="preferredAlias"
                onChange={this.handleChange}
                value={this.state.preferredAlias}
                className={
                  this.hasError("preferredAlias")
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
                placeholder="eg. 3fwias (Optional)"
              />
            </div>
            <div
              className={
                this.hasError("preferredAlias")
                  ? "text-danger"
                  : "visually-hidden"
              }
            >
              {this.state.errorMessage.suggestedAlias}
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="button"
            onClick={this.onSubmit}
          >
            {this.state.loading ? (
              <div>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </div>
            ) : (
              <div>
                <span
                  className="visually-hidden spinner-border spinnder-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Mini-Link It</span>
              </div>
            )}
          </button>
        </form>
      </div>
    );
  }
}
