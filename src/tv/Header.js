
import { Button, Link, ScrollView, Text, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TVEventHandler, useTVEventHandler, Platform } from "react-native";
import TouchableHighlight from "./Common/FocusableHighlight";

// let Platform = require("Platform");

export default function Header({ tabs, onTabActive }) {
    const {
        colors
    } = useTheme();

    let [activeTab, setActiveTab] = useState();

    useEffect(() => {
        if (tabs.length > 0) {
            onActiveTab(tabs[0]);
        }
    }, [tabs]);

    useEffect(() => {
        // console.log(Platform.isTV);
    }, []);

    const myTVEventHandler = evt => {
        console.log(evt.eventType);
    };

    useTVEventHandler(myTVEventHandler);

    function onActiveTab(tab) {
        setActiveTab(tab);
        onTabActive(tab);
    }

    let styles = StyleSheet.create({
        tab: {
            marginLeft: 10,
            marginRight: 10,
            color: colors.secondary[300]
        },
        header: {
            marginTop: 30,
            marginLeft: 20,
            maxHeight: 40,
            // backgroundColor: colors.black
        },
        tabActive: {
            marginLeft: 10,
            marginRight: 10,
            color: colors.secondary[900]
        }
    });



    return <ScrollView horizontal={true} style={styles.header} >
        {
            tabs.map((tab) => <Link key={tab.text}
                // styleFocused={styles.header}
                onFocus={() => {
                    onActiveTab(tab)
                }}
                style={{
                    height: 40
                }}
                onPress={() => {
                    onActiveTab(tab);
                }}>
                <Text style={activeTab === tab ? styles.tabActive : styles.tab} fontSize="2xl" >{tab.text}</Text>
            </Link>)
        }
    </ScrollView>;
}