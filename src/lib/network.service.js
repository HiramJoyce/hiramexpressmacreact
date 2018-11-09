const Service = {
    checkExpress: checkExpress,
    analysisExpress: analysisExpress,
    getTodayCount: getTodayCount,
    getExpressList: getExpressList
};
// const baseurl = '';    // mac用这个且不提交
const baseurl = '/napi'; // window开发和部署用这个
//接口方法封装
function loadingData(url, sendType, headers, body){
    let finalUrl = baseurl+url;
    let finalheaders = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };
    if (headers!==null) {
        finalheaders = headers;
    }
    return fetch(finalUrl, {
        method: sendType,
        withCredentials: true,
        credentials: 'include',
        headers: finalheaders,
        body: body
    }).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log('*****'+error);
        throw error;
    })
}

function checkExpress(logisticCode, company_code, useAnalysis) {
    let url = '/api/check/';
    let sendType = 'POST';
    let body = "logisticCode=" + logisticCode + "&shipperCode=" + company_code + "&useAnalysis=" + useAnalysis;
    return loadingData(url,sendType,null,body)
}

function analysisExpress(logisticCode) {
    let url = '/api/analysis?logisticCode=' + logisticCode;
    let sendType = 'GET';
    let body = null;
    return loadingData(url,sendType,null,body)
}

function getTodayCount () {
    let url = '/api/count';
    let sendType = 'GET';
    let body = null;
    return loadingData(url, sendType, null, body)
}

function getExpressList () {
    let url = '/api/list';
    let sendType = 'GET';
    let body = null;
    return loadingData(url, sendType, null, body)
}

export default Service;
