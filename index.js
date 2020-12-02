import http from "http";
import fs from "fs";

const DEFAULT_LOCATION = "/client.html";

const DEFAULT_EXT = "js";
const CHARSET = "utf-8";

const PORT = 3000;

const MIMETYPE_LOOKUP = {
    "html": "text/html",
    "css": "text/css",
    "json": "application/json",
    "js": "text/javascript"
}

const LOCATION_CLIENT = "/client";

http.createServer((req, res) => sendResponse(req.url, res)).listen(PORT);

function sendResponse(url, res) {
    url = url === "/" ? DEFAULT_LOCATION : updateUrl(url);
    const stream = fs.createReadStream([process.cwd(), LOCATION_CLIENT, url].join(""));
    const mimeType = getMimeType(url);
    stream.on("open", () => {
        setContentType(res, mimeType);
        stream.pipe(res);
    });
    stream.on("error", (err) => {
        sendResponse(DEFAULT_LOCATION, res)
    });
}

function updateUrl(url) {
    return getExt(url) ? url : [url, DEFAULT_EXT].join(".");
}

function setContentType(res, type) {
    res.setHeader("Content-Type", `${type};charset=${CHARSET}`);
    res.setHeader("encoding", CHARSET);
}

function getExt(url) {
    const segs = url.split(".");
    if(segs.length > 1) {
        return segs[segs.length - 1];
    }
}

function getMimeType(url) {
    return MIMETYPE_LOOKUP[getExt(url)];
}