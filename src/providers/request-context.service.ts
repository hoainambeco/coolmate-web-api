import * as requestContext from 'request-context';
import { REQUEST_NAMESPACE } from "./strings";

export class RequestContext {
  static get<T>(key: string): T {
    return requestContext.get(RequestContext.getNamespace(key));
  }

  static set(key: string, value: any): void {
    requestContext.set(RequestContext.getNamespace(key), value);
  }

  static getNamespace(key: string) {
    return `${REQUEST_NAMESPACE}:${key}`;
  }
}
