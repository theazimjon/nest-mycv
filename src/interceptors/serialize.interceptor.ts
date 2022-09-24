import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

interface ClassConstructor {
  new(...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: ClassConstructor) {
  }

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> | Promise<Observable<any>> {
    // run something before req. is handled by the req. handler
    // put your code for before req income
    // console.log("I'm running before the handler", context);

    return handler.handle().pipe(
      map((data: ClassConstructor) => {
        //put your code here for after outcome
        // console.log("I'm running after response sent out");

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true //only share marked Expose
        });
      })
    );
  }
}