const Service = {
    checkExpress: checkExpress,
    analysisExpress: analysisExpress
};
// const baseurl = '/napi';    // 开发用这个
const baseurl = '/api'; // 部署用这个
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

function checkExpress(logisticCode, company_code) {
    let url = '/api/check/';
    let sendType = 'POST';
    let body = "logisticCode=" + logisticCode + "&shipperCode=" + company_code;
    return loadingData(url,sendType,null,body)
}

function analysisExpress(logisticCode) {
    let url = '/api/analysis?logisticCode=' + logisticCode;
    let sendType = 'GET';
    let body = null;
    return loadingData(url,sendType,null,body)
}

export default Service;
