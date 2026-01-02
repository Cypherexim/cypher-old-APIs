'use strict';

module.exports = {
    get_import: 'SELECT * FROM public.import_india ORDER BY "RecordID" ASC LIMIT 10000',
    get_import_by_recordId: `SELECT * FROM public.import_india where "RecordID"=$1`,
    get_import_search: `select * from import_india WHERE "Date" BETWEEN $1 AND $2 
    AND ("HSCODE"::text ILIKE $3) OR ("HSCodeDesc" ILIKE $4) 
    OR ("Importer_Name" ILIKE $5) OR ("EXPORTER_NAME" ILIKE $6) 
    order by "RecordID" limit 1000000`,
    update_country: `UPDATE public."Country" SET  "Import"=$1, "Export"=$2 WHERE "Countrycode"=$3;`,
    add_user_by_admin: `INSERT INTO public."Cypher"(
        "FullName", "CompanyName", "MobileNumber", "Email", "Password","CountryCode","ParentUserId")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING public."Cypher"."UserId";`,
    add_user: `INSERT INTO public."Cypher"(
        "FullName", "CompanyName", "MobileNumber", "Email", "Password", "CountryCode", "ParentUserId", "Designation", "Location", "GST", "IEC","RoleId")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING public."Cypher"."UserId";;`,
    update_user: `UPDATE public."Cypher"
	SET "FullName"=$1, "CompanyName"=$2, "MobileNumber"=$3, "Email"=$4, "CountryCode"=$5,
    "Designation"=$6, "Location"=$7, "GST"=$8, "IEC"=$9, "RoleId"=$10 WHERE "UserId"=$11`,
    enable_disable_user: `UPDATE public."Cypher" SET "Enable"=$1 WHERE "UserId"= $2;`,
    get_user_by_email: `SELECT "FullName", "CompanyName", "MobileNumber", "Email", "Password","RoleName", "Cypher"."UserId", "CountryCode", "ParentUserId", "Designation", "Location", "GST", "IEC", "Cypher"."RoleId", "Enable","userPreference", public.userplantransaction."PlanId", public.userplantransaction."Downloads", public.userplantransaction."Searches", 
    public.userplantransaction."StartDate", public.userplantransaction."EndDate", public.userplantransaction."Validity",
    public.userplantransaction."DataAccess", public.userplantransaction."CountryAccess", "userplantransaction"."UpdateCompanyNamePoints",
    public.userplantransaction."CommodityAccess", public.userplantransaction."TarrifCodeAccess", 
    public.userplantransaction."Workspace", public.userplantransaction."WSSLimit", public.userplantransaction."Downloadfacility",
    public.userplantransaction."Favoriteshipment", public.userplantransaction."Whatstrending", public.userplantransaction."Companyprofile", 
    public.userplantransaction."Addonfacility", public.userplantransaction."Analysis", public.userplantransaction."User",("EndDate"- now()::date) AS Remainingdays FROM public."Cypher" 
    inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId" 
    inner join public.plan on "userplantransaction"."PlanId" = "plan"."PlanId" 
    inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
    where "Email"=$1`,
    get_user_by_parentuser: `SELECT "FullName", "CompanyName", "MobileNumber", "Email", "Password","RoleName", "Cypher"."UserId", "CountryCode", "ParentUserId", "Designation", "Location", "GST", "IEC", "Cypher"."RoleId", "Enable","userPreference", public.userplantransaction."PlanId", public.userplantransaction."Downloads", public.userplantransaction."Searches", 
    public.userplantransaction."StartDate", public.userplantransaction."EndDate", public.userplantransaction."Validity",
    public.userplantransaction."DataAccess", public.userplantransaction."CountryAccess", "userplantransaction"."UpdateCompanyNamePoints",
    public.userplantransaction."CommodityAccess", public.userplantransaction."TarrifCodeAccess", 
    public.userplantransaction."Workspace", public.userplantransaction."WSSLimit", public.userplantransaction."Downloadfacility",
    public.userplantransaction."Favoriteshipment", public.userplantransaction."Whatstrending", public.userplantransaction."Companyprofile", 
    public.userplantransaction."Addonfacility", public.userplantransaction."Analysis", public.userplantransaction."User",("EndDate"- now()::date) AS Remainingdays FROM public."Cypher" 
    inner join public.userplantransaction on "Cypher"."ParentUserId" = "userplantransaction"."UserId" 
    inner join public.plan on "userplantransaction"."PlanId" = "plan"."PlanId" 
    inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
    where "Email"=$1`,
    get_user_email: `SELECT * FROM public."Cypher" where "Email"=$1`,
    get_user_by_email_forchangepassword: `SELECT * FROM public."Cypher" where "Email"=$1`,
    reset_password:`UPDATE public."Cypher" SET "Password"=$1 WHERE "Email"=$2`,
    update_password: `UPDATE public."Cypher" SET "Password"=$1 WHERE "UserId"=$2`,
    get_user_email: `SELECT * FROM public."Cypher" WHERE "Email"=$1`,
    get_hscode_import: 'SELECT * FROM public.HSCodes',
    get_hscode_export: 'SELECT "Hscode","HscodeDesc" FROM public."HSCodes"',
    get_hscode_export_digit: 'SELECT "Hscode" ,"HscodeDesc" FROM public."HSCodes" where length("Hscode") =$1',
    getCountry: `SELECT "Countrycode", "CountryName", "Import", "Export", "LatestDate", "StartDate", "Direction", 
    "data_type"  FROM public."Country" inner join public.datauploadhistorybydate on 
    public.datauploadhistorybydate."CountryCode" = public."Country"."Countrycode" ORDER BY "CountryName"`,
    getCountryWithoutDate:`SELECT "Countrycode", "CountryName" FROM public."Country" where data_type=$1 ORDER BY "CountryName"`,
    
    getCountryByCountrycode:`SELECT * FROM public."Country" where "Countrycode"=$1`,

    getLatestDate: `SELECT "LatestDate" FROM public.datauploadhistorybydate where "CountryType"=$1 AND "Direction"=$2 AND "CountryCode"=$3 AND "active"=true`,
    addCountry: 'INSERT INTO public."Country"("Countrycode", "CountryName", "Import", "Export", "data_type") VALUES ($1, $2, $3, $4, $5)',
    addDataHistory: `INSERT INTO public.datauploadhistorybydate("CountryCode", "Direction", "LatestDate", "CountryType") VALUES ($1, $2, $3, $4);`,
    updateDataHistory: `UPDATE public.datauploadhistorybydate SET "LatestDate"=$1 WHERE "CountryType"=$2 AND "CountryCode"=$3 AND "Direction"=$4`,
    addDownloadCost: 'INSERT INTO public."Dowload_cost" ("CountryCode", "CostPerRecord", "CountryType") VALUES ($1, 1, $2);',
    get_plan_by_name: `SELECT * FROM public.plan WHERE "PlanName"=$1`,
    add_plan: `INSERT INTO public.plan(
        "PlanName", "Amount", "Validity", "DataAccess", "Downloads", "Searches", "CountryAccess", "CommodityAccess", "TarrifCodeAccess", "Workspace", "WSSLimit", "Downloadfacility", "Favoriteshipment", "Whatstrending", "Companyprofile", "Contactdetails", "Addonfacility", "Analysis", "User")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
    get_plan_list: `SELECT * FROM public.plan`,
    update_plan: `UPDATE public.plan
	SET "PlanName"=$1, "Amount"=$2, "Validity"=$3, "DataAccess"=$4, "Downloads"=$5, "Searches"=$6, "CountryAccess"=$7, 
    "CommodityAccess"=$8, "TarrifCodeAccess"=$9, "Workspace"=$10, "WSSLimit"=$11, "Downloadfacility"=$12, "Favoriteshipment"=$13, 
    "Whatstrending"=$14, "Companyprofile"=$15, "Contactdetails"=$16, "Addonfacility"=$17, "Analysis"=$18, "User"=$19
	WHERE "PlanId"=$20;`,
    add_Plan_Trasaction: `INSERT INTO public.userplantransaction("UserId", "PlanId", "Downloads", "Searches", "StartDate")
        VALUES ($1, $2, $3, $4, $5)`,
    add_Plan_Trasaction_by_admin: `INSERT INTO public.userplantransaction(
        "UserId", "PlanId", "Downloads", "Searches", "StartDate", "EndDate", "Validity", "DataAccess", "CountryAccess", "CommodityAccess", "TarrifCodeAccess", "Workspace", "WSSLimit", "Downloadfacility", "Favoriteshipment", "Whatstrending", "Companyprofile", "Addonfacility", "Analysis", "User", "UpdateCompanyNamePoints")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21);`,
    update_Plan_Trasaction_by_admin: `UPDATE public.userplantransaction
	SET "PlanId"=$1, "Downloads"=$2, "Searches"=$3, "StartDate"=$4, "EndDate"=$5, "Validity"=$6, "DataAccess"=$7, "CountryAccess"=$8, "CommodityAccess"=$9, "TarrifCodeAccess"=$10, "Workspace"=$11, "WSSLimit"=$12, "Downloadfacility"=$13, "Favoriteshipment"=$14, "Whatstrending"=$15, "Companyprofile"=$16, "Addonfacility"=$17, "Analysis"=$18, "User"=$19, "UpdateCompanyNamePoints"=$20
	WHERE "UserId"=$21`,
    update_user_Access: `UPDATE public."UserAccess"
	SET "AddUser"=$2, "EditUser"=$3, "DeleteUser"=$4, "AddPlan"=$5, 
	"EditPlan"=$6, "DeletePlan"=$7, "Downloads"=$8, "Search"=$9, "EnableId"=$10, "DisableId"=$11, 
	"BlockUser"=$12, "UnblockUser"=$13, "ClientList"=$14, "PlanList"=$15, "Share"=$16
	WHERE "UserId"=$1;`,
    add_user_Access: `INSERT INTO public."UserAccess"(
        "AddUser", "EditUser", "DeleteUser", "AddPlan", "EditPlan", "DeletePlan", "Downloads", "Search", "EnableId", "DisableId", "BlockUser", "UnblockUser", "ClientList", "PlanList", "UserId","Share")
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);`,
    get_Plan_By_UserId: `SELECT "Downloads", "Searches" FROM public.userplantransaction WHERE "UserId"=$1`,
    share_download_files: `INSERT INTO public.userdownloadtransaction(countrycode, "userId", direction, workspacename, datetime, "recordIds", "filePath", status, errorlog, expirydate)
    select "countrycode", $1,direction, workspacename, $3, "recordIds", "filePath", status, errorlog, expirydate
    from public.userdownloadtransaction where "Id"=$2`,
    insert_share_history: `INSERT INTO public."ShareHistory"(shareby, shareto, date, "workspaceId") VALUES ($1, $2, $3, $4);`,
    update_Plan_transaction: `UPDATE public.userplantransaction SET "Searches" = $1 WHERE "UserId"= $2`,
    get_cypher_userby_id: `SELECT "ParentUserId" FROM public."Cypher" where "UserId"=$1`,
    get_Searches_By_UserId: `SELECT "userplantransaction"."UserId", "userplantransaction"."PlanId", "userplantransaction"."Downloads", 
    "userplantransaction"."Searches", "userplantransaction"."StartDate", "userplantransaction"."EndDate", 
    "userplantransaction"."Validity", "userplantransaction"."DataAccess", "userplantransaction"."UpdateCompanyNamePoints",
    "userplantransaction"."CountryAccess", "userplantransaction"."CommodityAccess", "userplantransaction"."TarrifCodeAccess", "userplantransaction"."Workspace", 
    "userplantransaction"."WSSLimit", "userplantransaction"."Downloadfacility", "userplantransaction"."Favoriteshipment", "userplantransaction"."Whatstrending", "userplantransaction"."Companyprofile", 
    "userplantransaction"."Addonfacility", "userplantransaction"."Analysis", "userplantransaction"."User","userplantransaction"."Downloads","plan"."PlanName","userplantransaction"."Searches",("EndDate"- now()::date) AS Remainingdays,
	"AddUser", "EditUser", "DeleteUser", "AddPlan", "EditPlan", "DeletePlan", "UserAccess"."Downloads" as Dwnlds, "Search", "EnableId", "DisableId", "BlockUser", "UnblockUser", "ClientList", "PlanList", "Share"
    FROM public.userplantransaction 
	inner join "plan" on "plan"."PlanId" = "userplantransaction"."PlanId" 
	inner join "UserAccess" on "UserAccess"."UserId" = "userplantransaction"."UserId"
	WHERE "userplantransaction"."UserId"=$1`,
    get_user_by_ParentId: `SELECT * FROM public."Cypher" where "ParentUserId"=$1`,    
    get_first_sidefilter_Access: `SELECT "HsCode" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    get_Import_sidefilter_Access: `SELECT "Imp_Name" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    get_Export_sidefilter_Access: `SELECT "Exp_Name" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_PORT_OF_DESTINATION_ACCESS: `SELECT "PortofDestination" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_PORT_OF_ORIGIN_ACCESS: `SELECT "PortofOrigin" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_MONTH_ACCESS: `SELECT "Month" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_YEAR_ACCESS: `SELECT "Year" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_CURRENCY_ACCESS: `SELECT "Currency" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_UQC_ACCESS: `SELECT "uqc" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_MODE_ACCESS: `SELECT "Mode" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_QUANTITY_ACCESS: `SELECT "Quantity" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_LOADING_PORT_ACCESS: `SELECT "LoadingPort" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    GET_NOTIFY_PARTY_ACCESS: `SELECT "NotifyPartyName" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    get_second_sidefilter_Access: `SELECT "CountryofDestination", "CountryofOrigin" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3`,
    
    get_third_sidefilter_Access: `SELECT uqc, "Quantity", "Month", "Year" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_fourth_sidefilter_Access: `SELECT  "PortofDestination", "LoadingPort", "Currency", "NotifyPartyName" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    get_fifth_sidefilter_Access: `SELECT "PortofOrigin", "Mode" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2`,
    // get_all_sidefilter_Access: `SELECT * FROM public."SideFilterAccess"`,
    
    get_all_sidefilter_Access: (type) => `select "Id", (select "CountryName" from "Country" where "data_type"='${type}' and "Countrycode"="Country") as "country_name", "Direction",
    "Country", "CountryType", "HsCode", "ProductDesc", "Exp_Name", "Imp_Name", "CountryofDestination", "CountryofOrigin", "PortofOrigin", "PortofDestination", "Mode", "uqc", 
    "Quantity", "Currency", "Month", "Year", "LoadingPort", "NotifyPartyName", active from public."SideFilterAccess" where "CountryType"='${type}' order by "Country";`,
    update_sidefilter_Access: `UPDATE public."SideFilterAccess" SET "HsCode"=$2, "ProductDesc"=$3, "Exp_Name"=$4, "Imp_Name"=$5, "CountryofDestination"=$6, "CountryofOrigin"=$7, 
    "PortofOrigin"=$8, "Mode"=$9, "uqc"=$10, "Quantity"=$11, "Month"=$12, "Year"=$13, "PortofDestination"=$14, "LoadingPort"=$15, "Currency"=$16, "NotifyPartyName"=$17 WHERE "Id"=$1 and "CountryType"=$18`,
    
    // getimporter_export_india: `SELECT * FROM public.importer_export_india ORDER BY "Imp_Name" limit 500`,
    // getimporter_import_india: `SELECT * FROM public.importer_import_india ORDER BY "Imp_Name" limit 500`,
    // getexporter_export_india: `SELECT * FROM public.exporter_export_india ORDER BY "Exp_Name" limit 500`,
    // getexporter_import_india: `SELECT * FROM public.exporter_import_india ORDER BY "Exp_Name" limit 500`,

    // getimporter_export_india_search: `SELECT * FROM public.importer_export_india WHERE "Imp_Name" like $1 ORDER BY "Imp_Name" limit 500`,
    // getimporter_import_india_search: `SELECT * FROM public.importer_import_india WHERE "Imp_Name" like $1 ORDER BY "Imp_Name" limit 500`,
    // getexporter_export_india_search: `SELECT * FROM public.exporter_export_india WHERE "Exp_Name" like $1 ORDER BY "Exp_Name" limit 500`,
    // getexporter_import_india_search: `SELECT * FROM public.exporter_import_india WHERE "Exp_Name" like $1 ORDER BY "Exp_Name" limit 500`,

    get_importer_list: `SELECT DISTINCT "Imp_Name", "Exp_Name" FROM public.import_$1 limit 1000`,
    get_exporter_list: `SELECT DISTINCT "Imp_Name", "Exp_Name" FROM public.export_$1 limit 1000`,

    insert_sidefilter_Access: `INSERT INTO public."SideFilterAccess"("HsCode", "ProductDesc", "Exp_Name", "Imp_Name", 
    "CountryofDestination", "CountryofOrigin", "PortofOrigin", "Mode", "uqc", "Quantity", "Month", "Year", "Country",
    "Direction", "PortofDestination", "LoadingPort", "Currency", "NotifyPartyName", "CountryType", "active")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,

    get_workspace: `SELECT * FROM public.workspace WHERE "UserId"=$1 or
    "UserId" IN(SELECT "UserId" from public."Cypher" where "ParentUserId"=$1) AND visible = true`,

    add_workspace: `INSERT INTO public.workspace(
        "UserId", "Searchbar", "Sidefilter","foldername","CustomAnalysis")
        VALUES ($1, $2, $3,$4, $5) RETURNING public."workspace"."Id";`,
    update_workspace: `UPDATE public.workspace SET "CustomAnalysis"=$1 WHERE "Id"=$2;`,
    delete_Workspace: `UPDATE public.workspace SET visible=false WHERE "Id"=$1`,

    get_download_cost: `SELECT * FROM public."Dowload_cost" WHERE "CountryCode"=$1 AND "CountryType"=$2`,

    check_download_workspancename: `SELECT * FROM public.userdownloadtransaction  where "workspacename"=$1`,

    add_download_workspace: `INSERT INTO public.userdownloadtransaction(
        "countrycode", "userId", direction, "data_query", workspacename,datetime,"filePath","status","errorlog","expirydate")
        VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10) RETURNING public."userdownloadtransaction"."Id";`,
    update_download_workspace: `UPDATE public.userdownloadtransaction SET "recordIds"= $1, "filePath"= $2, "status"= $3, "errorlog"= $4, "expirydate" = $5 WHERE "Id"= $6;`,
    ADD_DOWNLOADING_QUEUE: `insert into "downloading_queue" ("filename", "start_time", "current_status", "user_id", "active") values ($1, $2, $3, $4, true) returning download_id`,

    get_download_Workspace: `SELECT "Id", countrycode as CountryName, "userId", direction,cardinality("recordIds") as totalrecords
    , workspacename, datetime,"filePath","status","errorlog","expirydate"
        FROM public.userdownloadtransaction WHERE ("userId"=$1 or
        "userId" IN(SELECT "UserId" from public."Cypher" where "ParentUserId"=$1)) AND "active"=true`,

    update_download_count: `UPDATE public.userplantransaction SET "Downloads" = $1 WHERE "UserId"= $2`,

    get_all_roles: `SELECT * FROM public."Role"`,

    getRoleswithAccess: `SELECT * FROM "Role" inner join "RoleAccess" on "Role"."RoleId" = "RoleAccess"."RoleId" WHERE "Role"."RoleId" =$1`,

    get_userlist: `SELECT "FullName", "CompanyName", "MobileNumber", "Email", "Cypher"."UserId", "CountryCode", "ParentUserId", "Designation",
    "Location", "GST", "IEC", "Cypher"."RoleId","Cypher"."Enable","userplantransaction"."Downloads", "userplantransaction"."Searches", 
    "userplantransaction"."StartDate", "userplantransaction"."EndDate", "userplantransaction"."Validity", 
    "userplantransaction"."DataAccess", "userplantransaction"."CountryAccess", "userplantransaction"."CommodityAccess", 
    "userplantransaction"."TarrifCodeAccess", "userplantransaction"."Workspace", "userplantransaction"."WSSLimit", 
    "userplantransaction"."Downloadfacility", "userplantransaction"."Favoriteshipment", "userplantransaction"."Whatstrending", 
    "userplantransaction"."Companyprofile", "userplantransaction"."Addonfacility", "userplantransaction"."Analysis", 
    "userplantransaction"."User"
    ,"plan"."PlanId", "plan"."PlanName",
	"AddUser", "EditUser", "DeleteUser", "AddPlan", "EditPlan", "DeletePlan", "UserAccess"."Downloads" as Dwnlds, "Search", "EnableId", "DisableId", "BlockUser", "UnblockUser", "ClientList", "PlanList", "Share"
    FROM public."Cypher" 
        inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
        inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId" OR "Cypher"."ParentUserId" = "userplantransaction"."UserId"
        inner join public."UserAccess" on "Cypher"."UserId" = "UserAccess"."UserId" OR "Cypher"."ParentUserId" = "UserAccess"."UserId"
        inner join public.plan  on "plan"."PlanId" = "userplantransaction"."PlanId"
    ORDER BY "Cypher"."UserId" DESC`,
    get_user_By_Userid: `SELECT * FROM public."Cypher" 
    inner join "Role" on "Cypher"."RoleId" = "Role"."RoleId"
    inner join public.userplantransaction on "Cypher"."UserId" = "userplantransaction"."UserId"
    inner join public.plan  on "plan"."PlanId" = "userplantransaction"."PlanId"
    WHERE "UserId"=$1
    ORDER BY "Cypher"."UserId" DESC`,
    get_alert_message:`SELECT * FROM public.alert_msg where "id"=$1 AND "status"= true`,    
    add_notification:`INSERT INTO public.push_notifications(message, created_date) VALUES ($1, $2);`,
    get_notification: (id) => `SELECT "Id", "message", created_date, transaction_time FROM public.push_notifications where "Id"=${id} ORDER BY transaction_time DESC`,
    get_notification_all:`SELECT "Id", "message", created_date, transaction_time FROM public.push_notifications ORDER BY transaction_time DESC`,
    update_userPreferences:`UPDATE public."Cypher" SET "userPreference"=$2 WHERE "Email"=$1`,
    fetch_userPreferences: `SELECT "userPreference" FROM public."Cypher" where "Email"=$1`,    
    update_alert_message: 'UPDATE public.alert_msg SET txt_msg=$1, start_date=$2, end_date=$3, show_popup=$4, show_marquee=$5, status=true WHERE id=$6',//`UPDATE public.alert_msg SET txt_msg=$1 WHERE id=$2`,
    get_all_countries:`SELECT * FROM public.all_countries Order by country`,
    insert_userlog:`INSERT INTO public."Userlog"("UserId", "IP", "Location", "Searchcount", "Searchhistory", "Datetime") VALUES ($1, $2, $3, $4, $5, $6);`,
    get_userlog:`SELECT * FROM "Userlog" where "UserId"=$1 AND "Datetime"=$2`,
    
    update_userlog:`update "Userlog" set "Searchcount" = "Searchcount" + $1 where "UserId"=$2 AND "Datetime"=$3`,
    add_user_action_log:`INSERT INTO public."UserActionLog"("UserId", "LogType", "Log", "CreatedDate") VALUES ($1, $2, $3, $4);`,
    
    get_Name_by_userid:`SELECT "FullName", "Email" FROM public."Cypher" where "UserId"=$1`,
    add_user_Activity_log:`INSERT INTO public."UserActivityLog"("UserId", "Lastlogin", "IP","Email") VALUES ( $1, $2, $3, $4);`,
    
    
    getWhatstrandingTotalVal: `select total_import, total_export, total_value from whatstranding_totalvalues where year=$1 and active=true`,
    getWhatstrandingCommodity: `select commodity_name, "Year", "Month", total_value from whatstranding_commoditiwise where "direction"=$1 and "Year">=$2 and "Year"<=$3 and active=true`,

    /////////////////////////////////////////////////jitender/////////////////////////////////////////////
    UPDATE_FAVORITE_SHIPMENT: 'update "userplantransaction" set "Favoriteshipment"="Favoriteshipment"::integer-1 where "UserId"=$1',
    UPDATE_COMPANY_POINTS: 'update "userplantransaction" set "Companyprofile"="Companyprofile"::integer-1 where "UserId"=$1 returning "Companyprofile"',
    UPDATE_WORKSPACE_POINTS: 'update "userplantransaction" set "Workspace"="Workspace"::integer-1 where "UserId"=$1 returning "Workspace"',
    UPDATE_REQUESTED_COMPANY: 'update requested_companies set resolve_datetime=$1, resolved_by=$2, status=true where id=$3 and active=true',
    GET_COMPANY_INFO_DATA: (company) => `select id, iec, company_name, person_name, contact, email, location, address from indian_companies where company_name ilike '%${company}%' and active=true`,
    GET_COMPANY_LIST: `select id, iec, company_name, person_name, contact, email, location, address from indian_companies where company_name ilike $1 and active=true limit 10`,
    GET_REQUESTED_COMPANIES: `select id, company_name, request_datetime, resolve_datetime, requested_from, resolved_by, status from requested_companies where active=true`,
    SEND_COMPANY_REQUEST: `insert into requested_companies (company_name, request_datetime, requested_from) values($1, $2, $3)`,
    SEND_NEW_COMPANY: `insert into indian_companies (iec, company_name, person_name, contact, email, location, address) values($1, $2, $3, $4, $5, $6, $7)`,
    GET_FAVORITE_COMPANIES: (ids) => `select id, iec, company_name, person_name, contact, email, location, address from indian_companies where id in (${ids.toString()}) and active=true`,
    GET_LINKEDIN_COMPANIES: `select id, company_name, company_type, "company_aboutUs", "company_website", "company_size", "company_associatedMembers", company_headquarter, company_linkedin, company_contact, company_address, "company_googleDirection" from "LinkedIn_Companies" where company_name ilike $1 and active=true`,
    GET_LINKEDIN_EMPLOYEES: `select id, name, designation, url from "LinkedIn_Employees" where company_name ilike $1 and active=true`,
    GET_COMMODITY_COMPANY_COUNTS: `select commodity, export_total, import_total from "allCommodityCompanyCounts" where active=true`,
    ADD_COMMODITY_FEEDBACK: `insert into "commodityCompanyFeedback" (user_id, msg, transaction_time) values($1, $2, $3)`,
    GET_COMMODITY_FEEDBACK: `select id, user_id, msg, transaction_time from "commodityCompanyFeedback"`,
    GET_TOP_FIVE_COMPANIES: `select id, INITCAP(company_name) as company_name, INITCAP(location) as location from "indian_companies" where id in (253364, 225224, 149647, 223686, 217597) and active=true`,
    GET_OTHER_TEN_COMPANIES: `select INITCAP(company_name) as company_name, INITCAP(person_name) as person_name, contact, email, INITCAP(location) as location from "indian_companies" where id not in (253364, 225224, 149647, 223686, 184606) and active=true limit 10`,
    GET_WHATSTRANDING_MAP: `select country, total_exporters, total_importers, exp_share, imp_share from whatstranding_worldmap order by total_exporters desc`,
    GET_GLOBAL_COUNTRIES_BY_TYPE: (type) => `SELECT a."Countrycode", a."CountryName", a."Import", a."Export", a."data_type", a."active", a."is_new",
                                    b."CountryCode", b."Direction", b."StartDate", b."LatestDate", b."CountryType"
                                    FROM "Country" a JOIN "datauploadhistorybydate" b ON a."data_type" = b."CountryType"
                                    where b."CountryCode"=a."Countrycode" and "CountryType" like '%${type}%' order by a."Countrycode"`,
    
    GET_ALL_GLOBE_COUNTRIES: `select "Countrycode", "CountryName", "Import", "Export", "data_type", "is_new", "active" FROM public."Country"`,
    GET_COUNTRIES_DATES: `select "CountryCode", "Direction", "LatestDate", "StartDate" from datauploadhistorybydate`,
    GET_ACTIVE_MAILS: `SELECT "Email" FROM "Cypher" JOIN "userplantransaction" ON "Cypher"."UserId" = "userplantransaction"."UserId" where "userplantransaction"."EndDate">now()`,
    // GET_LOCATOR_LIST: (table, condition) => `select distinct on ("${table.locatorColName}") "${table.locatorColName}", "RecordID" as id from "${table.name}" where ${condition} limit 10`,
    GET_COUNTRY_BY_CODE_NAME: `select "Countrycode","data_type" from "Country" where data_type=$1 and "Countrycode"=$2`,
    GET_COUNTRY_CODES_LIST: "select country_name, replace(lower(country_name), ' ', '') AS country_value, country_code from country_codes where active=true order by country_name",
    ADD_COUNTRY_DURATION: `insert into "datauploadhistorybydate" ("CountryCode", "Direction", "LatestDate", "StartDate", "CountryType") values($1, $2, NULL, NULL, $3)`,
    GET_SIDEFILTER_ACCESS: `SELECT "Id", "HsCode", "ProductDesc", "Exp_Name", "Imp_Name", "CountryofDestination", "CountryofOrigin", "PortofOrigin", "Mode", "uqc", "Quantity", "Month", "Year", "Country", "Direction", "PortofDestination", "LoadingPort", "Currency", "NotifyPartyName", "CountryType" FROM public."SideFilterAccess" where "Country"=$1 AND "Direction"=$2 AND "CountryType"=$3 AND active=true`,

    get_all_userlog:`SELECT "Id", "Userlog"."UserId", "IP", "Userlog"."Location", "Searchcount", "Searchhistory", "Datetime", "Email" FROM public."Userlog" inner join "Cypher" on "Userlog"."UserId" = "Cypher"."UserId" ORDER BY "Datetime" DESC LIMIT 100 OFFSET $1`,
    get_user_action_log:`SELECT * FROM public."UserActionLog" where "LogType" ILIKE $1 ORDER BY "CreatedDate" DESC LIMIT 100 OFFSET $2`,
    get_user_Activitylist:`SELECT * FROM "UserActivityLog" Where "UserId"=$1 ORDER BY "Lastlogin" DESC LIMIT 100 OFFSET $2`,
    get_user_ActivityAlllist:`SELECT * FROM "UserActivityLog" ORDER BY "Lastlogin" DESC LIMIT 100 OFFSET $1`,
};






