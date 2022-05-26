
import { Button, NativeBaseProvider } from 'native-base';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Header from './Header';
import TabContent from "./TabContent";


export default function MainLayout({ tabs, onTabActive, tabData }) {

    return <NativeBaseProvider> 
        <Header tabs={tabs} onTabActive={onTabActive} />
        <TabContent tabData={tabData} />
    </NativeBaseProvider>;
}