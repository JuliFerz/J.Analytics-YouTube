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
        })
        .catch(() => `[⚠️]: Invalid video ID: ${idVideo}`)

}

// getInfoVideo('wVa78g6yZ0g')
// getUserIdYT('https://www.youtube.com/watch?v=wVa78g6yZ0g&t=57s')


const finalResults = []
const getFirsPageAllVideos = function (channelId) {
    let maxResults;
    const order = 'date';
    const options = {
        'url': `https://www.googleapis.com/youtube/v3/search?order=${order}&part=snippet,id&key=${API_KEY}&channel_id=${channelId}`,
        'method': 'GET',
        'json': true
    };
    return request(options).promise()
        .then(json => {
            maxResults = json['pageInfo']['totalResults'];
            options['url'] = options['url'].concat(`&maxResults=${maxResults}`)
            console.log(options);

            /------porTestear------/
            /* return request(options).promise()
                .then((json) => {
                    // finalResults.push(json.items)
                    // return fs.appendFileSync(filename, `module.exports = ${JSON.stringify(...finalResults)}`)
                    return fs.appendFileSync(filename, `module.exports = ${JSON.stringify(json.items)}`)
                }) */
        })
        .catch(err => {
            let newError = err;
            if (err.statusCode == 403) {
                newError = { 'Status': 'Forbidden', 'Code': err['statusCode'], 'Message': err['error']['error']['message'] }
            }
            return console.log(newError)
        })
}
// getFirsPageAllVideos('UCial3fJD0pEfK1_FYKDW25g');

module.exports = { getUserIdYT, getInfoVideo };