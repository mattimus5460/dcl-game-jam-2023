"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const verify_1 = require("decentraland-crypto-middleware/lib/verify");
const types_1 = require("decentraland-crypto-middleware/lib/types");
const PORT = process.env.PORT || 7777;
const STATIC_PATH = __dirname.includes("build")
    ? path_1.default.join(__dirname, "dist")
    : path_1.default.join(__dirname, "build", "dist");
console.log("Static file path", STATIC_PATH);
const app = (0, express_1.default)();
const options = {
    catalyst: '127.0.0.1:8000'
};
app.use(express_1.default.static(STATIC_PATH));
app.use(body_parser_1.default.json());
const verify = async (method, path, headers, options = {}) => {
    console.log('started function getting authChain');
    const authChain = (0, verify_1.extractAuthChain)(headers);
    console.log('function getting timestamp');
    const timestamp = (0, verify_1.verifyTimestamp)(headers[types_1.AUTH_TIMESTAMP_HEADER]);
    console.log('function getting metadata');
    const metadata = (0, verify_1.verifyMetadata)(headers[types_1.AUTH_METADATA_HEADER]);
    const payload = (0, verify_1.createPayload)(method, path, headers[types_1.AUTH_TIMESTAMP_HEADER], headers[types_1.AUTH_METADATA_HEADER]);
    const ownerAddress = await (0, verify_1.verifySign)(authChain, payload, options);
    (0, verify_1.verifyExpiration)(timestamp, options);
    return {
        auth: ownerAddress,
        authMetadata: metadata,
    };
};
// app.use(dcl.express({ optional: false, catalyst: '127.0.0.1:8000', }))
const middleWare = (req, res, next) => {
    const header = JSON.parse(req.headers['x-identity-auth-chain-2']);
    const [method, url, timestamp, ...rest] = header.payload.split(':');
    // console.log(header.payload);
    // console.log(newV);
    // header.payload = newV;
    // req.headers['x-identity-auth-chain-2'] =  JSON.stringify(header.payload);
    console.log(method, url, JSON.stringify(req.headers, null, 2));
    verify(method, req.baseUrl + url, req.headers, options)
        .then((data) => {
        Object.assign(req, data);
        next(null);
    })
        .catch((err) => {
        console.log(err);
        if (!options.optional) {
            const status = err.statusCode || err.status || 500;
            const onError = options.onError ?? types_1.DEFAULT_ERROR_FORMAT;
            res.status(status).send(onError(err));
        }
        else {
            next(null);
        }
    });
};
app.get('/user/verify', middleWare, 
// @ts-ignore
(req, res) => {
    const address = req.auth;
    const metadata = req.authMetadata;
    console.log('request', req.auth, req.authMetadata);
    res.status(200).json({
        "X-Hasura-User-Id": address,
        "X-Hasura-Role": "user",
    });
});
app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
});
