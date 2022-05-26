import React from 'react';
import {
    StyleSheet,
} from 'react-native';

var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export default function Card() {
    return <Video
        style={styles.backgroundVideo}
        source={{ uri: 'https://yun.66dm.net/SBDM/ShinIkkitousen02.m3u8' }} />
}