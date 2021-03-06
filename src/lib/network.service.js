const Service = {
    checkExpress: checkExpress,
    analysisExpress: analysisExpress,
    getExpressList: getExpressList,
    getCount: getCount,
    rate: rate,
    getStatistics: getStatistics
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

function checkExpress(logisticCode, company_code, useAnalysis, analysisPlatform) {
    let url = '/api/check/';
    let sendType = 'POST';
    let body = "logisticCode=" + logisticCode + "&shipperCode=" + company_code + "&useAnalysis=" + useAnalysis + "&analysisPlatform=" + analysisPlatform;
    return loadingData(url,sendType,null,body)
}

function analysisExpress(logisticCode) {
    let url = '/api/analysis?logisticCode=' + logisticCode;
    let sendType = 'GET';
    return loadingData(url,sendType,null,null)
}

function getCount() {
    let url = '/api/count';
    let sendType = 'GET';
    return loadingData(url, sendType, null, null)
}

function getExpressList () {
    let url = '/api/list';
    let sendType = 'GET';
    return loadingData(url, sendType, null, null)
}

function rate (message, email, stars) {
    let url = '/api/rate';
    let sendType = 'POST';
    let body = 'message=' + message + '&email=' + email + '&stars=' + stars;
    return loadingData(url, sendType, null, body)
}

function getStatistics() {
    let url = '/api/statistics';
    let sendType = 'GET';
    return loadingData(url, sendType, null, null)
}

export default Service;
