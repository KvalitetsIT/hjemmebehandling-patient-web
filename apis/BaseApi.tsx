import { BaseApiError } from "./../apis/Errors/BaseApiError"

export default class BaseApi {

    async HandleError(error: any): Promise<any> {
        console.debug("Transforming error to ServiceError")
        console.log(error)
        if (error instanceof Response) {
            let response = error as Response
            let bodyText = await error.text()
            try {
                let json: bodyObj = JSON.parse(bodyText)
                throw new BaseApiError(response, json.error, response.status!)
            } catch(error){
                console.log(error)
                throw new BaseApiError(response, bodyText, response.status!)
            }
            
        }

        throw error;

    }


}

interface bodyObj {
    timestamp?: Date;
    status?: number;
    error?: string;
    path?: string
}