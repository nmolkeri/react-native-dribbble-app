//@flow

import React from 'react';
import {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicatorIOS,
  View,
  ListView,
  Dimensions,
  Modal
} from 'react-native';

import Icon from "react-native-vector-icons/FontAwesome";
import * as getImage from "./helpers/getImage";
import HTML from "react-native-htmlview";
import ParallaxView from "react-native-parallax-view";

import * as api from "./helpers/api";
import Player from "./Player";
import CommentItem from "./CommentItem";
// import Loading from "./Loading";
import UNLoading, {LOADING_TYPE} from './test/universalLoading';

const screen = Dimensions.get('window');

export default class ShotDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isLoading: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };

    //bind
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // this._showModalTransition = this._showModalTransition.bind(this);
    // this._hideModalTransition = this._hideModalTransition.bidn(this);
    this.selectPlayer = this.selectPlayer.bind(this);
    this._renderCommentsList = this._renderCommentsList.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this._renderLoading = this._renderLoading.bind(this);
  }

  openModal() {
    this.setState({
      isModalOpen: true
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false
    });
  }

  componentDidMount() {
    api.getResources(this.props.shot.comments_url).then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        isLoading: false
      });
    }).done();
  }

  render() {
    var player = this.props.shot.user;

    return (
      <ParallaxView
        backgroundSource={getImage.shotImage(this.props.shot)}
        windowHeight={300}
        header={(
          <TouchableOpacity onPress={this.openModal}>
            <View style={styles.invisibleView}></View>
          </TouchableOpacity>
        )}>
        <View>
          <TouchableHighlight style={styles.invisibleTouch}
                              onPress={this.selectPlayer.bind(this, player)}
                              underlayColor={"#333"}
                              activeOpacity={0.95}>
            <View style={styles.headerContent}>
              <Image source={getImage.authorAvatar(player)}
                     style={styles.playerAvatar} />
              <Text style={styles.shotTitle}>{this.props.shot.title}</Text>
              <Text style={styles.playerContent}>by <Text style={styles.player}>{player.name}</Text></Text>
            </View>
          </TouchableHighlight>
          <View style={styles.mainSection}>
            <View style={styles.shotDetailsRow}>
              <View style={styles.shotCounter}>
                <Icon name="heart-o" size={24} color="#333"/>
                <Text style={styles.shotCounterText}> {this.props.shot.likes_count} </Text>
              </View>
              <View style={styles.shotCounter}>
                <Icon name="comments-o" size={24} color="#333"/>
                <Text style={styles.shotCounterText}> {this.props.shot.comments_count} </Text>
              </View>
              <View style={styles.shotCounter}>
                <Icon name="eye" size={24} color="#333"/>
                <Text style={styles.shotCounterText}> {this.props.shot.views_count} </Text>
              </View>
            </View>
            <View style={styles.separator} />
            <Text>
              <HTML value={this.props.shot.description}
                    stylesheet={styles}/>
            </Text>
            <View>
              {
                this.state.dataSource.getRowCount() === 0 ?
                <UNLoading loadingType={LOADING_TYPE.Large} /> :
                this._renderCommentsList()
              }
            </View>
          </View>
        </View>
        <Modal visible={this.state.isModalOpen}
          onDismiss={this.closeModal}>
          <Image source={getImage.shotImage(this.props.shot)}
                 style={styles.customModalImage}
                 resizeMode="contain"/>
        </Modal>
      </ParallaxView>
    );
  }

  // _showModalTransition(transition) {
  //   transition("opacity", {
  //     duration: 200,
  //     begin: 0,
  //     end: 1
  //   });
  //   transition("height", {
  //     duration: 200,
  //     begin: - screen.height * 2,
  //     end: screen.height
  //   });
  // }
  //
  // _hideModalTransition(transition) {
  //   transition("height", {
  //     duration: 200,
  //     begin: screen.height,
  //     end: screen.height * 2,
  //     reset: true
  //   });
  //   transition("opacity", {
  //     duration: 200,
  //     begin: 1,
  //     end: 0
  //   });
  // }

  selectPlayer(player: Object) {
    this.props.navigator.push({
      component: Player,
      passProps: {player},
      title: player.name
    });
  }

  _renderCommentsList() {
    return
      <View style={styles.sectionSpacing}>
        <View style={styles.separator} />
        <Text style={styles.heading}>Comments</Text>
        <View style={styles.separator} />
        <ListView
          ref="commentsView"
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
  }

  renderRow(comment: Object) {
    return <CommentItem
      onSelect={() => this.selectPlayer(comment.user)}
      comment={comment} />;
  }

  _renderLoading() {
    // return <ActivityIndicatorIOS animating={this.state.isLoading}
    //                              style={styles.spinner}/>;
    return <UNLoading loadingType={LOADING_TYPE.Large} />;
  }

};

var styles = StyleSheet.create({
  spinner: {
    marginTop: 20,
    width: 50
  },
  a: {
    fontWeight: "300",
    color: "#ea4c89"
  },
  p: {
    marginBottom: 0,
    flexDirection: "row",
    marginTop: 0,
  },
  invisibleView: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right:0
  },
  customModalImage: {
    height: screen.height / 2
  },
  headerContent: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 40,
    alignItems: "center",
    width: screen.width,
    backgroundColor: "#fff"
  },
  shotTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#ea4c89",
    lineHeight: 18
  },
  playerContent: {
    fontSize: 12
  },
  player: {
    fontWeight: "900",
    lineHeight: 18
  },
  playerAvatar: {
    borderRadius: 40,
    width: 80,
    height: 80,
    position: "absolute",
    bottom: 60,
    left: screen.width / 2 - 40,
    borderWidth: 2,
    borderColor: "#fff"
  },
  rightPane: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  shotDetailsRow: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flexDirection: "row"
  },
  shotCounter: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-between"
  },
  shotCounterText: {
    color: "#333"
  },
  mainSection: {
    flex: 1,
    alignItems: "stretch",
    padding: 10,
    backgroundColor: "white"
  },
  separator: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },
  sectionSpacing: {
    marginTop: 20
  },
  heading: {
    fontWeight: "700",
    fontSize: 16
  }
});

module.exports = ShotDetails;
