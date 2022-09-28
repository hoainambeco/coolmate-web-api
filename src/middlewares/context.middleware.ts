import * as requestContext from 'request-context';
import { REQUEST_NAMESPACE } from "../providers/strings";

export const ContextMiddleware = requestContext.middleware(REQUEST_NAMESPACE);
