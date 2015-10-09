'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Animated,
  ActivityIndicatorIOS,
  StyleSheet,
  Image,
  ListView,
  PixelRatio,
  PanResponder,
  Text,
  TouchableHighlight,
  View,
} = React;

var clamp = require('clamp');

var SWIPE_THRESHOLD = 120;

var Flix = React.createClass({
  getInitialState: function() {
    return {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      person: this.props.cards[0],
    }
  },

  _goToNextPerson: function () {
    var currentPersonIdx = this.props.cards.indexOf(this.state.person);
    var newIdx = currentPersonIdx + 1;

    this.setState({
      person: this.props.cards[newIdx > this.props.cards.length - 1 ? 0 : newIdx]
    });
  },

  componentDidMount: function () {
    this._animateEntrance();
  },

  _animateEntrance: function () {
    Animated.spring(
      this.state.enter,
      { toValue: 1, friction: 8 }
    ).start();
  },

  componentWillMount: function () {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        var velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(this._resetState)
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  },

  _resetState: function () {
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0);
    this._goToNextPerson();
    this._animateEntrance();
  },

  render: function () {
    var { pan, enter, } = this.state;

    var [translateX, translateY] = [pan.x, pan.y];

    var rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    var opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})
    var scale = enter;

    var animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    var yupOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    var yupScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    var animatedYupStyles = {transform: [{scale: yupScale}], opacity: yupOpacity}

    var nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    var nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    var animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.card, animatedCardStyles]} {...this._panResponder.panHandlers}>
          <Image
            style={{width: 200, height: 200, borderWidth: 1, borderColor: '#ccc' }}
            source={{uri: this.state.person.profileImageUrl}} />
        </Animated.View>

        <Animated.View style={[styles.nope, animatedNopeStyles]}>
          <Text style={styles.nopeText}>Nope!</Text>
        </Animated.View>

        <Animated.View style={[styles.yup, animatedYupStyles]}>
          <Text style={styles.yupText}>Yup!</Text>
        </Animated.View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  card: {
    width: 200,
    height: 200,
    backgroundColor: 'transparent',
  },
  yup: {
    borderColor: 'green',
    borderWidth: 2,
    position: 'absolute',
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 20,
  },
  yupText: {
    fontSize: 16,
    color: 'green',
  },
  nope: {
    borderColor: 'red',
    borderWidth: 2,
    position: 'absolute',
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 20,
  },
  nopeText: {
    fontSize: 16,
    color: 'red',
  }
});

module.exports = Flix;
