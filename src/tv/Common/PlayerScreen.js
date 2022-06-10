import Video from "react-native-video";

import { Box, View, Alert, Slide, Text, Center, HStack, Stack, NativeBaseProvider, useTheme, Link, ScrollView, useToast, Spinner, Progress } from "native-base";
import React from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    BackHandler,
    useTVEventHandler
} from 'react-native';

export default function PlayerScreen({ currentVideoParams, currentVideo, navigation, onPlayEnd }) {

    const {
        colors
    } = useTheme();
    let [errorText, setErrorText] = React.useState("");
    let [progress, setProgress] = React.useState("");
    let [seekTime, setSeekTime] = React.useState();
    let [buffering, setBuffering] = React.useState(false);
    let [paused, setPaused] = React.useState(false);
    let [showProgressBar, setShowProgressBar] = React.useState(false);

    let player = React.useRef();
    let seekTimer = React.useRef();
    let hideProgressBarTimer = React.useRef();

    function onError(e) {
        console.log(e);
        setErrorText(`播放失败(${e?.error?.errorString})`);
    }

    function onProgress(e) {
        // console.log("on progress", e);
        setProgress(e);
    }

    function onBuffer(e) {
        console.log("ONBUFFER", e);
        setBuffering(e.isBuffering);
    }

    function callHideProgressBarTimer() {
        clearTimeout(hideProgressBarTimer.current);
        hideProgressBarTimer.current = setTimeout(() => {
            setShowProgressBar(false);
        }, 5000);
    }

    function seekTimeByOffset(offset) {
        if (!seekTime) {
            seekTime = progress.currentTime;
        }
        seekTime = seekTime + offset;
        seekTime = Math.min(seekTime, progress.seekableDuration);
        seekTime = Math.max(seekTime, 0);
        setSeekTime(seekTime);
        clearTimeout(seekTimer.current);
        setShowProgressBar(true);
        setProgress({ ...progress, currentTime: seekTime });
        seekTimer.current = setTimeout(() => {
            if (player.current) {
                player.current.seek(seekTime);
                setSeekTime(null);
                callHideProgressBarTimer();
            }

        }, 200);
    }

    function onEnd() {

        onPlayEnd()
    }

    useTVEventHandler((evt) => {
        console.log(evt);
        if (!navigation.isFocused()) {
            //不在该页面的话 吃掉该消息
            return;
        }
        if (evt.eventType === "select") {
            setPaused(!paused);
        }
        else if (evt.eventType === "up") {

        } else if (evt.eventType === "down") {

        } else if (evt.eventType === "right") {
            seekTimeByOffset(progress.seekableDuration / 100);
        } else if (evt.eventType === "left") {
            seekTimeByOffset(progress.seekableDuration / -100);
        }
    });

    React.useEffect(() => {
        const backAction = () => {
            console.log("back!!!!!!!!!!!!!!");
            // Alert.alert("Hold on!", "Are you sure you want to go back?", [
            //     {
            //         text: "Cancel",
            //         onPress: () => null,
            //         style: "cancel"
            //     },
            //     { text: "YES", onPress: () => BackHandler.exitApp() }
            // ]);
            return false;
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    React.useEffect(() => {
        setErrorText("");
        setShowProgressBar(true);
        callHideProgressBarTimer();
    }, [currentVideo]);

    let showCurrentTime = seekTime || progress.currentTime;

    if (currentVideoParams && currentVideo && currentVideo.type === "m3u8") {
        return <TouchableHighlight style={styles.fullScreen}>
            <View style={styles.fullScreen}>
                {
                    !!errorText && <View style={[styles.fullScreen, { zIndex: 1 }]}>
                        <Alert justifyContent="center" status="error">
                            <Alert.Icon />
                            <Text color="error.600" fontWeight="medium">
                                {errorText}
                            </Text>
                        </Alert>
                    </View>
                }
                <Video
                    paused={paused}
                    onProgress={onProgress}
                    ref={player}
                    onBuffer={onBuffer}
                    onError={onError}
                    style={styles.fullScreen}
                    onEnd={onEnd}
                    source={{ uri: currentVideo.address }}
                />
                {
                    buffering && <HStack style={styles.fullScreen} justifyContent="center" alignItems="center">
                        <Spinner size="lg" />
                    </HStack>
                }{
                    paused && <HStack style={styles.fullScreen} justifyContent="center" alignItems="center">
                        <View backgroundColor={colors.purple[300]} padding={30}>
                            <Text fontSize="6xl">暂停</Text>
                        </View>
                    </HStack>
                }
                {
                    showProgressBar && <View style={styles.progressBar}>
                        <Text style={styles.progressBarText}>
                            {currentVideoParams.text}
                        </Text>
                        <Text style={styles.progressBarText}>
                            {parseInt(showCurrentTime / 60).toString().padStart(2, "0")}:{parseInt(showCurrentTime % 60).toString().padStart(2, "0")}
                            /
                            {parseInt(progress.seekableDuration / 60).toString().padStart(2, "0")}:{parseInt(progress.seekableDuration % 60).toString().padStart(2, "0")}
                        </Text>
                        <Center>
                            <Box w="100%">
                                <Progress backgroundColor="rgba(255,255,255,0.5)" value={showCurrentTime / progress.seekableDuration * 100} />
                            </Box>
                        </Center>
                    </View>
                }

            </View>
        </TouchableHighlight>
    } else {
        return <Text>Loading</Text>
    }
}

var styles = StyleSheet.create({
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        height: 90,
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    progressBarText: {
        color: "white",
        fontSize: 18,
        paddingBottom: 1
    }
});