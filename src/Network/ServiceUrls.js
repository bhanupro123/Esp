import { ConfigUrls } from "./ConfigUrls";

export const ServiceUrls = {
    get_property_registrations: ConfigUrls.baseUrl + "get_property_registrations",
    takeSnapShot: "/ISAPI/Streaming/channels/1/picture",
    getPlates: "/ISAPI/Traffic/channels/1/vehicleDetect/plates/",
    login: ConfigUrls.baseUrl + "validate_driver_mobileno",//post
    validateOTP: ConfigUrls.baseUrl + "validate_login_otp",
    scan_lic_plateno_by_backend: ConfigUrls.baseUrl + "scan_lic_plateno_new",
    towTZ: ConfigUrls.baseUrl + "get_tow_company_timezone",
    get_impound_data: ConfigUrls.baseUrl + "get_impound_data",
    save_impound_data: ConfigUrls.baseUrl + "save_impound_data",
    get_tow_truck_list: ConfigUrls.baseUrl + "get_tow_truck_list",
    get_veh_makes: ConfigUrls.baseUrl + "get_veh_makes",
    get_veh_models: ConfigUrls.baseUrl + "get_veh_models",
    scan_lic_plateno_autolist: ConfigUrls.baseUrl + "scan_lic_plateno_autolist",
    termsandconditions: "https://www.pass2parkit.com/terms",
    privacyPolicy: "https://www.pass2parkit.com/privacy-policy",
    search_property: ConfigUrls.baseUrl + "search_properties",
    get_property_search_data: ConfigUrls.baseUrl + "get_property_search_data",
    update_device_fcm_token:ConfigUrls.baseUrl+"update_device_fcm_token",
    updateDriverScanLogs:ConfigUrls.baseUrl+"updateDriverScanLogs",
    checkAndUpdateDriverFCMToken:ConfigUrls.baseUrl+"checkAndUpdateDriverFCMToken",
}