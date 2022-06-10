
import axios from "axios";
import * as cheerio from 'cheerio';
import resolve from '@jridgewell/resolve-uri';


export default class YHDM {

    //计划在这里注入webview 用于处理比较麻烦的数据
    constructor({ }) {
        this.baseUrl = "http://www.yinghuacd.com/";
    }

    async getConfig() {
    }

    async init({ }) {

    }

    getDataSourceInfo() {
        return {
            version: 0.1,
            author: "",
            id: "AGEM123-TORI",
        }
    }

    async getCatagoryList() {
        let res = await axios.get(this.baseUrl);
        let $ = cheerio.load(res.data);
        let doms = $(".dmx li>a");
        let result = doms.toArray().map(e => {
            return {
                text: $(e).text(),
                data: {
                    url: resolve($(e).attr("href"), this.baseUrl)
                }
            }
        })
        return result;
    }

    async getCatagoryInfo({ text, data }) {
        let res = await axios.get(data.url);
        let $ = cheerio.load(res.data);
        let domWithImg = $("[href^='/show'] img");
        let result = domWithImg.toArray().map(d => {
            return {
                title: $(d).attr("alt"),
                imageUrl: $(d).attr("src"),
                data: {
                    url: resolve($(d.parent).attr("href"), data.url)
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
        let videoList = $(".movurl a[href^='/v/']").toArray().map(dom => {
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
                title: $("h1").text().trim(),
                info: $(".info").text().trim(),
                videoList: videoList,
                imageUrl: $(".thumb img").attr("src")
            }
        };
    }

    async getVideoInfo({ text, data }) {
        let { url } = data;
        let res = await axios.get(url);
        let $ = cheerio.load(res.data);
        let vid = $("[data-vid]").attr("data-vid");
        let m3u8Address = vid.replace("$mp4", "");
        return {
            address: m3u8Address,
            type: "m3u8"
        };
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