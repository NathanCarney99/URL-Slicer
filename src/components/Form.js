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
    onSubmit = async {event} => 
    {
        event.preventDefault(); // Prevents page from reloading when submit is clicked
        this.setState
        ({
            loading: true,
            generatedURL: ''
        });

        //Validate the input the user has submitted
        var isFormValid = await this.validateInput();
        if(!isFormValid) 
        {
            return 
        }

        // if the user has put in a preferred alias then we use it, if not
        // we generate one. Change generated link URL to mine. 

        var generatedKey = nanoid(5);
        var generatedURL = "tinyLink.com/" + generatedKey;

        if(this.state.preferredAlias !== '')
        {
          generatedKey = this.state.preferredAlias
          generatedURL = "tinyLink.com/" + this.state.preferredAlias;
        }

        const db = getDatabase();

        set(ref(db, '/' +generatedKey), {
          generatedKey: generatedKey,
          longURL: this.state.longURL,
          preferredAlias: this.state.preferredAlias,
          generatedURL: generatedURL
        }).then((result) => {
          this.setState({
            generatedURL: generatedURL,
            loading: false
          })
        }).catch((e) => {

        })
        
    }

    // check if field has error
    hasError = (key) => {
      return this.state.errors.indexOf(key) !== -1;
    }

    handleChange = (e) => {
      const {id, value} = e.target;
      this.setState(prevState => ({
        ...prevState,
        [id]: value
      }))
    }
    validateInput = async () => {
      var errors = [];
      var errorMessages = this.state.errorMessage

      //Validate Long URL
      if(this.state.longURL.length === 0) {
        errors.push("longURL");
        errorMessages['longURL'] = "Please enter your URL!";
      } else if (!isWebUri(this.state.longURL)) {
        errors.push("longURL");
        errorMessages['longURL'] = "Please put a URL in the form of https://www.....";
      }
    }

}
