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
    this.userId=userId,
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

  setPaymentId(paymentId:number):void{
    this.paymentId=paymentId
  }

  setOrderId(orderId:number):void{
    this.orderId=orderId
  }

  setUserId(userId:number):void{
    this.userId=userId
  }

  setPaymentMethod(paymentMethod:string):void{
    this.paymentMethod=paymentMethod
  }

  setPaymentStatus(paymentStatus:string):void{
    this.paymentStatus=paymentStatus
  }

  setPaymentAmount(paymentAmount:number):void{
    this.paymentAmount=paymentAmount
  }
}
