export enum ShippingStatus {
  CHUA_THANH_TOAN = 'Chưa thanh toán',
  DA_THANH_TOAN = 'Đã thanh toán',
  CHO_XAC_NHAN  = 'Chờ xác nhận',
  BI_HUY = 'Bị hủy',
  DANG_CHUAN_BI_HANG = 'Đang chuẩn bị hàng',
  DANG_VAN_CHUYEN = 'Đang vận chuyển',
  DA_GIAO_HANG = 'Đã giao hàng',
  DA_TRA_HANG = 'Đã trả hàng',
  DA_NHAN = 'Đã nhận',
}
export enum PaymentMethod {
  COD = 'COD',
  ATM = 'ATM',
}