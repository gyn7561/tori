
import axios from "axios";
import * as cheerio from 'cheerio';


export default class YHDM {

    //计划在这里注入webview 用于处理比较麻烦的数据
    constructor({ }) {
        this.baseUrl = "http://www.yinghuacd.com/";
    }

    async getConfig() {

    }

    async init({ }) {

    }

    async getDataSourceInfo() {
        return {
            version: 0.1,
            author: "",
        }
    }

    async getTabs() {
        let res = await axios.get(this.baseUrl);
        let $ = cheerio.load(res.data);
        let doms = $(".dmx li>a");
        let result = doms.toArray().map(e => {
            return {
                text: $(e).text(),
                data: {
                    url: new URL($(e).attr("href"), this.baseUrl).toString()
                }
            }
        })
        return result;
    }

    async getTabInfo({ text, data }) {
        let res = await axios.get(data.url);
        let $ = cheerio.load(res.data);
        let domWithImg = $("[href^='/show'] img");
        let result = domWithImg.toArray().map(d => {
            return {
                title: $(d).attr("alt"),
                imageUrl: $(d).attr("src"),
                data: {
                    url: new URL($(d.parent).attr("href"), data.url).toString()
                }
            }
        })
        return {
            type: "simple",
            data: result
        };
    }

    async getSeriesInfo(data) {

    }

    async getVideoInfo(data) {

    }
}