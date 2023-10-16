import React, { useState } from "react";
import { nanoid } from "nanoid";
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from "valid-url";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "bootstrap";

function Form() {
  const [longURL, setLongURL] = useState("");
  const [preferredAlias, setPreferredAlias] = useState("");
  const [generatedURL, setGeneratedURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  const [toolTipMessage, setToolTipMessage] = useState("Copy to Clipboard");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedURL("");

    const isFormValid = await validateInput();

    if (!isFormValid) {
      return;
    }

    let generatedKey = nanoid(5);
    let generatedURL = "tinyLink.com/" + generatedKey;

    if (preferredAlias !== "") {
      generatedKey = preferredAlias;
      generatedURL = "tinyLink.com/" + preferredAlias;
    }

    const db = getDatabase();

    set(ref(db, "/" + generatedKey), {
      generatedKey: generatedKey,
      longURL: longURL,
      preferredAlias: preferredAlias,
      generatedURL: generatedURL,
    })
      .then((result) => {
        setGeneratedURL(generatedURL);
        setLoading(false);
      })
      .catch((e) => {});
  };

  const hasError = (key) => {
    return errors.indexOf(key) !== -1;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "longURL") {
      setLongURL(value);
    } else if (id === "preferredAlias") {
      setPreferredAlias(value);
    }
  };

  const validateInput = async () => {
    let newErrors = [];
    let newErrorMessages = {};

    if (longURL.length === 0) {
      newErrors.push("longURL");
      newErrorMessages["longURL"] = "Please enter your URL!";
    } else if (!isWebUri(longURL)) {
      newErrors.push("longURL");
      newErrorMessages["longURL"] =
        "Please put a URL in the form of https://www.....";
    }

    if (preferredAlias !== "") {
      if (preferredAlias.length > 7) {
        newErrors.push("suggestedAlias");
        newErrorMessages["suggestedAlias"] =
          "Please Enter an Alias less than 7 Characters";
      } else if (preferredAlias.indexOf(" ") >= 0) {
        newErrors.push("suggestedAlias");
        newErrorMessages["suggestedAlias"] = "Spaces are not allowed in URLs";
      }

      const keyExists = await checkKeyExists();

      if (keyExists.exists()) {
        newErrors.push("suggestedAlias");
        newErrorMessages["suggestedAlias"] =
          "The Alias you have entered already exists! Please enter another one";
      }
    }

    setErrors(newErrors);
    setErrorMessage(newErrorMessages);
    setLoading(false);

    if (newErrors.length > 0) {
      return false;
    }

    return true;
  };

  const checkKeyExists = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${preferredAlias}`)).catch((error) => {
      return false;
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedURL);
    setToolTipMessage("Copied!");
  };

  return (
    <div className="container">
      <form autoComplete="off">
        <h3>Mini Link isfs</h3>

        <div className="form-group">
          <label>Enter Your Long URL</label>
          <input
            id="longURL"
            onChange={handleChange}
            value={longURL}
            type="url"
            required
            className={
              hasError("longURL")
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder="https://www..."
          />
        </div>
        <div
          className={
            hasError("longURL") ? "text-danger" : "visually-hidden"
          }
        >
          {errorMessage.longURL}
        </div>

        <div className="form-group">
          <label htmlFor="basic-url">Your Mini URL</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">minilinkit.com</span>
            </div>
            <input
              id="preferredAlias"
              onChange={handleChange}
              value={preferredAlias}
              className={
                hasError("preferredAlias")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              type="text"
              placeholder="eg. 3fwias (Optional)"
            />
          </div>
          <div
            className={
              hasError("preferredAlias")
                ? "text-danger"
                : "visually-hidden"
            }
          >
            {errorMessage.suggestedAlias}
          </div>
        </div>

        <button
          className="btn btn-primary"
          type="button"
          onClick={onSubmit}
        >
          {loading ? (
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

        {generatedURL === '' ? (
          <div></div>
        ) : (
          <div className="generatedurl">
            <span>Your generated URL is: </span>
            <div className="input-group mb-3">
              <input
                disabled
                type="text"
                value={generatedURL}
                className="form-control"
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
              <div className="input-group-append">
                <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`tooltip-${'top'}`}>
                      {toolTipMessage}
                    </Tooltip>
                  }
                >
                  <button onClick={() => copyToClipboard()} data-toggle="tooltip" data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary" type="button" >Copy</button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Form;
