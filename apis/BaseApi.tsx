import {BaseApiError} from "./../apis/Errors/BaseApiError"

export default class BaseApi {
    
    async HandleError(error : any) : Promise<any> {
        console.debug("Transforming error to ServiceError")
        console.log(error)
        if(error instanceof Response){
            let response = error as Response
            let bodyText = "Fejl i data fra bagvedliggende api" // Bliver overskrevet såfremt vi godt kan få teksten ud fra response
            throw new BaseApiError(response, bodyText,response.status!)
        }
        
        throw error;
        
    }


}
  