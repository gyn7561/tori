import React, { useState } from "react";
import { Box, Heading, AspectRatio, Image, Text, Center, useTheme, Link } from "native-base";
import TextTicker from "react-native-text-ticker";
import { StyleSheet } from "react-native";


let styles = StyleSheet.create({
    wrapper: {
        margin: 6,
        width: 156,
        height: 156 * 4 / 3 + 55,
    },
    imageCard: {
        padding: 0,
        borderRadius: 5,
        width: 150,
        borderWidth: 0,
        height: 150 * 4 / 3,
        overflow: "hidden",
        position: "absolute",
        top: 8,
        left: 3,
        right: 3
    },
    cardActive: {
        width: 156,
        top: 4,
        height: 156 * 4 / 3,
        borderColor: "white",
        borderWidth: 1
    }
});


function SelectableCard({ data, imageUrl, title, onEnter, isFocused, subText }) {
    const {
        colors
    } = useTheme();
    console.log("开始渲染", "SelectableCard", imageUrl,data);

    return <Box style={styles.wrapper} focusable={false} >
        <Box style={[styles.imageCard, isFocused && styles.cardActive]} focusable={false}>
            <AspectRatio w="100%" ratio={3 / 4}>
                <Image source={{
                    uri: imageUrl
                }} alt="image" />
            </AspectRatio>
        </Box>
        <Box position="absolute" bottom="5" left="0" right="0" px="1" py="1.5" focusable={false}>
            <TextTicker
                disabled={!isFocused}
                focusable={false}
                scrollSpeed={100}
                loop
                animationType="scroll"
            >
                <Text fontWeight="400" focusable={false} color={colors.lightText} fontSize="14">
                    {title}
                </Text>
            </TextTicker>
        </Box>
        <Box position="absolute" bottom="0" left="0" right="0" px="1" py="1.5" focusable={false}>
            <TextTicker
                disabled={!isFocused}
                focusable={false}
                scrollSpeed={100}
                loop
                animationType="scroll"
            >
                <Text fontWeight="400" focusable={false} color={colors.lightText} fontSize="12">
                    {subText}
                </Text>
            </TextTicker>
        </Box>
    </Box>
};

export default React.memo(SelectableCard);