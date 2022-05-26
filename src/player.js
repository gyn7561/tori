import Video from "react-native-video";

import React from 'react';
import {
    StyleSheet,
} from 'react-native';

export default function Player() {
    return <Video
        style={styles.fullScreen}
        source={{ uri: 'https://yun.66dm.net/SBDM/ShinIkkitousen02.m3u8' }} />
}
var styles = StyleSheet.create({
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});