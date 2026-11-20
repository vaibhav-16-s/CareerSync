// ============================================================================
// InternBridge — shared frontend types (mirror of the backend contract)
// ============================================================================
// ---------- Enums ----------
export var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["COMPANY"] = "company";
    UserRole["ADMIN"] = "admin";
})(UserRole || (UserRole = {}));
export var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["BANNED"] = "banned";
    UserStatus["PENDING"] = "pending";
})(UserStatus || (UserStatus = {}));
export var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["PENDING"] = "pending";
    VerificationStatus["VERIFIED"] = "verified";
    VerificationStatus["REJECTED"] = "rejected";
})(VerificationStatus || (VerificationStatus = {}));
export var InternshipStatus;
(function (InternshipStatus) {
    InternshipStatus["DRAFT"] = "draft";
    InternshipStatus["ACTIVE"] = "active";
    InternshipStatus["CLOSED"] = "closed";
    InternshipStatus["REMOVED"] = "removed";
})(InternshipStatus || (InternshipStatus = {}));
export var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["SHORTLISTED"] = "shortlisted";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["HIRED"] = "hired";
    ApplicationStatus["WITHDRAWN"] = "withdrawn";
})(ApplicationStatus || (ApplicationStatus = {}));
export var Proficiency;
(function (Proficiency) {
    Proficiency["BEGINNER"] = "beginner";
    Proficiency["INTERMEDIATE"] = "intermediate";
    Proficiency["ADVANCED"] = "advanced";
})(Proficiency || (Proficiency = {}));
export var NotificationType;
(function (NotificationType) {
    NotificationType["APPLICATION_STATUS"] = "application_status";
    NotificationType["NEW_APPLICANT"] = "new_applicant";
    NotificationType["NEW_MATCH"] = "new_match";
    NotificationType["COMPANY_VERIFIED"] = "company_verified";
    NotificationType["SYSTEM"] = "system";
})(NotificationType || (NotificationType = {}));
