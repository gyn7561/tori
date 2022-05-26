
import { Button, Link, ScrollView, Text, useTheme, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from "react-native";
import VideoCard from '../Common/VideoCard';


export default function SimpleContentUI({ tabData, onRefresh }) {
    const { colors } = useTheme();

    let styles = StyleSheet.create({
        test: {
            backgroundColor: colors.blue[500]
        }
    });

    return <ScrollView horizontal={true} style={styles.test} p={10}  >
        {tabData.data.map((d, i) => {
            return <VideoCard key={d.title + i} imageUrl={d.imageUrl} data={d.data} title={d.title} />;
        })}
    </ScrollView>;
}