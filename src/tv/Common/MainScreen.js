import React, { useState, useEffect } from "react";
import { Box, View, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, useTheme, Link, ScrollView, Input } from "native-base";
import TextTicker from "react-native-text-ticker";
import { StyleSheet, useTVEventHandler, TouchableHighlight } from "react-native";
import RowControl from "./RowControl";


export default function MainScreen({ catagoryInfoList, onSelectSeries, navigation, onSearch }) {

    const {
        colors
    } = useTheme();

    let inputRef = React.useRef();
    console.log("catagoryInfoList", catagoryInfoList);
    let styles = StyleSheet.create({
        mainScreen: {
            backgroundColor: colors.gray[500],
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
            
        },
        mainScreenWrapepr: {
            backgroundColor: colors.pink[500],
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        },
        searchArea: {
            // backgroundColor: "rgba(0,0,0,0.7)",
            height: 90
        }
    });


    function getRowPostionStyleByIndex(i) {
        let currentIndex = catagoryInfoList.indexOf(activeRow);
        return StyleSheet.create({
            row: {
                position: "absolute",
                top: 320 * (i - currentIndex) + 80,
                left: 0
            }
        }).row
    }

    let [activeRow, setActiveRow] = useState(null);
    let [searchText, setSearchText] = useState("");
    let [searchMode, setSearchMode] = useState(false);
    let [activeItemMap, setActiveItemMap] = useState({});

    useEffect(() => {
        if (catagoryInfoList.length > 0 && (!activeRow || catagoryInfoList.indexOf(activeRow) === -1)) {
            setActiveRow(catagoryInfoList[0]);
            console.log("初始化 ActiveRow", catagoryInfoList[0]);
        }
    }, [catagoryInfoList]);

    useEffect(() => {
        let newActiveItemMap = { ...activeItemMap };
        for (let i = 0; i < catagoryInfoList.length; i++) {
            let list = catagoryInfoList[i];
            let key = list.catagoryData.text;
            if (list.catagoryInfo) {
                newActiveItemMap[key] = list.catagoryInfo.data[0];
            }
        }
        // debugger;
        setActiveItemMap(newActiveItemMap);
    }, [catagoryInfoList]);

    useTVEventHandler((evt) => {
        if (!navigation.isFocused()) {
            //不在该页面的话 吃掉该消息
            return;
        }
        if (searchMode) {
            if (evt.eventType === "right") {
                if (searchText.trim()) {
                    onSearch(searchText.trim())
                }
                setSearchMode(false);
            }
            else if (evt.eventType === "down") {
                setSearchMode(false);
            }
            else if (evt.eventType === "up") {
                inputRef.current.focus();
            }
            return;
        }
        if (activeRow) {
            let key = activeRow.catagoryData.text;
            let currentItem = activeItemMap[key];
            if (evt.eventType === "up") {
                let currentIndex = catagoryInfoList.indexOf(activeRow);
                let nextItem = catagoryInfoList[currentIndex - 1];
                if (nextItem) {
                    setActiveRow(nextItem);
                } else {
                    //弹出搜索框
                    setSearchMode(true);
                    inputRef.current.focus();
                }
            } else if (evt.eventType === "down") {
                let currentIndex = catagoryInfoList.indexOf(activeRow);
                let nextItem = catagoryInfoList[currentIndex + 1];
                if (nextItem) {
                    setActiveRow(nextItem);
                }
            } else if (evt.eventType === "left") {
                let currentIndex = activeRow.catagoryInfo.data.indexOf(activeItemMap[key]);
                let newActiveItemMap = { ...activeItemMap };
                let nextItem = activeRow.catagoryInfo.data[currentIndex - 1];
                if (nextItem) {
                    newActiveItemMap[key] = nextItem;
                    setActiveItemMap(newActiveItemMap);
                }
            } else if (evt.eventType === "right") {
                let currentIndex = activeRow.catagoryInfo.data.indexOf(activeItemMap[key]);
                let newActiveItemMap = { ...activeItemMap };
                let nextItem = activeRow.catagoryInfo.data[currentIndex + 1];
                if (nextItem) {
                    newActiveItemMap[key] = nextItem;
                    setActiveItemMap(newActiveItemMap);
                }
            } else if (evt.eventType === "select") {
                console.log(currentItem);
                if (onSelectSeries && currentItem) {
                    navigation.push('Series');
                    onSelectSeries(currentItem);
                }
            }
        }
    });


    return <TouchableHighlight style={styles.mainScreen}>
        <View>
            {
                searchMode && <View style={styles.searchArea}>
                    <Center paddingTop={5}>
                        <Input ref={inputRef} 
                            mx="3" placeholder="按方向键右开始搜索" w="75%" maxWidth="300px" isFocused={true}
                            value={searchText}
                            onChangeText={(s) => { setSearchText(s) }}
                        />
                    </Center>
                </View>
            }
            {
                catagoryInfoList.map((info, i) => {
                    return <View key={info.catagoryData.text} style={getRowPostionStyleByIndex(i)}>
                        <RowControl info={info} rowIsFocused={activeRow === info} selectedItem={activeItemMap[info.catagoryData.text]} />
                    </View>
                })
            }
        </View>
    </TouchableHighlight>
};

