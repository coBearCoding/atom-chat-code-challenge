import {Response} from 'express';


export function sendResponse(res: Response, data: any, status: number,message: string, errors: string[]){
    res.status(status)
        .json({
        "data": data,
        "message" : message,
        "errors": errors
    });
}