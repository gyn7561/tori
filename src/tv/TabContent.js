
import { Button, Link, ScrollView, Text, useTheme, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from "react-native";
import SimpleContentUI from './ContentUI/SimpleContentUI';


export default function TabContent({ tabData, onRefresh }) {
    if (!tabData) {
        return <Text>loading</Text>;
    }
    if (tabData.type === "simple") {
        // return <Text>{tabData.data.length}</Text>
        return <SimpleContentUI tabData={tabData} />;
    }

    return <Text>未知UI类型{tabData.type}</Text>;
}