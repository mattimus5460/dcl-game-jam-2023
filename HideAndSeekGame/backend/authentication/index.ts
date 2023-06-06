import express, { NextFunction, Request, Response } from "express"
import bodyParser from "body-parser";
import path from "path";
import * as dcl from 'decentraland-crypto-middleware'
import {
    createPayload,
    extractAuthChain, verifyExpiration,
    verifyMetadata,
    verifySign,
    verifyTimestamp,
} from "decentraland-crypto-middleware/lib/verify"
import {
    AUTH_METADATA_HEADER,
    AUTH_TIMESTAMP_HEADER,
    DEFAULT_ERROR_FORMAT,
    Options,
} from "decentraland-crypto-middleware/lib/types"

const PORT = process.env.PORT || 7777;
const STATIC_PATH = __dirname.includes("build")
    ? path.join(__dirname, "dist")
    : path.join(__dirname, "build", "dist");

console.log("Static file path", STATIC_PATH);

const app = express();
const options: Options = {
    catalyst: '127.0.0.1:8000'
}
app.use(express.static(STATIC_PATH));
app.use(bodyParser.json());

const verify = async (method: string,
                    path: string,
                    headers: Record<string, string | string[] | undefined>,
                    options: Options = {}) => {
    console.log('started function getting authChain');
    const authChain = extractAuthChain(headers)
    console.log('function getting timestamp');
    const timestamp = verifyTimestamp(headers[AUTH_TIMESTAMP_HEADER])
    console.log('function getting metadata');
    const metadata = verifyMetadata(headers[AUTH_METADATA_HEADER])

    const payload = createPayload(
        method,
        path,
        headers[AUTH_TIMESTAMP_HEADER],
        headers[AUTH_METADATA_HEADER]
    )
    const ownerAddress = await verifySign(authChain, payload, options)
    verifyExpiration(timestamp, options)
    return {
        auth: ownerAddress,
        authMetadata: metadata,
    }
}
// app.use(dcl.express({ optional: false, catalyst: '127.0.0.1:8000', }))


const middleWare = (req: Request, res: Response, next: NextFunction) => {
    const header = JSON.parse(req.headers['x-identity-auth-chain-2'] as string);
    const [method, url, timestamp, ...rest] = header.payload.split(':');
    // console.log(header.payload);
    // console.log(newV);
    // header.payload = newV;

    // req.headers['x-identity-auth-chain-2'] =  JSON.stringify(header.payload);
    console.log(method, url, JSON.stringify(req.headers, null, 2) )
    verify(method, req.baseUrl + url, req.headers, options)
        .then((data) => {
            Object.assign(req, data)
            next(null)
        })
        .catch((err) => {
            console.log(err);
            if (!options.optional) {
                const status = err.statusCode || err.status || 500
                const onError = options.onError ?? DEFAULT_ERROR_FORMAT
                res.status(status).send(onError(err))
            } else {
                next(null)
            }
        })
}
app.get(
    '/user/verify',
    middleWare,
    // @ts-ignore
    (req: Request & dcl.DecentralandSignatureData, res) => {
        const address: string = req.auth;
        const metadata: Record<string, any> = req.authMetadata;
        console.log('request', req.auth, req.authMetadata)

        res.status(200).json({
            "X-Hasura-User-Id": address,
            "X-Hasura-Role": "user",
        })
    }
)
app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
});
