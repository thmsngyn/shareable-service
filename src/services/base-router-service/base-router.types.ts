import { ShareableErrorCodes } from "./base-router.constants";

export interface ShareableError {
  message?: string;
  code?: ShareableErrorCodes;
  status?: number;
  errmsg?: any; // Mongoose error message
}
