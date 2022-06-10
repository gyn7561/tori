
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getDataSource } from "./datasource/datasource";

import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './Common/MainScreen';
import SeriesScreen from './Common/SeriesScreen';
import { NativeBaseProvider } from 'native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayerScreen from './Common/PlayerScreen';

// const Platform = require('Platform');

export default function TVMain({ catagoryList, catagoryInfoList, seriesData, seriesLoading, onSelectSeries, seriesDataParams, onSelectVideo, currentVideoParams, currentVideo, onPlayEnd, onSelectVideoDefault, onLikeSeries, currentSeriesDataLiked,onSearch }) {

    const Stack = createNativeStackNavigator();


    return <NativeBaseProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="Home" >
                    {props => <MainScreen
                        {...props}
                        onSearch={onSearch}
                        catagoryList={catagoryList}
                        catagoryInfoList={catagoryInfoList}
                        onSelectSeries={onSelectSeries}
                    />}
                </Stack.Screen> 
                <Stack.Screen name="Series" >
                    {props => <SeriesScreen seriesDataParams={seriesDataParams} seriesData={seriesData} loading={seriesLoading} onSelectVideo={onSelectVideo} {...props} onSelectVideoDefault={onSelectVideoDefault} onLikeSeries={onLikeSeries} isLiked={currentSeriesDataLiked} />}
                </Stack.Screen>
                <Stack.Screen name="Player" >
                    {props => <PlayerScreen onPlayEnd={onPlayEnd} currentVideoParams={currentVideoParams} currentVideo={currentVideo} seriesDataParams={seriesDataParams} seriesData={seriesData} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer >
    </NativeBaseProvider >
}