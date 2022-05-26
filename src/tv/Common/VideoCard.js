import React, { useState } from "react";
import { Box, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider, useTheme, Link } from "native-base";
import TextTicker from "react-native-text-ticker";
import { StyleSheet } from "react-native";


export default function VideoCard({ data, imageUrl, title, onEnter }) {

    console.log("INIT CARD");
    const {
        colors
    } = useTheme();

    let styles = StyleSheet.create({
        cardWrapper: {
            width: 170,
            height: 170 * 4 / 3
        },
        card: {
            borderRadius: 10,
            backgroundColor: "black",
            margin: 10,
            padding: 0,
            width: 150,
            height: 150 * 4 / 3
        },
        cardActive: {
            margin: 2,
            width: 166,
            height: 166 * 4 / 3
        }
    });

    let [isFocused, setIsFocused] = useState(false);


    return <Link
        onPress={() => {
            if (onEnter) {
                onEnter({ title, imageUrl, data });
            }
        }}

        style={styles.cardWrapper}
        onBlur={() => {
            setIsFocused(false);
        }}

        onFocus={() => {
            setIsFocused(true);
        }}
    >


        <Box style={[styles.card, isFocused ? styles.cardActive : null]} overflow="hidden"   >
            <Box>
                <AspectRatio w="100%" ratio={3 / 4}>
                    <Image source={{
                        uri: imageUrl
                    }} alt="image" />
                </AspectRatio>
                <Center backgroundColor={"rgba(255,255,255,0.8)"} position="absolute" bottom="0" left="0" right="0" px="3" py="1.5" focusable={false}>
                    <TextTicker
                        style={{ fontSize: 24 }}
                        scrollSpeed={100}
                        loop
                        animationType="scroll"
                    >
                        <Text fontWeight="400">
                            {title}
                        </Text>
                    </TextTicker>
                </Center>
            </Box>
        </Box>
    </Link>
};

