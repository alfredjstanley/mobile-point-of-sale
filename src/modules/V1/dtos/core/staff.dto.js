/**
 * Staff Data Transfer Object
 *
 * @typedef {Object} StaffDTO
 * @property {string} id - Unique identifier of the staff member.
 * @property {string} storeId - Store ID associated with the staff member.
 * @property {string} userProfile - User profile ID of the staff member.
 * @property {string} phoneNumber - Staff member's phone number.
 * @property {string} role - Role of the staff member (e.g., "Administrator").
 * @property {string} createdBy - ID of the user who created this staff member.
 * @property {string} status - Status of the staff member (e.g., "ACTIVE").
 * @property {string} lastLoginAt - Timestamp of the last login.
 * @property {number} loginCount - Number of times the staff member has logged in.
 * @property {Array<Object>} loginHistory - Array of login history records.
 * @property {string} loginHistory[].id - Unique identifier of the login record.
 * @property {string} loginHistory[].loginAt - Timestamp of the login event.
 * @property {string} createdAt - Timestamp when the staff member was created.
 * @property {string} updatedAt - Timestamp when the staff member was last updated.
 *
 * @example
 * {
 *   "id": "672094ca7ba6a770e00e1e70",
 *   "storeId": "672094a57ba6a770e00e1e63",
 *   "userProfile": {
        "_id": "672094ca7ba6a770e00e1e6e",
        "username": "+916901037367",
        "name": "alfredjstanley",
        "gender": "not-specified",
        "avatar": null,
        "email": null,
        "emailVerified": false,
        "createdAt": "2024-10-29T07:54:50.144Z",
        "updatedAt": "2024-10-29T07:54:50.144Z"
      },
 *   "phoneNumber": "+916901037367",
 *   "role": "Administrator",
 *   "createdBy": "672094a57ba6a770e00e1e65",
 *   "status": "ACTIVE",
 *   "lastLoginAt": "2024-10-29T07:54:50.143Z",
 *   "loginCount": 1,
 *   "loginHistory": [
 *     {
 *       "id": "672094ca7ba6a770e00e1e71",
 *       "loginAt": "2024-10-29T07:54:50.143Z"
 *     }
 *   ],
 *   "createdAt": "2024-10-29T07:54:50.185Z",
 *   "updatedAt": "2024-10-29T07:54:50.185Z"
 * }
 */

class StaffDTO {
  /**
   * Creates a StaffDTO instance.
   *
   * @param {Object} staff - The raw staff data from the database or service.
   * @param {string} staff._id - Unique identifier.
  //  * @param {string} staff.storeId - Store ID associated with the staff member.
   * @param {string} staff.userProfile - User profile
   * @param {string} staff.phoneNumber - Staff member's phone number.
   * @param {string} staff.role - Role of the staff member.
   * @param {string} staff.createdBy - ID of the creator.
   * @param {string} staff.status - Status of the staff member.
   * @param {string} staff.lastLoginAt - Last login timestamp.
   * @param {number} staff.loginCount - Number of logins.
   * @param {Array<Object>} staff.loginHistory - Array of login records.
   * @param {string} staff.createdAt - Creation timestamp.
   * @param {string} staff.updatedAt - Last update timestamp.
   */
  constructor(staff) {
    this.id = staff._id;
    this.name = staff.userProfile.name;
    this.phoneNumber = staff.phoneNumber;
    this.role = staff.role;
    this.status = staff.status;
    this.lastLoginAt = staff.lastLoginAt;
    this.loginCount = staff.loginCount;
  }
}

module.exports = StaffDTO;
