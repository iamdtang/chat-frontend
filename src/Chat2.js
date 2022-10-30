import { Component } from "react";

export default class Chat2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      messages: [],
    };
  }

  componentDidMount() {
    this.connection = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    this.connection.onopen = () => {
      console.log("WebSocket connected");
    };

    this.connection.onclose = () => {
      console.error("WebSocket disconnected");
    };

    this.connection.onerror = (error) => {
      console.error("WebSocket failed to connect", error);
    };

    this.connection.onmessage = (event) => {
      const blob = event.data;
      blob.text().then((message) => {
        console.log("WebSocket received", message);
        this.setState({
          messages: this.state.messages.concat(message),
        });
      });
    };
  }

  componentWillUnmount() {
    this.connection.close();
  }

  render() {
    return (
      <div>
        <ul id="chat">
          {this.state.messages.map((message, i) => {
            return <li key={i}>{message}</li>;
          })}
        </ul>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            this.connection.send(this.state.message);
            this.setState({ message: "" });
          }}
        >
          <input
            type="text"
            value={this.state.message}
            onChange={(event) => {
              this.setState({ message: event.target.value });
            }}
          />
        </form>
      </div>
    );
  }
}
