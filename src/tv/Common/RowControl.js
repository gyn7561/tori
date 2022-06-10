import React, { useState } from "react";
import { Box, Heading, View, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, useTheme, Link, ScrollView } from "native-base";
import TextTicker from "react-native-text-ticker";
import { StyleSheet } from "react-native";
import SelectableCard from "./SelectableCard";


function RowControl({ info, rowIsFocused, selectedItem }) {
    const {
        colors
    } = useTheme();



    let styles = StyleSheet.create({
        title: {
            paddingLeft: 20,
            color: colors.lightText
        },
        rowWrapper: {
            height: 263,
            width: "100%"
        },
        cardWrapper: {
            position: "absolute",
            top: 0,
            left: 0
        }
    });

    function getCardPostionStyleByIndex(i) {
        return StyleSheet.create({
            card: {
                position: "absolute",
                top: 0,
                left: (i - 1) * 180 + 10
            },
        }).card
    }

    let { text } = info.catagoryData;
    let { catagoryInfo } = info;

    if (catagoryInfo && catagoryInfo.type === "simple") {
        console.log(selectedItem);
        let renderCount = 7; //性能问题,减少卡顿，按需求渲染; 
        let currentIndex = catagoryInfo.data.indexOf(selectedItem);
        let renderItems = []; //坐标0为屏幕左边不可见的item 坐标1为屏幕上第一个item
        for (let i = 0; i < renderCount; i++) {
            renderItems[i] = catagoryInfo.data[currentIndex - 1 + i];
        }

        return <Box>
            <Text fontSize="4xl" style={styles.title}>{text}</Text>
            <View style={styles.rowWrapper}>
                {
                    renderItems.map((data, i) => {
                        return data && <View style={[styles.cardWrapper, getCardPostionStyleByIndex(i)]} key={JSON.stringify(data)}>
                            <SelectableCard
                                data={data.data}
                                imageUrl={data.imageUrl}
                                title={data.title}
                                isFocused={rowIsFocused && data === selectedItem} />
                        </View>
                    })
                }
            </View>
        </Box>
    } else {
        return <Box>
            <Text fontSize="4xl" style={styles.title}>{text}</Text>
            <SelectableCard
                imageUrl={"data.imageUrl"}
                title={"loading"}
                isFocused={false} />
        </Box>

    }

};

export default React.memo(RowControl);