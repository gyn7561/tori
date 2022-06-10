
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDataSource } from "./datasource/datasource";
import TVMain from './tv/TVMain';
import { WebView } from 'react-native-webview';



export default function Main() {

    let [catagoryList, setCatagoryList] = useState([]);
    let [catagoryInfoList, setCatagoryInfoList] = useState([]);
    let [searchCatagoryInfo, setSearchCatagoryInfo] = useState(null);
    let [dataSource, setDataSource] = useState();
    let [seriesLoading, setSeriesLoading] = useState(false);
    let [seriesData, setSeriesData] = useState({});
    let [seriesDataParams, setSeriesDataParams] = useState({});
    let [currentSeriesDataLiked, setCurrentSeriesDataLiked] = useState(false);
    let [currentVideoParams, setCurrentVideoParams] = useState();
    let [currentVideo, setCurrentVideo] = useState();
    let [likeObj, setLikeObj] = useState({});
    let [webViewProps, setWebViewProps] = useState({});
    let webView = React.useRef();

    async function getCatagoryData(params, index, dataSource, resultArray) {
        resultArray[index].catagoryInfo = await dataSource.getCatagoryInfo(params);
        setCatagoryInfoList([...resultArray]);
    }

    function getLikedCatagoryData(dataSource, likeObj) {
        if (dataSource && likeObj) {
            let dataSourceId = dataSource.getDataSourceInfo().id;
            let likeList = (likeObj[dataSourceId] || { list: [] }).list;
            return {
                catagoryData: { text: "我的收藏" },
                catagoryInfo: {
                    type: "simple",
                    data: likeList
                }
            }
        }
        return null;
    }

    async function init() {
        let likeObjString = await AsyncStorage.getItem("LIKE");
        let likeObj = JSON.parse(likeObjString || "{}");
        setLikeObj(likeObj)
        let DataSource = getDataSource();
        let dataSource = new DataSource({ webView: webView.current, setWebViewProps });
        setDataSource(dataSource);
        let timer = setTimeout(() => {
            alert("获取tabs 超时");
        }, 2000);
        try {
            console.log("初始化数据");
            let data = await dataSource.getCatagoryList();
            let catagoryInfoList = [];
            // let catagoryInfoList = [];
            for (let i = 0; i < data.length; i++) {
                catagoryInfoList.push({ catagoryData: data[i] });
                getCatagoryData(data[i], i, dataSource, catagoryInfoList);
            }
            setCatagoryList(data);
        } catch (error) {
            alert(error.toString());
        }
        clearTimeout(timer);
        console.log("likeObj", likeObj);
    }

    async function onSelectSeries(seriesDataParams) {
        console.log("onSelectSeries", seriesDataParams);
        setSeriesLoading(true);
        let data = await dataSource.getSeriesInfo(seriesDataParams);
        setSeriesData(data);
        setSeriesDataParams(seriesDataParams);
        setSeriesLoading(false);
        console.log("onSelectSeries data", data);


        let dataSourceId = dataSource.getDataSourceInfo().id;
        let likeList = (likeObj[dataSourceId] || { list: [] }).list;
        let itemString = JSON.stringify(seriesDataParams);
        //应该生成个KEY
        setCurrentSeriesDataLiked(false);
        for (let i = 0; i < likeList.length; i++) {
            let item = JSON.stringify(likeList[i]);
            if (item === itemString) {
                setCurrentSeriesDataLiked(true);
                break;
            }
        }

    }

    async function onSelectVideo(params) {
        let data = await dataSource.getVideoInfo(params);
        console.log(data);
        setCurrentVideo(data);
        setCurrentVideoParams(params);
    }

    async function onPlayEnd() {
        console.log("on play end", seriesData, currentVideoParams);
        if (seriesData.type === "simple") {
            let currentIndex = seriesData.data.videoList.indexOf(currentVideoParams);
            console.log("on play end", currentIndex);
            let nextVideo = seriesData.data.videoList[currentIndex + 1];
            if (nextVideo) {
                onSelectVideo(nextVideo);
            } else {
                //TODO 结束播放
            }
        }
    }

    function onSelectVideoDefault() {

    }

    async function onSearch(keyword) {
        let data = await dataSource.search({ keyword });
        setSearchCatagoryInfo({
            catagoryData: { text: `搜索 - ${keyword}` },
            catagoryInfo: data
        });
    }

    async function onLikeSeries() {
        let dataSourceId = dataSource.getDataSourceInfo().id;
        let currentLikeObj = likeObj[dataSourceId] || { list: [] };
        let itemString = JSON.stringify(seriesDataParams);
        if (!currentSeriesDataLiked) {
            console.log("添加收藏");
            currentLikeObj.list = [seriesDataParams, ...currentLikeObj.list]; //添加到第一个
        } else {
            console.log("移除收藏");
            let newList = [];
            for (let i = 0; i < currentLikeObj.list.length; i++) {
                let item = JSON.stringify(currentLikeObj.list[i]);
                if (item !== itemString) {
                    newList.push(currentLikeObj.list[i]);
                }
            }
            currentLikeObj.list = newList;
        }
        likeObj[dataSourceId] = currentLikeObj;
        await AsyncStorage.setItem("LIKE", JSON.stringify(likeObj));
        setCurrentSeriesDataLiked(!currentSeriesDataLiked);
        setLikeObj({ ...likeObj });
    }

    useEffect(() => {
        init();
    }, []);


    //检查我的收藏
    let passedCatagoryInfoList = catagoryInfoList;
    let likedCatagoryInfo = getLikedCatagoryData(dataSource, likeObj);
    if (likedCatagoryInfo && likedCatagoryInfo.catagoryInfo.data.length > 0) {
        passedCatagoryInfoList = [likedCatagoryInfo, ...passedCatagoryInfoList];
    }
    if (searchCatagoryInfo) {
        passedCatagoryInfoList = [searchCatagoryInfo, ...passedCatagoryInfoList];
    }
    // if (catagoryInfoList.length > 0 && catagoryInfoList.filter(v => v.catagoryData.text === "我的收藏")[0].catagoryInfo.data.length === 0) {
    //     passedCatagoryInfoList = catagoryInfoList.filter(v => v.catagoryData.text !== "我的收藏");
    // }

    return <>
        <View style={{ backgroundColor: "red", width: 0, height: 0 }}>
            {/* <WebView ref={webView} source={{ uri: "https://www.baidu.com" }} {...webViewProps}   /> */}
        </View>
        <TVMain
            currentSeriesDataLiked={currentSeriesDataLiked}
            onSelectVideoDefault={onSelectVideoDefault}
            onLikeSeries={onLikeSeries}
            catagoryInfoList={passedCatagoryInfoList}
            catagoryList={catagoryList}
            onSelectSeries={onSelectSeries}
            seriesDataParams={seriesDataParams}
            onSelectVideo={onSelectVideo}
            currentVideo={currentVideo}
            onPlayEnd={onPlayEnd}
            onSearch={onSearch}
            currentVideoParams={currentVideoParams}
            seriesData={seriesData} />

    </>
}