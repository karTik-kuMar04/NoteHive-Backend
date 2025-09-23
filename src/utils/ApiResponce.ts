class API_RES {
    statusCode: number;
    data: any | null;
    success: boolean;
    message: string;
    constructor(
        statusCode: number,
        data: any | null,
        message: string = 'success',
    ) {
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode >= 200 && statusCode < 400;
        this.message = message;
    }
}