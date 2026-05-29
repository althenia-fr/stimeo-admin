export function prettyPrintErrorMsg(jqXHR) {
    //Google Cloud Platform workaround for bug #7985 https://code.google.com/p/googleappengine/issues/detail?id=7985
    let cleansedResponseText = jqXHR.statusText;

    let payload = null;
    if(jqXHR.responseText) payload = jqXHR.responseText
    else if(jqXHR.data) payload = jqXHR.data

    if (payload &&  (typeof payload === 'string' || payload instanceof String) && payload.indexOf('<title>') > -1) {
        //PROD: skip first 4 chars which are the HTTP code on 3 chars followed by space, followed by the error message
        //ex: <html><head><meta http-equiv="content-type" content="text/html;charset=utf-8"><title>401 code invalid or expired</title></head><body text=#000000 bgcolor=#ffffff><h1>Error: code invalid or expired</h1></body></html>

        cleansedResponseText = payload.split("<title>")[1].split("</title>")[0];

        //DEV: skip first 10 chars as we received <title>Error 401 code invalid or expired</title>
        let skipChars = cleansedResponseText.indexOf('Error') == 0 ? 10 : 4;

        cleansedResponseText = cleansedResponseText.substring(skipChars);

        //html text might have " protected as &quot; if we tried to pass json through
        cleansedResponseText = cleansedResponseText.replace(/(&quot;)/g, "\"");

    }

    return cleansedResponseText;
}