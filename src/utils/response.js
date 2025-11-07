/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Jitender Kumar
 * @since   2022
 */

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */
 exports.success = (message, results, statusCode) => {
    return {
      message,
      error: false,
      code: statusCode,
      results
    };
  };
  
  /**
   * @desc    Send any error response
   *
   * @param   {string} message
   * @param   {number} statusCode
   */
  exports.error = (message, statusCode) => {
    // List of common HTTP request code
    const codes = [200, 201, 400, 401, 404, 403, 422, 500];
  
    // Get matched code
    const findCode = codes.find((code) => code == statusCode);
  
    if (!findCode) statusCode = 500;
    else statusCode = findCode;
  
    return {
      message,
      code: statusCode,
      error: true
    };
  };
  
  /**
   * @desc    Send any validation response
   *
   * @param   {object | array} errors
   */
  exports.validation = (errors) => {
    return {
      message: "Validation errors",
      error: true,
      code: 422,
      errors
    };
  };


exports.extractCountry = (tableName) => {
    let tablesCountryName = tableName.replace(/^\/?get(.*?)(Imports|Exports)$/i, '$1');
    tablesCountryName = tablesCountryName[0].toUpperCase() + tablesCountryName.slice(1).toLowerCase();

    const country = {
        Afghanistan: "AFGHANISTAN",
        Argentina: "ARGENTINA",
        Algeria: "ALGERIA",
        Angola: "ANGOLA",
        Armenia: "ARMENIA",
        Australia: "AUSTRALIA",
        Austria: "AUSTRIA",
        Azerbaijan: "AZERBAIJAN",
        Bahrain: "BAHRAIN",
        Barbados: "BARBADOS",
        Belarus: "BELARUS",
        Belgium: "BELGIUM",
        Benin: "BENIN",
        Bermuda: "BERMUDA",
        Bhutan: "BHUTAN",
        Brazil: "BRAZIL",
        Bulgaria: "BULGARIA",
        Burundi: "BURUNDI",
        Cambodia: "CAMBODIA",
        Canada: "CANADA",
        Chad: "CHAD",
        China: "CHINA",
        Croatia: "CROATIA",
        Cyprus: "CYPRUS",
        Czechia: "CZECHIA",
        Denmark: "DENMARK",
        Democraticrepubliccongo: "DEMOCRATIC REPUBLIC CONGO",
        Dominicanrepublic: "DOMINICAN REPUBLIC",
        Egypt: "EGYPT",
        Elsalvador: "EL SALVADOR",
        Estonia: "ESTONIA",
        Finland: "FINLAND",
        France: "FRANCE",
        Gabon: "GABON",
        Georgia: "GEORGIA",
        Germany: "GERMANY",
        Greece: "GREECE",
        Guatemala: "GUATEMALA",
        Guinea: "GUINEA",
        Honduras: "HONDURAS",
        Hongkong: "HONG KONG",
        Hungary: "HUNGARY",
        Iran: "IRAN",
        Ethiopia: "ETHIOPIA",
        Iraq: "IRAQ",
        Ireland: "IRELAND",
        Israel: "ISRAEL",
        Italy: "ITALY",
        Jamaica: "JAMAICA",
        Japan: "JAPAN",
        Jordan: "JORDAN",
        Kenya: "KENYA",
        Kuwait: "KUWAIT",
        Kyrgyzstan: "KYRGYZSTAN",
        Latvia: "LATVIA",
        Lithuania: "LITHUANIA",
        Luxembourg: "LUXEMBOURG",
        Libya: "LIBYA",
        Maldives: "MALDIVES",
        Mauritius: "MAURITIUS",
        Moldova: "MOLDOVA",
        Morocco: "MOROCCO",
        Mozambique: "MOZAMBIQUE",
        Nepal: "NEPAL",
        Netherlands: "NETHERLANDS",
        Newzealand: "NEW ZEALAND",
        Niger: "NIGER",
        Nigeria: "NIGERIA",
        Norway: "NORWAY",
        Oman: "OMAN",
        Palestine: "PALESTINE",
        Papuanewguinea: "PAPUA NEW GUINEA",
        Poland: "POLAND",
        Portugal: "PORTUGAL",
        Qatar: "QATAR",
        Romania: "ROMANIA",
        Saudiarabia: "SAUDI ARABIA",
        Senegal: "SENEGAL",
        Serbia: "SERBIA",
        Seychelles: "SEYCHELLES",
        Slovakia: "SLOVAKIA",
        Slovenia: "SLOVENIA",
        Singapore: "SINGAPORE",
        Somalia: "SOMALIA",
        Southafrica: "SOUTHA FRICA",
        Southkorea: "SOUTH KOREA",
        Spain: "SPAIN",
        Sweden: "SWEDEN",
        Switzerland: "SWITZERLAND",
        Taiwan: "TAIWAN",
        Tajikistan: "TAJIKISTAN",
        Thailand: "THAILAND",
        Togo: "TOGO",
        Trinidadandtobago: "TRINIDAD AND TOBAGO",
        Tunisia: "TUNISIA",
        Turkmenistan: "TURKMENISTAN",
        Unitedarabemirates: "UNITED ARAB EMIRATES",
        Unitedkingdom: "UNITED KINGDOM",
        Unitedstatesofamerica: "UNITED STATES OF AMERICA",
        Yemen: "YEMEN",
        Sudan: "SUDAN",
        Syria: "SYRIA",
    };

    return country[tablesCountryName];
}

exports.countryMappingViaType = {
    bolivia: {isCustom: true},
    brazil: {isCustom: true},
    mexico: {isCustom: true},
    nicaragua: {isCustom: true},
    turkey: {isCustom: true},
    usa: {isCustom: true},
    australia: {isCustom: false, mirrorCountryName: "AUSTRALIA"},
    canada: {isCustom: false, mirrorCountryName: "CANADA"},
    dominicanrepublic: {isCustom: false, mirrorCountryName: "DOMINICAN REPUBLIC"},
    egypt: {isCustom: false, mirrorCountryName: "EGYPT"},
    elsalvador: {isCustom: false, mirrorCountryName: "EL SALVADOR"},
    guatemala: {isCustom: false, mirrorCountryName: "GUATEMALA"},
    honduras: {isCustom: false, mirrorCountryName: "HONDURAS"},
    israel: {isCustom: false, mirrorCountryName: "ISRAEL"},
    japan: {isCustom: false, mirrorCountryName: "JAPAN"},
    newzealand: {isCustom: false, mirrorCountryName: "NEW ZEALAND"},
    puertorico: {isCustom: false, mirrorCountryName: "PUERTO RICO"},
    spain: {isCustom: false, mirrorCountryName: "SPAIN"},
    taiwan: {isCustom: false, mirrorCountryName: "TAIWAN"},
    thailand: {isCustom: false, mirrorCountryName: "THAILAND"},
    unitedkingdom: {isCustom: false, mirrorCountryName: "UNITED KINGDOM"},
    unitedkingdom: {isCustom: false, mirrorCountryName: "UNITED KINGDOM"},
}
