/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  ListView,
  PixelRatio,
  Text,
  TouchableHighlight,
  View,
} = React;

var Firebase = require("firebase");
var firebaseRef = "<YOUR-FIREBASE-URL>";

var FirebaseManager = require('react-native').NativeModules.FirebaseManager;

var FlixView = require("./components/FlixView");

var ReactTinderApp = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: false,
      loggedInUser: null,
      authChecked: false,
      usersLoaded: false,
      userList: []
    };
  },
  
  componentDidMount: function () {
    var authData = FirebaseManager.authData((error, authData) => {
        if (authData) {
          console.log("Authenticated user with uid:", authData.uid);
          this.fetchLoggedInUser(authData.uid);
        } else {
          console.log("No Authentication registered");
          this.setState({
            authChecked: true
          });
        }        
        // preload user list
        this.fetchExistentUsers();
    });
  },

  authenticateWithTwitter: function () {
    FirebaseManager.newSession((error, currentUser) => { 
      if (error) { 
        console.error(error); 
      } else {
        console.log(currentUser.profileImageUrl);
        currentUser.profileImageUrl = currentUser.profileImageUrl.replace("_normal.", ".");
        this.setState({
          loggedIn: true,
          loggedInUser: currentUser
        });
      }
    });
  },

  fetchExistentUsers: function (uid, returnUser) {
    var requestUri = firebaseRef + "users.json";

    fetch(requestUri)
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) {
          var userList = [];

          for (var usr in responseData)
            userList.push(responseData[usr]);

          this.setState({
            userList: userList,
            usersLoaded: true
          });
        }
      })
      .done();
  },

  fetchLoggedInUser: function (uid, returnUser) {
    var self = this;
    var requestUri = firebaseRef + "users/" + uid + ".json";
    
    fetch(requestUri)
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) { 
          // let's get full image size from twitter :)
          responseData.profileImageUrl = responseData.profileImageUrl.replace("_normal.", ".");
          this.setState({
            loggedInUser: responseData,
            loggedIn: true
          });
        } else {
          this.setState({
            loggedIn: false
          })
        }
      })
      .done(function () {
        self.setState({
          authChecked: true
        });
      });
  },

  onPress: function () {
    this.authenticateWithTwitter();
  },

  renderLoaderView: function () {
    return (
      <View style={styles.centering}>
        <ActivityIndicatorIOS
          animating={this.state.animating}
          style={[styles.centering, {height: 80}]}
          size="large"/>
      </View>
    );
  },

  renderUserInfo: function () {
    var user = this.state.loggedInUser;
    return (
      <View style={{flex:1}}>
        <FlixView cards={this.state.userList}/>
      </View>
    );
  },

  renderWelcomeView: function () {
    return(
      <View style={styles.container}>
          <View>
            <Text style={styles.headText}>Welcome to this Example, hope you find it useful :)</Text>
          </View>
          <TouchableHighlight onPress={this.onPress} underlayColor="#fff">
            <View style={styles.button}>
              <Text style={styles.buttonText}>Sign in with your Twitter Account</Text>
            </View>
          </TouchableHighlight>
      </View>
    );
  },

  render: function () {
    if (this.state.authChecked && this.state.loggedIn === false) {
      return this.renderWelcomeView();
    } else if (this.state.authChecked && this.state.loggedIn && this.state.loggedInUser && this.state.usersLoaded) {
      return this.renderUserInfo();
    } else {
      return this.renderLoaderView();
    }
  }
});

var styles = StyleSheet.create({
  button: {
    backgroundColor:'#3cbcdd',
    marginTop: 40,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 15,
    width: 250,
    flexDirection: 'row'
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
    backgroundColor: 'transparent'
  },
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centering: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: {
    fontSize: 18,
    textAlign: 'center',
    width: 270,
    color: '#777'
  },
  mainContainer: {
    marginTop: 40,
    paddingBottom: 30,
    borderBottomWidth: 4,
    borderBottomColor: "#dedede"
  },
  profileImage: {
    borderWidth: 2,
    borderColor: '#717672',
    margin: 0,
    marginTop: 20,
    height: 100,
    width: 100,
    borderRadius: 100 / PixelRatio.get(),
  }
});

AppRegistry.registerComponent('ReactTinderApp', () => ReactTinderApp);
module.exports = ReactTinderApp;
