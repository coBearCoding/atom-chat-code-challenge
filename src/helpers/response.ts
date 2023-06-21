import {Response} from 'express';


export function sendResponse(res: Response, data: any, status: number,message: string, error:string){
    res.status(status)
        .json({
        "data": data,
        "message" : message,
        "error": error
    });
}