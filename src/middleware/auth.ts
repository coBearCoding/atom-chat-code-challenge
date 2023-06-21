import {Request, Response, NextFunction} from "express";
import {sendResponse} from '../helpers/response';
import {constants} from "http2";

export function validApiKey(req: Request, res: Response, next: NextFunction){
    let clientApiKey = req.header("x-api-key");
    const appApiKey = process.env.APP_API_KEY;

    if (appApiKey != clientApiKey) {
        sendResponse(res, null, constants.HTTP_STATUS_UNAUTHORIZED, "", "invalid api key");
        return
    }
    next();
}