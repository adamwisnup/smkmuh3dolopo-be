export interface ResponseError {
  meta: {
    code: number;
    success: boolean;
    message: string;
  };
}

export interface ResponseSuccess {
  meta: {
    code: number;
    success: boolean;
    message: string;
  };
  data?: any;
}