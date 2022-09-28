export enum CodeMessage {
  FORBIDDEN = 'FORBIDDEN', // Permission denied
  UNAUTHORIZED = 'UNAUTHORIZED',

  // user
  USER_NOT_EXIST = 'USER_NOT_EXIST',
  USER_ALREADY_EXIST = 'USER_ALREADY_EXIST',
  PASSWORD_NOT_MATCH = 'PASSWORD_NOT_MATCH', //Password do not match
  USER_IS_DELETED = 'USER_IS_DELETED',
  USER_LEFT = 'USER_LEFT',
  NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH = 'NEW_PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH',
  CURRENT_PASSWORD_INVALID = 'CURRENT_PASSWORD_INVALID',
  OTP_LIMIT = 'OTP_LIMIT', // You have exeeded the maximum number of activations allowed for the entered OTP
  OTP_INCORRECT = 'OTP_INCORRECT', // The entered OTP is incorrect
  OTP_SEND_MAIL_ERROR = 'OTP_SEND_MAIL_ERROR', // The entered OTP is incorrect

  // import data from file excel
  ALLOW_ONLY_EXCEL_FILE = 'ALLOW_ONLY_EXCEL_FILE', // Only excel file are allowed
  USER_SHEET_NOT_FOUND = 'USER_SHEET_NOT_FOUND', // user sheet in import user
  FAMYLIES_SHEET_NOT_FOUND = 'FAMYLIES_SHEET_NOT_FOUND',
  HEADER_ROW_IS_REQUIRED = 'HEADER_ROW_IS_REQUIRED',
  HEADER_ROW_IS_NOT_MATCH = 'HEADER_ROW_IS_NOT_MATCH',
  ID_IS_REQUIRED = 'ID_IS_REQUIRED',
  NAME_IN_FAMILIES_IS_REQUIRED = 'NAME_IN_FAMILIES_IS_REQUIRED', // name in family sheet is required
  RELATIONSHIP_IN_FAMILIES_IS_REQUIRED = 'RELATIONSHIP_IN_FAMILIES_IS_REQUIRED', // relationship in family sheet is required
  INVALID_BIRTHDAY_FORMAT = 'INVALID_BIRTHDAY_FORMAT', // birthday of user family format must be dd/MM/yyyy
  EMAIL_ALREADY_EXIST = 'EMAIL_ALREADY_EXIST',

  VALUE_SELECT_COLUMN_INVALID = 'VALUE_SELECT_COLUMN_INVALID', // column select value ex: column gender MALE, FEMALE, OTHER.

  SHEET_NOT_FOUND = 'SHEET_NOT_FOUND',
  STAR_COLUMN_IS_REQUIRED = 'STAR_COLUMN_IS_REQUIRED', // columns have name * ex: ID*
  DATE_COLUMN_FORMAT_INVALID = 'DATE_COLUMN_FORMAT_INVALID', // format must be dd/MM/yyyy

  // allowance
  ALLOWANCE_NOT_EXIST = 'ALLOWANCE_NOT_EXIST',
  SIGNER_NOT_EXIST = 'SIGNER_NOT_EXIST',

  // approval
  APPROVAL_NOT_EXIST = 'APPROVAL_NOT_EXIST',
  REASON_ALREADY_EXIST = 'REASON_ALREADY_EXIST',
  REASON_NOT_EXIST = 'REASON_NOT_EXIST',
  REASON_TYPE_NOT_MATCH = 'REASON_TYPE_NOT_MATCH', //Reason type does not match
  REASON_USED = 'REASON_USED',
  TIMETO_MUST_GREATER_TIMEFROM = 'TIMETO_MUST_GREATER_TIMEFROM', //timeTo must greater than timeFrom'
  ABSENCE_NOT_EXIST = 'ABSENCE_NOT_EXIST',
  INOUT_NOT_EXIST = 'INOUT_NOT_EXIST',
  LEAVE_NOT_EXIST = 'LEAVE_NOT_EXIST',
  APPROVAL_MISSION_NOT_EXIST = 'APPROVAL_MISSION_NOT_EXIST',
  OVERTIME_NOT_EXIST = 'OVERTIME_NOT_EXIST',
  CAN_NOT_LEAVE_MORE_THAN_MAX = 'CAN_NOT_LEAVE_MORE_THAN_MAX',
  DUPLICATE_TIME_RANGE = 'DUPLICATE_TIME_RANGE',
  NOT_ENOUGHT_TIME_OR_VALUE = 'NOT_ENOUGHT_TIME_OR_VALUE',
  TIME_OF_THIS_TYPE_HAS_EXCEEDED = 'TIME_OF_THIS_TYPE_HAS_EXCEEDED',
  APPROVAL_EXCEED_THE_ALLOWED_TIME = 'APPROVAL_EXCEED_THE_ALLOWED_TIME',

  // require
  REQUIRE_CATEGORY_ALREADY_EXIST = 'REQUIRE_CATEGORY_ALREADY_EXIST',
  REQUIRE_CATEGORY_NOT_EXIST = 'REQUIRE_CATEGORY_NOT_EXIST',
  PARENT_REQUIRE_CATEGORY_NOT_EXIST = 'PARENT_REQUIRE_CATEGORY_NOT_EXIST', // Parent category does not exist
  REQUIRE_NOT_EXIST = 'REQUIRE_NOT_EXIST',
  ONLY_REQUIRE_STATUS_WAITING_CAN_UPDATE = 'ONLY_REQUIRE_STATUS_WAITING_CAN_UPDATE',

  // asset
  ASSET_NOT_EXIST = 'ASSET_NOT_EXIST',
  ASSET_ALREADY_EXIST = 'ASSET_ALREADY_EXIST',
  UNIT_TYPE_WRONG = 'UNIT_TYPE_WRONG', // Unit type wrong
  BUYER_NOT_EXIST = 'BUYER_NOT_EXIST',
  ASSET_BUY_NOT_EXIST = 'ASSET_BUY_NOT_EXIST', // AssetBuy does not exist
  FROM_USER_NOT_EXIST = 'FROM_USER_NOT_EXIST',
  TO_USER_NOT_EXIST = 'TO_USER_NOT_EXIST',
  ASSET_HISTORY_NOT_EXIST = 'ASSET_HISTORY_NOT_EXIST',

  // comment
  COMMENT_NOT_EXIST = 'COMMENT_NOT_EXIST',

  // company
  COMPANY_NOT_EXIST = 'COMPANY_NOT_EXIST',
  PARENT_COMPANY_NOT_EXIST = 'PARENT_COMPANY_NOT_EXIST',
  COMPANY_ALREADY_EXIST = 'COMPANY_ALREADY_EXIST',

  // contract
  CONTRACT_CATEGORY_ALREADY_EXIST = 'CONTRACT_CATEGORY_ALREADY_EXIST',
  CONTRACT_CATEGORY_NOT_EXIST = 'CONTRACT_CATEGORY_NOT_EXIST',
  CONTRACT_NOT_EXIST = 'CONTRACT_NOT_EXIST',
  CONTRACT_WITH_NOT_EXIST = 'CONTRACT_WITH_NOT_EXIST', // user who contract with does not exist

  // department
  DEPARTMENT_ALREADY_EXIST = 'DEPARTMENT_ALREADY_EXIST',
  DEPARTMENT_NOT_EXIST = 'DEPARTMENT_NOT_EXIST',

  // decide
  DECIDE_NOT_EXIST = 'DECIDE_NOT_EXIST',
  ANY_USER_DECIDE_FOR_NOT_EXIST = 'ANY_USER_DECIDE_FOR_NOT_EXIST', // Any id in decideFor does not exist

  // degree
  DEGREE_NOT_EXIST = 'DEGREE_NOT_EXIST',
  ANY_USER_NOT_EXIST = 'ANY_USER_NOT_EXIST', // Any id in userIds does not exist

  // family
  FAMILY_NOT_EXIST = 'FAMILY_NOT_EXIST',

  // file category
  FILE_CATEGORY_ALREADY_EXIST = 'FILE_CATEGORY_ALREADY_EXIST',
  FILE_CATEGORY_NOT_EXIST = 'FILE_CATEGORY_NOT_EXIST',

  // file
  FILE_NOT_EXIST = 'FILE_NOT_EXIST',
  FILE_CAN_NOT_EMPTY = 'FILE_CAN_NOT_EMPTY',
  PARSE_FILE_CATEGORY_IDS_ERROR = 'PARSE_FILE_CATEGORY_IDS_ERROR', // Parse json fileCategoryIds error
  PARENT_FILE_NOT_EXIST = 'PARENT_FILE_NOT_EXIST',
  PARENT_FILE_MUST_BE_DERICTORY = 'PARENT_FILE_MUST_BE_DERICTORY', // Parent must be a directory
  PARSE_SHARE_USER_IDS_ERROR = 'PARSE_SHARE_USER_IDS_ERROR', // Parse json error
  PARSE_SHARE_DEPARTMENT_IDS_ERROR = 'PARSE_SHARE_DEPARTMENT_IDS_ERROR', // Parse json error
  PARENT_DIRECTORY_MUST_DIFFENT = 'PARENT_DIRECTORY_MUST_DIFFENT', // Parent must be diffent upload file
  FILE_CUT_HAS_TO_BE_A_DIRECTORY_OTHER = 'FILE_CUT_HAS_TO_BE_A_DIRECTORY_OTHER',

  // notification
  NOTIFICATION_NOT_EXIST = 'NOTIFICATION_NOT_EXIST',

  // permission assign
  PERMISSION_ASSIGN_NOT_EXIST = 'PERMISSION_ASSIGN_NOT_EXIST',
  ASSIGNER_USER_NOT_EXIST = 'ASSIGNER_USER_NOT_EXIST', // Assigner position does not exist
  ANY_USER_WHO_ASSIGNED_NOT_EXIST = 'ANY_USER_WHO_ASSIGNED_NOT_EXIST', // Any id in users does not exist
  ANY_DEPARTMENT_WHICH_ASSIGNED_NOT_EXIST = 'ANY_DEPARTMENT_WHICH_ASSIGNED_NOT_EXIST', // Any id in deperments does not exist

  // permission group
  PERMISSION_GROUP_NOT_EXIST = 'PERMISSION_GROUP_NOT_EXIST',
  PERMISSION_GROUP_EXIST = 'PERMISSION_GROUP_EXIST',

  // permission
  PERMISSION_NOT_EXIST = 'PERMISSION_NOT_EXIST',

  // permission aprroval
  APPROVER_COMPANY_NOT_EXIST = 'APPROVER_COMPANY_NOT_EXIST',
  APPROVER_DEPARTMENT_NOT_EXIST = 'APPROVER_DEPARTMENT_NOT_EXIST',
  APPROVER_POSITION_NOT_EXIST = 'APPROVER_POSITION_NOT_EXIST',
  APPROVAL_FOR_COMPANY_NOT_EXIST = 'APPROVAL_FOR_COMPANY_NOT_EXIST',
  APPROVAL_FOR_DEPARTMENT_NOT_EXIST = 'APPROVAL_FOR_DEPARTMENT_NOT_EXIST',
  APPROVAL_FOR_POSITION_NOT_EXIST = 'APPROVAL_FOR_POSITION_NOT_EXIST',
  APPROVAL_GET_OLD_COUNT_NOT_VALID_FOR_THIS_REASON = 'APPROVAL_GET_OLD_COUNT_NOT_VALID_FOR_THIS_REASON',
  APPROVAL_NOT_IN_MAXIMUM_RANGE = 'APPROVAL_NOT_IN_MAXIMUM_RANGE',
  FOR_DEPARTMENT_OR_FOR_POSITION_MUST_EXIST = 'FOR_DEPARTMENT_OR_FOR_POSITION_MUST_EXIST',
  PERMISSION_APPROVAL_FOR_THIS_POSITION_EXIST = 'PERMISSION_APPROVAL_FOR_THIS_POSITION_EXIST',
  PERMISSION_APPROVAL_OBJECT_NOT_EXIST = 'PERMISSION_APPROVAL_OBJECT_NOT_EXIST',

  // permission process active
  PERMISSION_PROCESS_NOT_EXIST = 'PERMISSION_PROCESS_NOT_EXIST',

  // position
  POSITION_NOT_EXIST = 'POSITION_NOT_EXIST',
  POSITION_ALREADY_EXIST = 'POSITION_ALREADY_EXIST',
  ANY_PERMISSION_GROUP_NOT_EXIST = 'ANY_PERMISSION_GROUP_NOT_EXIST',

  // position change
  POSITION_CHANGE_NOT_EXIST = 'POSITION_CHANGE_NOT_EXIST',
  POSITION_FROM_NOT_EXIST = 'POSITION_FROM_NOT_EXIST',
  POSITION_TO_NOT_EXIST = 'POSITION_TO_NOT_EXIST',
  DEPARTMENT_FROM_NOT_EXIST = 'DEPARTMENT_FROM_NOT_EXIST',
  DEPARTMENT_TO_NOT_EXIST = 'DEPARTMENT_TO_NOT_EXIST',

  //post
  POST_NOT_EXIST = 'POST_NOT_EXIST',

  // post file
  POST_FILE_NOT_EXIST = 'POST_FILE_NOT_EXIST',

  // project
  PROJECT_DOES_EXIST = 'PROJECT_DOES_EXIST',
  PROJECT_NOT_EXIST = 'PROJECT_NOT_EXIST',
  ANY_MANAGER_NOT_EXIST = 'ANY_MANAGER_NOT_EXIST',
  ANY_JOINER_NOT_EXIST = 'ANY_JOINER_NOT_EXIST',
  ANY_FOLLOWER_NOT_EXIST = 'ANY_FOLLOWER_NOT_EXIST',
  INVALID_TIME = 'INVALID_TIME',
  CAN_NOT_DELETE_PROCESSING_PROJECT = 'CAN_NOT_DELETE_PROCESSING_PROJECT',
  ONLY_CREATOR_OR_MANAGER_CAN_BE_UPDATE_PROJECT = 'ONLY_CREATOR_OR_MANAGER_CAN_BE_UPDATE_PROJECT',
  ONLY_CREATOR_OR_MANAGER_CAN_BE_DELETE_PROJECT = 'ONLY_CREATOR_OR_MANAGER_CAN_BE_DELETE_PROJECT',

  // interview
  INTERVIEW_NOT_EXIST = 'INTERVIEW_NOT_EXIST',
  CANDIDATE_NOT_EXIST = 'CANDIDATE_NOT_EXIST',
  ANY_CANDIDATE_NOT_EXIST = 'ANY_CANDIDATE_NOT_EXIST',
  ANY_INTERVIEWER_NOT_EXIST = 'ANY_INTERVIEWER_NOT_EXIST',
  INTERVIEW_STATUS_TYPE_WRONG = 'INTERVIEW_STATUS_TYPE_WRONG',

  OFFER_NOT_EXIST = 'OFFER_NOT_EXIST',

  // report file category
  REPORT_FILE_CATEGORY_ALREADY_EXIST = 'REPORT_FILE_CATEGORY_ALREADY_EXIST',
  REPORT_FILE_CATEGORY_NOT_EXIST = 'REPORT_FILE_CATEGORY_NOT_EXIST',

  // report file
  REPORT_FILE_NOT_EXIST = 'REPORT_FILE_NOT_EXIST',
  ANY_SHARE_USER_NOT_EXIST = 'ANY_SHARE_USER_NOT_EXIST',

  // report sheet
  REPORT_SHEET_NOT_EXIST = 'REPORT_SHEET_NOT_EXIST',

  // report sheet
  REPORT_WORK_NOT_EXIST = 'REPORT_WORK_NOT_EXIST',
  REPORT_WORK_EXIST = 'REPORT_WORK_EXIST',
  REPORT_WORK_TIME_NOT_VALID = 'REPORT_WORK_TIME_NOT_VALID',

  // reward or discipline
  REWARD_OR_DISCIPLINE_NOT_EXIST = 'REWARD_OR_DISCIPLINE_NOT_EXIST',
  REWARD_OR_DISCIPLINE_ALREADY_EXIST = 'REWARD_OR_DISCIPLINE_ALREADY_EXIST',
  DATE_START_MUST_SMALLER_OR_EQUAL_DATE_END = 'DATE_START_MUST_SMALLER_OR_EQUAL_DATE_END',

  // salary
  SALARY_NOT_EXIST = 'SALARY_NOT_EXIST',

  // schedule
  SCHEDULE_NOT_EXIST = 'SCHEDULE_NOT_EXIST',
  START_TIME_IS_REQUIRE_IF_HAS_END_TIME = 'START_TIME_IS_REQUIRE_IF_HAS_END_TIME',

  // task
  TASK_NOT_EXIST = 'TASK_NOT_EXIST',
  PARENT_TASK_NOT_EXIST = 'PARENT_TASK_NOT_EXIST',
  PARENT_TASK_MUST_DIFFENT_THIS_TASK = 'PARENT_TASK_MUST_DIFFENT_THIS_TASK',
  ANY_ASSIGNEES_NOT_EXIST = 'ANY_ASSIGNEES_NOT_EXIST',
  INVALID_START_TIME = 'INVALID_START_TIME',
  INVALID_END_TIME = 'INVALID_END_TIME',
  TASK_WAS_CANCELED = 'TASK_WAS_CANCELED',
  TASK_WAS_COMPLETED = 'TASK_WAS_COMPLETED',
  INVALID_PROGRESS = 'INVALID_PROGRESS',
  ANY_TASK_NOT_EXIST = 'ANY_TASK_NOT_EXIST',
  TASK_IS_DELETED = 'TASK_IS_DELETED',
  CAN_NOT_DELETE_PROCESSING_TASK = 'CAN_NOT_DELETE_PROCESSING_TASK',
  ONLY_CREATOR_CAN_BE_UPDATE_TASK = 'ONLY_CREATOR_CAN_BE_UPDATE_TASK',
  ONLY_CREATOR_CAN_BE_DELETE_TASK = 'ONLY_CREATOR_CAN_BE_DELETE_TASK',
  ONLY_ASSIGNEE_CAN_BE_UPDATE_PROGRESS = 'ONLY_ASSIGNEE_CAN_BE_UPDATE_PROGRESS',

  // timesheet
  TIMESHEET_NOT_EXIST = 'TIMESHEET_NOT_EXIST',
  ANY_TIMESHEET_NOT_EXIST = 'ANY_TIMESHEET_NOT_EXIST',

  // training
  TRAINING_NOT_EXIST = 'TRAINING_NOT_EXIST',

  // value
  VALUE_ALREADY_EXIST = 'VALUE_ALREADY_EXIST',
  VALUE_NOT_EXIST = 'VALUE_NOT_EXIST',
  VALUE_UNIT_NOT_EXIST = 'VALUE_UNIT_NOT_EXIST', // Unit value does not exist (asset module)
  VALUE_INTERVIEW_STATUS_NOT_EXIST = 'VALUE_INTERVIEW_STATUS_NOT_EXIST',

  //
  ANY_FILE_CATEGORY_NOT_EXIST = 'ANY_FILE_CATEGORY_NOT_EXIST',
  ANY_FILE_NOT_EXIST = 'ANY_FILE_NOT_EXIST',

  // holiday
  HOLIDAY_NOT_EXIST = 'HOLIDAY_NOT_EXIST',

  // misson
  MISSON_NOT_EXIST = 'MISSON_NOT_EXIST',

  // mission status
  MISSON_STATUS_NOT_EXIST = 'MISSON_STATUS_NOT_EXIST',

  // stage
  STAGE_NOT_EXIST = 'STAGE_NOT_EXIST',

  // subsgage
  SUBSTAGE_NOT_EXIST = 'SUBSTAGE_NOT_EXIST',

  // result form of process
  RESULT_FORM_NOT_EXIST = 'RESULT_FORM_NOT_EXIST',

  // process
  PROCESS_NOT_EXIST = 'PROCESS_NOT_EXIST',
  MAIN_DEPARTMENT_NOT_EXIST = 'MAIN_DEPARTMENT_NOT_EXIST',
  ANY_COORDINATE_DEPARTMENT_NOT_EXIST = 'ANY_COORDINATE_DEPARTMENT_NOT_EXIST',
  ANY_IMPLEMENTER_NOT_EXIST = 'ANY_IMPLEMENTER_NOT_EXIST',
  PROCESS_MISSION_NOT_EXIST = 'PROCESS_MISSION_NOT_EXIST',

  // meeting room
  MEETING_ROOM_NOT_EXIST = 'MEETING_ROOM_NOT_EXIST',
  MEETING_ROOM_INACTIVE = 'MEETING_ROOM_INACTIVE',

  // meeting schedule
  MEETING_SCHEDULE_NOT_EXIST = 'MEETING_SCHEDULE_NOT_EXIST',
  CAN_NOT_UPDATE_REVIEWED_MEETING_SCHEDULE = 'CAN_NOT_UPDATE_REVIEWED_MEETING_SCHEDULE',
  MEETING_SCHEDULE_NOT_AVAILABLE = 'MEETING_SCHEDULE_NOT_AVAILABLE',

  // setting
  NO_SETTING_WORK_TIME = 'NO_SETTING_WORK_TIME',
  SETTING_KEY_NOT_EXIST = 'SETTING_KEY_NOT_EXIST',
  SETTING_WRONG_TYPE = 'SETTING_WRONG_TYPE',
  SETTING_GROUP_TELEGRAM_NOT_EXIST = 'SETTING_GROUP_TELEGRAM_NOT_EXIST',

  // timekeeping
  TIME_MUST_SAME_MONTH = 'TIME_MUST_SAME_MONTH',

  // checkin
  CHECKIN_NOT_EXIST = 'CHECKIN_NOT_EXIST',

  TIMEKEEPING_ID_ALREADY_EXIST = 'TIMEKEEPING_ID_ALREADY_EXIST',

  // recruitment
  APPLICANT_NOT_EXIST = 'APPLICANT_NOT_EXIST',
  APPOINTMENT_NOT_EXIST = 'APPOINTMENT_NOT_EXIST',
  APPLICANT_IS_NOT_APPOINTMENT = 'APPLICANT_IS_NOT_APPOINTMENT',
  APPLICANT_ALREADY_EXIST = 'APPLICANT_ALREADY_EXIST',
  APPLICANT_NOT_PASS = 'APPLICANT_NOT_PASS',
  APPLICANT_HAS_BEEN_APPOINTED = 'APPLICANT_HAS_BEEN_APPOINTED',
  APPLICANTIDS_IS_REQUIRED = 'APPLICANTIDS_IS_REQUIRED',
  UPDATE_ONLY_FOR_STATUS_OF_WAITING = 'UPDATE_ONLY_FOR_STATUS_OF_WAITING',

  RECRUITMENT_REQUEST_NOT_EXIST = 'RECRUITMENT_REQUEST_NOT_EXIST',
  RECRUITMENT_REQUEST_NOT_RECRUIT = 'RECRUITMENT_REQUEST_NOT_RECRUIT',
  REVIEW_INTERVIEW_NOT_EXIST = 'REVIEW_INTERVIEW_NOT_EXIST',
  SOME_APPLICANT_NOT_EXIST = 'SOME_APPLICANT_NOT_EXIST',

  CAN_NOT_SEND_MAIL_TO_USER = 'CAN_NOT_SEND_MAIL_TO_USER',

  // approval-setting
  APPROVAL_SETTING_EXISTED = 'APPROVAL_SETTING_EXISTED',
  APPROVAL_SETTING_INVALID_MARK_TIME = 'APPROVAL_SETTING_INVALID_MARK_TIME',
  APPROVAL_SETTING_NOT_EXIST = 'APPROVAL_SETTING_NOT_EXIST',
  ANY_TEMPLATE_MAIL_NOT_APPLY = 'ANY_TEMPLATE_MAIL_NOT_APPLY',

  // Source-cv
  SOURCE_CV_ALREADY_EXIST = 'SOURCE_CV_ALREADY_EXIST',
  SOURCE_CV_NOT_EXIST = 'SOURCE_CV_NOT_EXIST',

  // recruitment advance-settings
  TEMPLATE_MAIL_NOT_EXIST = 'TEMPLATE_MAIL_NOT_EXIST',
  RECRUIT_EMAIL_ALREADY_EXIST = 'RECRUIT_EMAIL_ALREADY_EXIST',
  RECRUITMENT_PERSONNEL_NOT_EXIST = 'RECRUITMENT_PERSONNEL_NOT_EXIST',
  RECRUIT_EMAIL_NOT_EXIST = 'RECRUIT_EMAIL_NOT_EXIST',

  // Confirm work
  CONFIRM_WORK_NOT_EXIST = 'CONFIRM_WORK_NOT_EXIST',
  ONLY_UPDATE_WHEN_STATUS_IS_WAITING = 'ONLY_UPDATE_WHEN_STATUS_IS_WAITING',
  FILE_IS_REQUEST = 'FILE_IS_REQUEST',
  APPROVAL_SETTING_EXPIRE_DATE = 'APPROVAL_SETTING_EXPIRE_DATE',
  CONFIRM_WORK_UNCONFIRMED = 'CONFIRM_WORK_UNCONFIRMED',

  // setting view
  SETTING_VIEW_ALREADY_EXIST = 'SETTING_VIEW_ALREADY_EXIST',

  // approval excess
  APPROVAL_EXCESS_EXIST = 'APPROVAL_EXCESS_EXIST',
}
