class ServiceResponse {
  success: boolean;
  data: any;
  error: string;
  constructor(data: any, error: string, success: boolean) {
    this.success = success;
    this.data = data;
    this.error = error;
  }
}

export default ServiceResponse;
