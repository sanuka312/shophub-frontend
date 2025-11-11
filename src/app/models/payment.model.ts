export default class Payment{
  paymentId:number;
  orderId:number;
  userId:number;
  paymentMethod:string;
  paymentStatus:string;
  paymentAmount:number;

  constructor(
    paymentId:number,
    orderId:number,
    userId:number,
    paymentMethod:string,
    paymentStatus:string,
    paymentAmount:number,
  ){
    this.paymentId=paymentId,
    this.orderId=orderId,
    this.userId=userId
    this.paymentMethod=paymentMethod,
    this.paymentStatus=paymentStatus,
    this.paymentAmount=paymentAmount
  }

  getPaymentId():number{
    return this.paymentId
  }

  getOrderId():number{
    return this.orderId
  }

  getUserId():number{
    return this.userId
  }

  getPaymentMethod():string{
    return this.paymentMethod
  }

  getPaymentStatus():string{
    return this.paymentStatus
  }

  getPaymentAmount():number{
    return this.paymentAmount
  }
}
