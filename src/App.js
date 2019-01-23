import React, { Component } from "react";
import Modal from "react-modal";
import "./App.css";

class App extends Component {
  state = {
    userNames: [],
    turnModalOn: null,
    modalMessage: null
  };

  handleUpdateUserNames = event => {
    event.preventDefault();

    if (!event.target.userName.value) {
      this.setState({ turnModalOn: true, modalMessage: "Please enter a name" });
    } else if (
      this.state.userNames.indexOf(
        event.target.userName.value.toLowerCase().trim()
      ) !== -1
    ) {
      this.setState({
        turnModalOn: true,
        modalMessage: "You already entered this username"
      });
      event.target.userName.value = "";
    } else {
      const userNames = [
        ...this.state.userNames,
        event.target.userName.value.trim()
      ];
      const newNames = userNames.map(name => name.toLowerCase());
      this.setState({
        userNames: newNames
      });
      event.target.userName.value = "";
    }
  };

  handleDeleteUser = name => {
    const lowerName = name.toLowerCase();
    const userNames = this.state.userNames.filter(item => item !== lowerName);
    this.setState({ userNames: userNames });
  };

  handleCloseModal = () => {
    this.setState({ turnModalOn: null });
  };

  render() {
    return (
      <div className="App">
        <Input handleUpdateUserNames={this.handleUpdateUserNames} />
        <Output
          userNames={this.state.userNames}
          handleDeleteUser={this.handleDeleteUser}
        />
        <MessageModal
          turnModalOn={this.state.turnModalOn}
          handleCloseModal={this.handleCloseModal}
          modalMessage={this.state.modalMessage}
        />
      </div>
    );
  }
}

export default App;

const Input = props => {
  return (
    <form
      onSubmit={event => props.handleUpdateUserNames(event)}
      className="input"
    >
      <input
        id="input-field"
        name="userName"
        type="text"
        placeholder="enter GitHub username"
      />
      <input className="button" type="submit" value="search" />
    </form>
  );
};

const Output = props => (
  <div className="card-holder">
    {props.userNames.map(user => (
      <User
        key={user}
        userName={user}
        handleDeleteUser={props.handleDeleteUser}
      />
    ))}
  </div>
);

class User extends Component {
  state = {
    name: null,
    picture: null,
    bio: null,
    fullName: null,
    location: null,
    contact: null,
    company: null
  };

  componentWillMount = () => {
    fetch(`https://api.github.com/users/${this.props.userName}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        this.setState({
          name: data.login,
          picture: data["avatar_url"],
          bio: data.bio,
          fullName: data.name,
          location: data.location,
          contact: data.email,
          company: data.company
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ name: null });
        this.props.handleDeleteUser(this.props.userName);
      });
  };

  render() {
    return (
      <div
        className="card"
        onClick={() => this.props.handleDeleteUser(this.state.name)}
      >
        <div className="image-container">
          <img src={this.state.picture} alt="" />
        </div>
        <div className="info-container">
          <h2>
            {"<"}
            {this.state.name}
            {">"}
          </h2>
          <p>{this.state.bio}</p>
          <ul>
            {this.state.fullName && (
              <li>
                {this.state.fullName}{" "}
                {this.state.company && <span>@ {this.state.company}</span>}
              </li>
            )}
            {this.state.location && <li>{this.state.location}</li>}
            {this.state.contact && <li>{this.state.contact}</li>}
          </ul>
        </div>
      </div>
    );
  }
}

const MessageModal = props => (
  <Modal
    isOpen={!!props.turnModalOn}
    contentLabel="Enter Name"
    onRequestClose={props.handleCloseModal}
    closeTimeoutMS={200}
    className="modal"
  >
    <h2>{props.modalMessage}</h2>
    <button onClick={props.handleCloseModal} className="button">
      Okay
    </button>
  </Modal>
);
