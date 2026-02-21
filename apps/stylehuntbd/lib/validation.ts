import { operator } from "bd-phone-number-validator";
export function validateBDPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false;
  const result = operator(phoneNumber);
  return !!result.isValid;
}
export function validateAddress(address: string): boolean {
  if (!address) return false;
  return address.trim().length >= 10;
}
export function formatBDPhoneNumber(phoneNumber: string): string {
  const result = operator(phoneNumber);
  if (result.isValid && result.phoneNumber) {
    return result.phoneNumber;
  }
  return phoneNumber;
}
