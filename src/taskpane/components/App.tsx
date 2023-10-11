import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";
import { OpenAiApi } from "../../services/openai";
import { useState } from "react";

/* global Word, require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  apiKey: string;
  levelOfFormat: string;
  wordCount: string;
} 

export default class App extends React.Component<AppProps, AppState> {


  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
      apiKey: "",
      levelOfFormat: "",
      wordCount: "",
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration",
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality",
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro",
        },
      ],
    });
  }

  convert = async () => {
    return Word.run(async (context) => {

      try {
        const words = context.document.getSelection();

        const word = words.load();
        await context.sync();
        const openai = new OpenAiApi(this.state.apiKey);
        const prompt= `Imagine you are a ${this.state.levelOfFormat} and explain: ${word.text.trim()}. Maximum word count limit is ${this.state.wordCount}`;
       
        const converted = await openai.generateText(prompt);

        words.insertText(converted, "Replace");

        await context.sync();
      } catch (e) {
        // insert a paragraph at the end of the document.
        const paragraph = context.document.body.insertParagraph(JSON.stringify(e), Word.InsertLocation.end);

        // change the paragraph color to blue.
        paragraph.font.color = "blue";

        await context.sync();
      }
    });
  };

  click = async () => {
    return Word.run(async (context) => {
      /**
       * Insert your Word code here
       */

      // insert a paragraph at the end of the document.
      const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

      // change the paragraph color to blue.
      paragraph.font.color = "blue";

      await context.sync();
    });
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" />

        <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
          <div style={{ paddingBottom : 10 }}>
            <p className="ms-font-l">
              Add Openai api key, then add the instruction click <b>Convert</b>.
            </p>
            <div  style={{ paddingBottom : 10, paddingLeft : 40 }}>
              <input
                className="ms-input"
                title="Api Key"
                style={{ fontSize: "15.rem" }}
                type="text"
                onChange={(e) => this.setState({ apiKey: e.target.value })}
              />
            </div>
          </div>
          <p className="ms-font-l" style={{ paddingBottom : 10 }}>
            Level of Text Please select.
          </p>

          <div className="dropdown" style={{ width : 100 }}>
            <select className="dropbtn" onChange={(e) => this.setState({ levelOfFormat: e.target.value })}>
            <option value="Profasinal">Profasinal Level</option>
            <option value="Standard">Standard Level</option>
            <option value="Ordinary level">Ordinary level</option>
            <option value="10 years old">10 years old</option>
            </select>
          </div> 
          <div style={{ paddingBottom : 10 }}>
            <p className="ms-font-l" style={{ paddingBottom : 8 }}>
              Please Input Word Count
            </p>
            <input
              className="ms-input"
              title="Word Count"
              style={{ fontSize: "15.rem" }}
              type="text"
              onChange={(e) => this.setState({ wordCount: e.target.value })}
            />
          </div>
          <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.convert}>
            Convert
          </DefaultButton>
        </HeroList>
      </div>
    );
  }
}
