import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    userNames: []
  };

  handleUpdateUserNames = event => {
    event.preventDefault();

    if (!event.target.userName.value) {
      alert("enter a name");
    } else if (
      this.state.userNames.indexOf(
        event.target.userName.value.toLowerCase()
      ) !== -1
    ) {
      alert("already exists");
      event.target.userName.value = "";
    } else {
      const userNames = [...this.state.userNames, event.target.userName.value];
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

  render() {
    return (
      <div className="App">
        <Input handleUpdateUserNames={this.handleUpdateUserNames} />
        <Output
          userNames={this.state.userNames}
          handleDeleteUser={this.handleDeleteUser}
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
        placeholder="enter GitHub user name"
      />
      <input id="input-button" type="submit" value="search" />
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
    contact: null
  };

  componentDidMount = () => {
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
          contact: data.email
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
        <div className="container image-container">
          <img src={this.state.picture} alt="" />
        </div>
        <div className="container info-container">
          <h2>
            {"<"}
            {this.state.name}
            {">"}
          </h2>
          <p>{this.state.bio}</p>
          <ul>
            {this.state.fullName && <li>{this.state.fullName}</li>}
            {this.state.location && <li>{this.state.location}</li>}
            {this.state.contact && <li>{this.state.contact}</li>}
          </ul>
        </div>
      </div>
    );
  }
}
