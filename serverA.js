const express = require('express');
const MockApp = new express();
const Api = require('./Api');
const fs = require('fs');
const path = require('path');
const expressproxy = require('express-http-proxy');

MockApp.engine('.html', require('ejs').__express);
MockApp.set('view engine', 'html');
MockApp.use('/common/',express.static('views/common'));
MockApp.use('/miAssets/',express.static('views/miAssets'));
MockApp.use('/audio/', express.static('audio'));
// if(process.env.NODE_ENV=='mock'){
    MockApp.get(`/api/wx/*`, function(req, res){
        console.log(`wx`);
        let _info = fs.readFileSync(path.join(__dirname, `/apiDatas/wx.json`), 'utf-8'),
            info = JSON.parse(_info);
        res.json(info);
    });
    
    // MockApp.get(`/api/wx/1.mp3`, function(req, res){
    //     res.download(`${__dirname}/apiDatas`, '1.mp3');
    // })
    for(let key in Api.COMMON){
        MockApp.use(`/api${Api.COMMON[key]}`, function(req, res){
            console.log(`/api${Api.COMMON[key]}`);
            console.log(key);
            sendApiData(res, key);
        });
    }

    for(let key in Api.PRODUCT){
        MockApp.use(`/api${Api.PRODUCT[key]}`, function(req, res){
            console.log(`/api${Api.PRODUCT[key]}`);
            console.log(key);
            sendApiData(res, key);
        });
    }

    for(let key in Api.LOGIN){
        MockApp.use(`/api${Api.LOGIN[key]}`, function(req, res){
            console.log(`/api${Api.LOGIN[key]}`);
            console.log(key);
            sendApiData(res, key);
        });
    }
// }
function sendApiData(res, key){
    let info, 
        _info = fs.readFileSync(path.join(__dirname, `/apiDatas/${key}.json`), 'utf-8');
    if(_info){
        info = JSON.parse(_info);
    }else{
        info = {};
    }
    res.json(info);
}
MockApp.listen(9001, () => {
    console.log('Mock server on http://localhost:9001');
});
// module.exports = MockApp;
