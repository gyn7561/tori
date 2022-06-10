import React, { useState, useEffect, useRef } from "react";
import { Box, View, AspectRatio, Image, Text, Center, VStack, Heading, Flex, HStack, Stack, NativeBaseProvider, useTheme, Divider, ScrollView, FlatList } from "native-base";
import TextTicker from "react-native-text-ticker";
import { StyleSheet, useTVEventHandler } from "react-native";
import RowControl from "./RowControl";
import TouchableHighlight from "../Common/FocusableHighlight";

export default function SeriesScreen({ loading, seriesData, onSelectVideo, navigation, onSelectVideoDefault, onLikeSeries, isLiked }) {

    const {
        colors
    } = useTheme();
    const flatListRef = useRef();


    let styles = StyleSheet.create({
        mainScreen: {
            backgroundColor: colors.gray[500],
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            padding: 20,
            color: colors.lightText
        },
        imageArea: {
            position: "absolute",
            top: 0,
            left: 0,
            width: 200
        },
        textArea: {
            backgroundColor: colors.gray[600],
            position: "absolute",
            top: 0,
            left: 220,
            height: 207,
            right: 0,
            overflow: "hidden"
        },
        operateArea: {
            backgroundColor: colors.pink[600],
            position: "absolute",
            top: 207,
            left: 220,
            height: 60,
            right: 0,
            paddingTop: 10,
            paddingLeft: 20,
            overflow: "hidden"
        },
        videoListArea: {
            backgroundColor: colors.blue[500],
            position: "absolute",
            top: 280,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: 220,
            overflow: "hidden",
            paddingTop: 5
        },
        rowItem: {
            width: 95,
            height: 25,
            margin: 10,
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: colors.gray[300]
        },
        rowItemFocus: {
            borderColor: colors.white,
            backgroundColor: colors.red[300],
            borderWidth: 1
        },
        playButton: {
            position: "absolute",
            backgroundColor: colors.dark[300],
            top: 20,
            left: 40,
            width: 100
        },
        likeButton: {
            position: "absolute",
            backgroundColor: colors.dark[300],
            top: 20,
            left: 200,
            width: 100
        },
        buttonFocus: {
            borderColor: "white",
            borderWidth: 1
        }
    });



    async function onSelect(params) {
        onSelectVideo(params);
        navigation.push('Player');
    }


    if (seriesData && seriesData.type === "simple") {
        let info = seriesData.data;
        function renderItem({ index, item, separators }) {

            return <TouchableHighlight
                style={styles.rowItem}
                styleFocused={styles.rowItemFocus}
                onPress={(e) => { onSelect(info.videoList[index]) }}
            >
                <Center>
                    <Text>{item.text}</Text>
                </Center>
            </TouchableHighlight>
        }

        return <View style={styles.mainScreen}>
            <View>
                <View style={styles.imageArea}>
                    <AspectRatio w="100%" ratio={3 / 4}>
                        <Image source={{
                            uri: info.imageUrl
                        }} alt="image" />
                    </AspectRatio>
                </View>
                <View style={styles.textArea}>
                    <Text fontSize="4xl" color={colors.lightText}>{info.title}</Text>
                    <Text fontSize="sm" color={colors.lightText}>{info.info}</Text>
                </View>

                <View style={styles.operateArea}>
                    <TouchableHighlight style={styles.playButton} styleFocused={styles.buttonFocus} onPress={onSelectVideoDefault}>
                        <Center>
                            <Text>继续播放</Text>
                        </Center>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.likeButton} styleFocused={styles.buttonFocus} onPress={onLikeSeries}>
                        <Center>
                            <Text>{isLiked ? "取消收藏" : "收藏"}</Text>
                        </Center>
                    </TouchableHighlight>
                </View>

                <FlatList
                    style={styles.videoListArea}
                    ref={flatListRef}
                    data={info.videoList}
                    numColumns={8}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.text}
                    getItemLayout={(data, index) => {
                        return { length: 30, offset: 30 * index, index };
                    }}
                    showsVerticalScrollIndicator={false}
                />

            </View>
        </View>
    } else {
        return <TouchableHighlight style={styles.mainScreen}>
            <View>
                <Text fontSize="6xl">ahbdashj</Text>
            </View>
        </TouchableHighlight>
    }

};

