
import axios from "axios";
import * as cheerio from 'cheerio';
import resolve from '@jridgewell/resolve-uri';

function subStartToEnd(str, start, end) {

    let objStringStart = str.indexOf(start);
    let endIndex = str.indexOf(end, objStringStart + 1);
    return str.substring(objStringStart + start.length, endIndex);
}

export default class INDAYP {

    //计划在这里注入webview 用于处理比较麻烦的数据
    constructor({ }) {
        this.baseUrl = "https://www.lndayp.com";
    }

    async getConfig() {
    }

    async init({ }) {

    }

    getDataSourceInfo() {
        return {
            version: 0.1,
            author: "",
            id: "INDAYP-TORI",
        }
    }

    async getCatagoryList() {
        return [
            {
                text: "动漫",
                data: {
                    url: `${this.baseUrl}/dongman/`
                }
            },
            {
                text: "电影",
                data: {
                    url: `${this.baseUrl}/dianying/`
                }
            },
            {
                text: "电视剧",
                data: {
                    url: `${this.baseUrl}/dianshiju/`
                }
            }
        ];
    }

    async getCatagoryInfo({ text, data }) {
        let res = await axios.get(data.url);
        let $ = cheerio.load(res.data);
        let domWithImg = $(".video-pic[data-original]");
        let result = domWithImg.toArray().map(d => {
            return {
                title: $(d).attr("title"),
                imageUrl: resolve($(d).attr("data-original"), data.url),
                data: {
                    url: resolve($(d).attr("href"), data.url)
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
        let videoList = $(".playlist li>a").toArray().map(dom => {
            return {
                text: $(dom).text().trim(),
                data: {
                    url: resolve($(dom).attr("href"), url)
                }
            }
        });

        //针对 第 x 集 进行排序，因为网站顺序比较乱 
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
                title: $("h1").text().substring(0, $("h1").text().length - $("h1 em").text().length),
                info: $(".details-content-all").text().trim(),
                videoList: videoList,
                imageUrl: imageUrl
            }
        };
    }

    async getVideoInfo({ text, data }) {
        let { url } = data;
        let res = await axios.get(url);
        let str = res.data;
        let objStringStart = str.indexOf("zanpiancms_player = ");
        let end = str.indexOf(";</script>", objStringStart + 1);
        let objString = str.substring(objStringStart + "zanpiancms_player = ".length, end);
        let obj = JSON.parse(objString);
        return {
            address: obj.url,
            type: "m3u8"
        }
    }

    async getImageUrl(url) {
        let res = await axios.get(url);
        let $ = cheerio.load(res.data);
        let style = $(".details-pic .video-pic").attr("style");
        let picUrl = subStartToEnd(style, "url(", ")")
        return resolve(picUrl, url)
    }


    async search({ keyword, page }) {
        let url = `https://www.lndayp.com/index.php?s=/home/search/vod&limit=10&q=${keyword}`;
        let res = await axios.get(url);
        let result = {
            type: "simple",
            data: res.data.data.map(s => {
                let url = resolve(s.vod_url, this.baseUrl);
                return {
                    title: s.vod_name,
                    imageUrl: null,
                    data: {
                        url
                    }
                }
            })
        };
        for (let i = 0; i < result.data.length; i++) {
            result.data[i].imageUrl = await this.getImageUrl(result.data[i].data.url);
        }
        return result;
    }
}