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

        

    }


}
