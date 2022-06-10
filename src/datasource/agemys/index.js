
import axios from "axios";
import * as cheerio from 'cheerio';
import resolve from '@jridgewell/resolve-uri';


//TODO该网站数据源感觉不是很稳
export default class YHDM {

    //计划在这里注入webview 用于处理比较麻烦的数据
    constructor({ webView, setWebViewProps }) {
        this.baseUrl = "https://www.agemys.com/";
        this.webView = webView;
        this.setWebViewProps = setWebViewProps;
    }

    async getConfig() {
    }

    async init({ }) {

    }

    getDataSourceInfo() {
        return {
            version: 0.1,
            author: "",
            id: "AGEMYS-TORI",
        }
    }

    async getCatagoryList() {
        return [
            {
                text: "每日推荐",
                data: {
                    url: `${this.baseUrl}/recommend`
                }
            },
            {
                text: "最近更新",
                data: {
                    url: `${this.baseUrl}/update`
                }
            }
        ];
    }

    async getCatagoryInfo({ text, data }) {
        let res = await axios.get(data.url);
        let $ = cheerio.load(res.data);
        let domWithImg = $(".anime_icon2");
        let result = domWithImg.toArray().map(d => {
            return {
                title: $(d).find(".anime_icon2_name").text().trim(),
                imageUrl: resolve($(d).find(".anime_icon2_img").attr("src"), data.url),
                data: {
                    url: resolve($(d).find("a").attr("href"), data.url)
                }
            }
        })
        return {
            type: "simple",
            data: result
        };
    }

    async getSeriesInfo({ data, title, imageUrl }) {
        let url = data.url;
        let res = await axios.get(url);
        let $ = cheerio.load(res.data);

        let videoList = $(".movurl a[href^='/play/']").toArray().map(dom => {
            //react native 的 URL解析库有点bug啊...
            // let queryString = new URL($(dom).attr("href"), url).search;
            return {
                text: $(dom).text().trim(),
                data: {
                    url: this.baseUrl + $(dom).attr("href")
                }
            }
        });

        //针对 第 x 集 进行排序，因为网站顺序时正时逆
        videoList.forEach(item => {
            if (item.text.startsWith("第") && item.text.endsWith("集")) {
                let num = item.text.substring(1, item.text.length - 1);
                item.data.num = parseFloat(num);
            } else {
                item.data.num = 100000000;//排到最后
            }
        });
        videoList = videoList.sort((a, b) => {
            return a.data.num - b.data.num;
        });

        return {
            type: "simple",
            data: {
                title: $(".detail_imform_name").text().trim(),
                info: $(".detail_imform_desc_pre").text().trim(),
                videoList: videoList,
                imageUrl: $(".baseblock img").attr("src")
            }
        };
    }

    async getVideoInfo({ text, data }) {
        let { url } = data;

        console.log(url);
        let script = `let success = false;
        setInterval(() => {
            if (success) {
                return;
            }
            try {
                let src = $("#age_playfram").attr("src");
                if (src) {
                    window.ReactNativeWebView.postMessage(src);
                    success = true;
                }
            } catch (e) {

            }
        }, 300);`;
        this.setWebViewProps({
            source: { uri: url },
            onLoadEnd: (syntheticEvent) => {
                // update component to be aware of loading status
                this.webView.injectJavaScript(script);
                console.log("syntheticEvent", syntheticEvent);
            },
            onMessage: (event) => {
                console.log("onMessage", event);
                this.setWebViewProps({ source: { uri: null } });//及时关闭webview 避免性能带宽浪费
            }
        })
    }

    async searchByPage({ keyword, page }) {
        let url = `http://www.yinghuacd.com/search/${keyword}/?page=${page || 1}`;
        let res = await axios.get(url);
        let $ = cheerio.load(res.data);
        let domWithImg = $("[href^='/show'] img");
        let result = domWithImg.toArray().map(d => {
            return {
                title: $(d).attr("alt"),
                imageUrl: $(d).attr("src"),
                data: {
                    url: resolve($(d.parent).attr("href"), url)
                }
            }
        })
        return {
            type: "simple",
            data: result
        };
    }

    async search({ keyword, page }) {
        let list = [];
        for (let i = 1; i <= 3; i++) { //先偷懒这么写，就抓三页再说
            let data = await this.searchByPage({ keyword, page: i });
            list = [...list, ...data.data];
        }
        return {
            type: "simple",
            data: list
        };
    }
}