import {Request, Response, NextFunction} from "express";
import Helpers from '../helpers/response';
import {constants} from "http2";

function validApiKey(req: Request, res: Response, next: NextFunction){
    let clientApiKey = req.header("x-api-key");
    const appApiKey = process.env.APP_API_KEY;

    if (appApiKey != clientApiKey) {
        Helpers.sendResponse(res, null, constants.HTTP_STATUS_UNAUTHORIZED, "", "invalid api key");
        return
    }
    next();
}


export {
    validApiKey
}