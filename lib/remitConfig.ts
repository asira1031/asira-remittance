export const remitConfig = {
  mode: process.env.REMIT_MODE || "PRODUCTION",

  receivingBankName:
    process.env.REMIT_RECEIVING_BANK_NAME || "",

  receivingAccountName:
    process.env.REMIT_RECEIVING_ACCOUNT_NAME || "",

  receivingAccountNumber:
    process.env.REMIT_RECEIVING_ACCOUNT_NUMBER || "",

  receivingBranch:
    process.env.REMIT_RECEIVING_BRANCH || "",

  paymentMode:
    process.env.REMIT_PAYMENT_MODE || "TEST",
};