/**
 * Payment Domain Entity
 * Pure business logic - NO external dependencies
 */

export interface PaymentItem {
  subjects: string[];
  sheets: string[];
}

export class Payment {
  constructor(
    public readonly id: number,
    public userId: string | null,
    public username: string | null,
    public price: number,
    public day: number | null,
    public subjects: string[] | null,
    public sheets: string[] | null,
    public status: boolean,
    public activate: boolean,
    public activateCode: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
  ) {}

  /**
   * Business logic: Check if payment is successful
   */
  isSuccessful(): boolean {
    return this.status === true;
  }

  /**
   * Business logic: Check if payment is activated
   */
  isActivated(): boolean {
    return this.activate === true;
  }

  /**
   * Business logic: Calculate expiry date from payment date
   */
  calculateExpiryDate(): Date | null {
    if (!this.day || !this.createdAt) return null;
    const expiry = new Date(this.createdAt);
    expiry.setDate(expiry.getDate() + this.day);
    return expiry;
  }

  /**
   * Business logic: Check if has any subjects or sheets
   */
  hasItems(): boolean {
    return (
      (this.subjects && this.subjects.length > 0) ||
      (this.sheets && this.sheets.length > 0)
    );
  }

  /**
   * Business logic: Get total items count
   */
  getTotalItemsCount(): number {
    const subjectCount = this.subjects?.length || 0;
    const sheetCount = this.sheets?.length || 0;
    return subjectCount + sheetCount;
  }
}
