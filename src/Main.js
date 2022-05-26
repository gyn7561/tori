
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getDataSource } from "./datasource/datasource";
import MainLayout from './tv/MainLayout';
import { NavigationContainer } from '@react-navigation/native';
// const Platform = require('Platform');

export default function Main() {

    let [tabs, setTabs] = useState([]);
    let [dataSource, setDataSource] = useState();
    let [tabData, setTabData] = useState();

    async function init() {
        let DataSource = getDataSource();
        console.log("DataSource", DataSource);
        let dataSource = new DataSource({});
        setDataSource(dataSource);
        let timer = setTimeout(() => {
            alert("获取tabs 超时");
        }, 2000);
        try {
            let tabs = await dataSource.getTabs();
            setTabs(tabs);
        } catch (error) {
            alert(error.toString());
        }
        
        clearTimeout(timer);
    }

    async function onTabActive(obj) {
        let tabInfo = await dataSource.getTabInfo(obj);
        console.log("tabInfo", tabInfo);
        setTabData(tabInfo);
    }

    useEffect(() => {
        init();
    }, []);
    console.log("tabData", tabData);

    return <MainLayout
        tabs={tabs}
        tabData={tabData}
        onTabActive={onTabActive}
    />;
}