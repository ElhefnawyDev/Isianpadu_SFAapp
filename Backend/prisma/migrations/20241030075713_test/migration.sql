-- CreateTable
CREATE TABLE `adm_profile` (
    `profile_id` INTEGER NOT NULL AUTO_INCREMENT,
    `otp_no_update` INTEGER NULL,
    `fullname` TEXT NULL,
    `id_lkp_citizenship` INTEGER NULL,
    `citizenship_no` VARCHAR(255) NULL,
    `gender` VARCHAR(25) NULL,
    `bod` DATE NULL,
    `bod_place` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `postcode` VARCHAR(12) NULL,
    `id_lkp_district` INTEGER NULL,
    `age` INTEGER NULL,
    `id_lkp_race` INTEGER NULL,
    `id_lkp_state` INTEGER NULL,
    `id_lkp_country` INTEGER NULL,
    `id_lkp_profile_type` INTEGER NULL,
    `id_lkp_profile_status` BIGINT NULL,
    `id_lkp_position` BIGINT NULL,
    `id_lkp_kekerapan_mengajar` INTEGER NULL,
    `flag_active` INTEGER NULL,
    `avatar` VARCHAR(255) NULL,
    `phone_dihubungi` VARCHAR(100) NULL,
    `created_date` DATETIME(0) NULL,
    `modify_date` DATETIME(0) NULL,
    `created_by` BIGINT NULL,
    `modify_by` BIGINT NULL,
    `hubungan` VARCHAR(100) NULL,
    `id_lkp_religion` VARCHAR(11) NULL,
    `document_ic` VARCHAR(255) NULL,
    `flag_allow_app` INTEGER NULL,
    `flag_migration` INTEGER NOT NULL,

    PRIMARY KEY (`profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adm_user` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `trans_key` VARCHAR(255) NULL,
    `id_lkp_otp_type` INTEGER NULL,
    `id_profile` BIGINT NULL,
    `flag_active` INTEGER NULL,
    `created_date` DATETIME(0) NULL,
    `modify_date` DATETIME(0) NULL,
    `created_by` BIGINT NULL,
    `modify_by` BIGINT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bok_asset` (
    `asset_id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_name` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(255) NOT NULL,
    `total_unit` INTEGER NOT NULL,
    `id_room` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `modified_by` INTEGER NOT NULL,
    `modified_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`asset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bok_location` (
    `location_id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_name` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `postcode` VARCHAR(12) NOT NULL,
    `id_lkp_state` INTEGER NOT NULL,
    `id_lkp_status_active` INTEGER NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `modified_date` DATETIME(0) NOT NULL,
    `modified_by` INTEGER NOT NULL,

    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bok_room` (
    `room_id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_name` VARCHAR(255) NOT NULL,
    `unit_level` VARCHAR(255) NOT NULL,
    `id_location` INTEGER NOT NULL,
    `capacity` INTEGER NOT NULL,
    `id_lkp_status_active` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `modified_by` INTEGER NOT NULL,
    `modified_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`room_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bok_room_book` (
    `room_book_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_room` INTEGER NOT NULL,
    `date_from` DATE NOT NULL,
    `time_from` TIME(0) NOT NULL,
    `date_to` DATE NOT NULL,
    `time_to` TIME(0) NOT NULL,
    `id_lkp_book_status` INTEGER NOT NULL,
    `booked_by` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `modified_by` INTEGER NOT NULL,
    `modified_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`room_book_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(250) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jt_salesteam_customer_subkey_acc` (
    `id_sfa_salesteam` INTEGER NOT NULL,
    `id_sfa_customer` INTEGER NOT NULL,
    `id_sfa_subkey_acc` INTEGER NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lkp_book_status` (
    `book_status_id` INTEGER NOT NULL AUTO_INCREMENT,
    `book_status_name` VARCHAR(255) NOT NULL,
    `order_no` INTEGER NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`book_status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lkp_country` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(50) NULL,
    `order_no` BIGINT NULL,
    `flag_active` INTEGER NULL,
    `created_date` DATETIME(0) NULL,
    `modify_date` DATETIME(0) NULL,
    `created_by` BIGINT NULL,
    `modify_by` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lkp_district` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_lkp_state` BIGINT NULL,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(50) NULL,
    `order_no` BIGINT NULL,
    `flag_active` INTEGER NULL,
    `created_date` DATETIME(0) NULL,
    `modify_date` DATETIME(0) NULL,
    `created_by` BIGINT NULL,
    `modify_by` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lkp_profile_type` (
    `profile_type_id` BIGINT NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(255) NULL,
    `code` VARCHAR(25) NULL,
    `order_no` BIGINT NULL,
    `flag_active` INTEGER NULL,
    `created_date` DATETIME(0) NULL,
    `modify_date` DATETIME(0) NULL,
    `created_by` BIGINT NULL,
    `modify_by` BIGINT NULL,

    PRIMARY KEY (`profile_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lkp_state` (
    `state_id` BIGINT NOT NULL AUTO_INCREMENT,
    `state_name` VARCHAR(255) NULL,
    `code` VARCHAR(50) NULL,
    `order_no` BIGINT NULL,
    `flag_active` INTEGER NULL,
    `created_date` DATETIME(0) NULL,
    `modify_date` DATETIME(0) NULL,
    `created_by` BIGINT NULL,
    `modify_by` BIGINT NULL,

    PRIMARY KEY (`state_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lkp_status_active` (
    `status_id` INTEGER NOT NULL AUTO_INCREMENT,
    `status_name` VARCHAR(255) NOT NULL,
    `order_no` INTEGER NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`status_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `org_organization` (
    `org_id` INTEGER NOT NULL AUTO_INCREMENT,
    `org_name` VARCHAR(255) NOT NULL,
    `shortname` VARCHAR(100) NOT NULL,
    `website` VARCHAR(255) NOT NULL,
    `ssm_no` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `postcode` VARCHAR(10) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `id_lkp_state` INTEGER NOT NULL,
    `id_lkp_country` INTEGER NOT NULL,
    `id_lkp_organization_type` INTEGER NOT NULL,

    PRIMARY KEY (`org_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `org_organization_type` (
    `org_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `org_type_name` VARCHAR(255) NOT NULL,
    `order_no` INTEGER NOT NULL,
    `id_status` INTEGER NOT NULL,

    PRIMARY KEY (`org_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pro_project` (
    `project_id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_name` VARCHAR(255) NOT NULL,
    `project_short_name` TEXT NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `contract_no` VARCHAR(100) NOT NULL,
    `project_from` DATE NOT NULL,
    `project_to` DATE NOT NULL,
    `id_project_activity` VARCHAR(255) NOT NULL,
    `project_extend` INTEGER NOT NULL,
    `id_lkp_project_status` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `modified_by` INTEGER NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `modified_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pro_project_activity` (
    `activity_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_project` INTEGER NOT NULL,
    `id_lkp_project_activity` VARCHAR(255) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `modified_by` INTEGER NOT NULL,
    `created_date` DATETIME(0) NOT NULL,
    `modified_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`activity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pro_task` (
    `task_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_project` INTEGER NOT NULL,
    `id_activity` INTEGER NOT NULL,
    `task_name` VARCHAR(255) NOT NULL,
    `task_desc` TEXT NOT NULL,
    `task_from` DATE NOT NULL,
    `task_to` DATE NOT NULL,
    `id_task_status` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `modified_by` INTEGER NOT NULL,
    `create_date` DATETIME(0) NOT NULL,
    `modify_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` INTEGER NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `price` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `psec_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` CHAR(45) NOT NULL,
    `date` VARCHAR(30) NOT NULL,
    `time` CHAR(5) NOT NULL,
    `page` VARCHAR(255) NOT NULL,
    `query` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `browser` VARCHAR(255) NOT NULL DEFAULT 'Unknown',
    `browser_code` VARCHAR(50) NOT NULL,
    `os` VARCHAR(255) NOT NULL DEFAULT 'Unknown',
    `os_code` VARCHAR(40) NOT NULL,
    `country` VARCHAR(120) NOT NULL DEFAULT 'Unknown',
    `country_code` CHAR(2) NOT NULL DEFAULT 'XX',
    `region` VARCHAR(120) NOT NULL DEFAULT 'Unknown',
    `city` VARCHAR(120) NOT NULL DEFAULT 'Unknown',
    `latitude` VARCHAR(30) NOT NULL DEFAULT '0',
    `longitude` VARCHAR(30) NOT NULL DEFAULT '0',
    `isp` VARCHAR(255) NOT NULL DEFAULT 'Unknown',
    `useragent` TEXT NOT NULL,
    `referer_url` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `psec_pages-layolt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page` VARCHAR(30) NOT NULL,
    `text` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sec_historylog` (
    `audit_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `page` VARCHAR(255) NOT NULL,
    `action` VARCHAR(255) NOT NULL,
    `ip` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    `time` TIME(0) NOT NULL,
    `status` INTEGER NOT NULL,

    PRIMARY KEY (`audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sec_loginlogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `ip` CHAR(45) NOT NULL,
    `date` DATE NOT NULL,
    `time` TIME(0) NOT NULL,
    `flag_status` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_ally_type` (
    `ally_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ally_type` VARCHAR(255) NOT NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`ally_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_calendar` (
    `event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_name` VARCHAR(255) NOT NULL,
    `event_date` DATE NOT NULL,
    `event_time` TIME(0) NOT NULL,
    `event_desc` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_client` (
    `client_id` INTEGER NULL,
    `client_name` VARCHAR(50) NULL,
    `client_address` VARCHAR(50) NULL,
    `client_postcode` VARCHAR(5) NULL,
    `client_city` INTEGER NULL,
    `client_state` INTEGER NULL,
    `created_date` VARCHAR(10) NULL,
    `created_by` VARCHAR(10) NULL,
    `delete_id` VARCHAR(10) NULL,
    `deleted_date` VARCHAR(10) NULL,
    `deleted_by` VARCHAR(10) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_cust_acc` (
    `custacc_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_adm_profileSP` VARCHAR(255) NOT NULL,
    `key_account` VARCHAR(255) NOT NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`custacc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_email` (
    `email_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email_title` VARCHAR(255) NOT NULL,
    `email_desc` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`email_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_exp_alert` (
    `alert_id` INTEGER NOT NULL AUTO_INCREMENT,
    `alert_month` INTEGER NOT NULL,
    `alert_week` INTEGER NOT NULL,
    `alert_day` INTEGER NOT NULL,
    `alert_email` VARCHAR(255) NOT NULL,
    `id_sfa_registration` INTEGER NOT NULL,
    `next_reminder` DATE NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`alert_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_infobox` (
    `infobox_id` INTEGER NOT NULL,
    `constant_figure_name` VARCHAR(255) NOT NULL,
    `figure_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`infobox_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_infogauge` (
    `infogauge_id` INTEGER NOT NULL AUTO_INCREMENT,
    `calculate_year` INTEGER NOT NULL,
    `constant_figure_name` VARCHAR(255) NOT NULL,
    `figure_name` VARCHAR(255) NOT NULL,
    `target_value` DECIMAL(20, 2) NOT NULL,

    PRIMARY KEY (`infogauge_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_infotarget` (
    `infotarget_id` INTEGER NOT NULL AUTO_INCREMENT,
    `target_year` INTEGER NOT NULL,
    `target_value` DECIMAL(12, 0) NOT NULL,
    `minimum_target` DECIMAL(12, 0) NOT NULL,

    PRIMARY KEY (`infotarget_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_notice` (
    `notice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_sfa_subm_method` INTEGER NOT NULL,
    `id_sfa_subm_type` INTEGER NOT NULL,
    `tender_name` VARCHAR(255) NOT NULL,
    `remarks` VARCHAR(255) NOT NULL,
    `deadline` DATE NOT NULL,
    `brief_date` DATE NOT NULL,
    `id_adm_profileSP` VARCHAR(255) NOT NULL,
    `id_adm_profilePS` VARCHAR(255) NOT NULL,
    `id_adm_profileSA` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`notice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_plan_infogauge` (
    `plan_infogauge_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trigger_year` INTEGER NOT NULL,
    `start_year` INTEGER NOT NULL,
    `end_year` INTEGER NOT NULL,
    `constant_figure_name` VARCHAR(255) NOT NULL,
    `figure_name` VARCHAR(255) NOT NULL,
    `target_value` DECIMAL(20, 2) NOT NULL,

    PRIMARY KEY (`plan_infogauge_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_registration` (
    `reg_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_sfa_ally_type` VARCHAR(255) NOT NULL,
    `reg_name` VARCHAR(255) NOT NULL,
    `reg_date` DATE NOT NULL,
    `expected_reminder` DATE NOT NULL,
    `expiration_date` DATE NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `contact_person` VARCHAR(255) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`reg_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_roles` (
    `RoleID` INTEGER NOT NULL,
    `RoleName` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`RoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_salesteam` (
    `staff_id` INTEGER NOT NULL,
    `name` VARCHAR(47) NULL,
    `designation` VARCHAR(33) NULL,
    `no_phone` VARCHAR(14) NULL,
    `email` VARCHAR(35) NULL,
    `sales_role_id` INTEGER NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_salesteam_new` (
    `StaffID` INTEGER NOT NULL AUTO_INCREMENT,
    `StaffName` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`StaffID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_staffroles` (
    `StaffID` INTEGER NOT NULL,
    `RoleID` INTEGER NOT NULL,

    INDEX `RoleID`(`RoleID`),
    PRIMARY KEY (`StaffID`, `RoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_stages` (
    `stages_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stage_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`stages_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_subkey_acc` (
    `subkey_acc_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subkey_acc_name` VARCHAR(255) NOT NULL,
    `id_sfa_custacc` INTEGER NOT NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`subkey_acc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_subm_method` (
    `subm_method_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subm_method` VARCHAR(255) NOT NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`subm_method_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_subm_type` (
    `subm_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subm_type` VARCHAR(255) NOT NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`subm_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_tender` (
    `tender_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tender_code` VARCHAR(255) NOT NULL,
    `tender_shortname` LONGTEXT NOT NULL,
    `tender_fullname` TEXT NOT NULL,
    `id_sfa_subm_method` INTEGER NOT NULL,
    `id_sfa_subm_type` INTEGER NOT NULL,
    `id_sfa_client` INTEGER NOT NULL,
    `id_adm_profileSP` INTEGER NOT NULL,
    `id_adm_profileSA` INTEGER NOT NULL,
    `id_adm_profilePS` INTEGER NOT NULL,
    `id_sfa_stages` INTEGER NOT NULL,
    `display_notice_id` BOOLEAN NULL,
    `id_sfa_tender_category` INTEGER NOT NULL,
    `deadline` DATE NOT NULL,
    `brief_date` DATE NULL,
    `tender_value` DECIMAL(20, 2) NULL,
    `tender_cost` DECIMAL(20, 2) NULL,
    `tender_purchase_date` DATE NULL,
    `tender_purchase_amount` DECIMAL(20, 2) NULL,
    `indicative_price` DECIMAL(20, 2) NULL,
    `implement_period` INTEGER NULL,
    `contract_period` INTEGER NULL,
    `total_proposed_contract_value` DECIMAL(10, 0) NULL,
    `exp_project_start` DATE NULL,
    `scope_services` LONGTEXT NULL,
    `implement_plan` LONGTEXT NULL,
    `winning_implement_strategy` LONGTEXT NULL,
    `project_clarification` LONGTEXT NULL,
    `status` VARCHAR(255) NULL,
    `loa_date` DATE NULL,
    `remarks` VARCHAR(255) NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`tender_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_tender_category` (
    `tender_category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tender_category` VARCHAR(255) NOT NULL,
    `created_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` INTEGER NOT NULL,
    `delete_id` BOOLEAN NOT NULL,
    `deleted_date` TIMESTAMP(0) NULL,
    `deleted_by` INTEGER NOT NULL,

    PRIMARY KEY (`tender_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sfa_testing` (
    `test_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sheet1` (
    `tender_id` INTEGER NULL,
    `tender_code` VARCHAR(26) NULL,
    `tender_shortname` VARCHAR(200) NULL,
    `tender_fullname` VARCHAR(118) NULL,
    `id_sfa_subm_method` VARCHAR(10) NULL,
    `id_sfa_subm_type` VARCHAR(10) NULL,
    `id_sfa_client` INTEGER NULL,
    `id_adm_profileSP` VARCHAR(10) NULL,
    `id_adm_profileSA` VARCHAR(10) NULL,
    `id_adm_profilePS` VARCHAR(10) NULL,
    `id_sfa_stages` INTEGER NULL,
    `display_notice_id` VARCHAR(10) NULL,
    `id_sfa_tender_category` INTEGER NULL,
    `deadline` VARCHAR(10) NULL,
    `brief_date` VARCHAR(10) NULL,
    `tender_value` DECIMAL(10, 2) NULL,
    `tender_cost` DECIMAL(9, 2) NULL,
    `tender_purchase_date` VARCHAR(10) NULL,
    `tender_purchase_amount` VARCHAR(10) NULL,
    `indicative_price` VARCHAR(10) NULL,
    `implement_period` VARCHAR(2) NULL,
    `contract_period` VARCHAR(2) NULL,
    `total_proposed_contract_value` VARCHAR(7) NULL,
    `exp_project_start` VARCHAR(10) NULL,
    `scope_services` VARCHAR(4339) NULL,
    `implement_plan` VARCHAR(415) NULL,
    `winning_implement_strategy` VARCHAR(1971) NULL,
    `project_clarification` VARCHAR(10) NULL,
    `status` VARCHAR(10) NULL,
    `loa_date` VARCHAR(10) NULL,
    `remarks` VARCHAR(214) NULL,
    `created_date` VARCHAR(10) NULL,
    `created_by` VARCHAR(36) NULL,
    `delete_id` VARCHAR(10) NULL,
    `deleted_date` VARCHAR(7) NULL,
    `deleted_by` VARCHAR(10) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sfa_staffroles` ADD CONSTRAINT `sfa_staffroles_ibfk_1` FOREIGN KEY (`StaffID`) REFERENCES `sfa_salesteam_new`(`StaffID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `sfa_staffroles` ADD CONSTRAINT `sfa_staffroles_ibfk_2` FOREIGN KEY (`RoleID`) REFERENCES `sfa_roles`(`RoleID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
