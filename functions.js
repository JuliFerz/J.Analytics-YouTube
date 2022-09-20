'use strict';
const request = require('request-promise')
const Promise = require('bluebird')
const _ = require('lodash')
const fs = require('fs');
const filename = 'export.js'
const country = require('./aux_data/countries');

const getInfoVideo = function (idVideo) {
    return request.get({
        'url': `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,player,statistics,status,topicDetails&key=${API_KEY}&id=${idVideo}`,
        'method': 'GET',
        'json': true
    }).promise()
        .then((JSON) => {
            if (!_.isEmpty(JSON.items)) {
                return JSON
            } else {
                return {}
            }
        })
}

const getIdVideo = (video) => video.split(/..[=]|.[=]|[&]../)[1]

const getUserIdYT = function (video) {
    let idVideo = getIdVideo(video)
    let idChannel;

    return getInfoVideo(idVideo)
        .then((json) => { return json.items })
        .then(([item]) => {
            idChannel = _.get(item, 'snippet.channelId') || 'No user found';
            return idChannel
        }) // falta catch youtube
        .catch(() => `[⚠️]: Invalid video ID: ${idVideo}`)
}


const getListVideos = function (
    order,
    API_KEY,
    channelId,
    maxResults = 5,
    pageToken = ''
) {
    return request.get({
        'url': `https://www.googleapis.com/youtube/v3/search?order=${order}&part=snippet,id&key=${API_KEY}&channel_id=${channelId}&maxResults=${maxResults}&pageToken=${pageToken}`,
        'method': 'GET',
        'json': true
    }).promise()
}

const pushElementsOnArray = function (arr, obj) {
    for (const item of arr) { obj.push(item) }
}

const finalResults = []
let maxResults;
const getAllVideos = function (channelId) {

    let nextPageToken;
    return getListVideos('date', API_KEY, channelId)
        .tap(json => {
            maxResults = json['pageInfo']['totalResults'];
        })
        .then(() => {
            return getListVideos('date', API_KEY, channelId, maxResults)
                .then(json => {
                    if (maxResults == json['pageInfo']['resultsPerPage'])
                        return fs.appendFileSync(filename, `module.exports = ${JSON.stringify(json['items'])}`);
                    else {
                        pushElementsOnArray(json['items'], finalResults);
                        // FIX
                        for (let i = 0; ; i++) {
                            nextPageToken = _.get(json, 'nextPageToken');
                            console.log('AAAAAAAAAA', json)
                            if (nextPageToken) {
                                console.log('entre en nextPageToken')
                                getListVideos('date', API_KEY, channelId, maxResults, nextPageToken)
                                    .then((json) => {
                                        return console.log('BBBBBBBBBB', json)
                                    })
                                break
                            } else {
                                console.log('TENGO QUE SALIR')
                                pushElementsOnArray(json['items'], finalResults);
                                break;
                            }
                        }
                        return fs.appendFileSync(filename, `module.exports = ${JSON.stringify(finalResults)}`);
                    }
                })
            // FIX
            /* .catch(err => {
                let newError = err;
                if (err.statusCode == 403) {
                    newError = { 'Status': 'Forbidden', 'Code': err['statusCode'], 'Message': err['error']['error']['message'] }
                }
                return console.log(newError)
            }) */
        })
}


module.exports = { getUserIdYT, getInfoVideo, getAllVideos };