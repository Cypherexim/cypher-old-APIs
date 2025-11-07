const ExcelJS = require('exceljs');
const {PassThrough} = require('stream');
const fs = require('fs');

// async function generateEncodedXLSX(dataObj, decodeBase64ToExcel) {
//     try {
//         await preImageInsertion();

//         const workbook = new ExcelJS.stream.xlsx.WorkbookReader({
//             stream: new PassThrough(),
//             useStyles: true,
//             useSharedStrings: true
//         });//.Workbook();
//         const worksheet = workbook.addWorksheet('Sheet1');

//         const fileInfoObj = {
//             "DIRECTION": dataObj?.dataInfo?.direction, 
//             "HSCODE": dataObj?.dataInfo?.hsCode, 
//             "FROM": dataObj?.dataInfo?.dateFrom, 
//             "TO": dataObj?.dataInfo?.dateTo, 
//             "TOTAL RECORDS": dataObj?.data?.length, 
//             "": ""
//         }
//         const fileInfo = Object.keys(fileInfoObj);        
//         for(let i=1; i<fileInfo.length; i++) worksheet.addRow(["","","",fileInfo[i], `${fileInfoObj[fileInfo[i]]}`]);

//         // **Merge Cells A1 to C1**
//         worksheet.mergeCells("A1:C4");        

//         // Add header row with formatting
//         worksheet.addRow(dataObj?.headers);//fileInfo.length, 

//         // Add data rows        
//         dataObj?.data?.forEach((row, index) => {
//             worksheet.addRow(Object.values(row));//fileInfo.length+(index+1), 
//         });

        
//         // **Apply Styling to Header Row**
//         const headerRow = worksheet.getRow(fileInfo.length);    
//         headerRow.eachCell((cell, colNumber) => {
//             cell.font = { bold: true, color: { argb: '161615' } }; // White text
//             cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f5be01' } };
//             cell.alignment = { horizontal: "left", vertical: "middle" };
            
//             // **Apply AutoFilter to the Header Row**
//             if(headerRow.actualCellCount == colNumber) {
//                 worksheet.autoFilter = { from: `A${fileInfo.length}`, to: cell.address };
//             }
//         });

//         // **Apply Alternating Row Colors**
//         worksheet.eachRow((row, rowNumber) => {
//             if (rowNumber > fileInfo.length) { // Skip header
//                 row.eachCell(cell => {
//                     cell.fill = {
//                         type: 'pattern',
//                         pattern: 'solid',
//                         fgColor: { argb: 'FFFFFF' } // Light blue & white
//                     };
//                     cell.alignment = {horizontal: "left", vertical: "middle", indent: 1};
//                     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//                 });
//             } else if(rowNumber < fileInfo.length-1) {
//                 row.eachCell(cell => {
//                     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//                 });
//             }
//         });


//         // Generate XLSX buffer
//         const buffer = await workbook.xlsx.writeBuffer();

//         // Convert buffer to Base64
//         const base64String = buffer.toString("base64");

//         // console.log("Base64 Encoded XLSX:", base64String);
//         decodeBase64ToExcel(null, base64String);
//     } catch (error) {
//         decodeBase64ToExcel(error, "");
//     }    
// }




async function generateEncodedXLSX(dataObj, decodeBase64ToExcel) {
    try {
        await preImageInsertion();

        const workbook = new ExcelJS.stream.xlsx.WorkbookReader({
            stream: new PassThrough(),
            useStyles: true,
            useSharedStrings: true
        });//.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        const fileInfoObj = {
            "DIRECTION": dataObj?.dataInfo?.direction, 
            "HSCODE": dataObj?.dataInfo?.hsCode, 
            "FROM": dataObj?.dataInfo?.dateFrom, 
            "TO": dataObj?.dataInfo?.dateTo, 
            "TOTAL RECORDS": dataObj?.data?.length, 
            "": ""
        }
        const fileInfo = Object.keys(fileInfoObj);        
        for(let i=1; i<fileInfo.length; i++) worksheet.addRow(["","","",fileInfo[i], `${fileInfoObj[fileInfo[i]]}`]);

        // **Merge Cells A1 to C1**
        worksheet.mergeCells("A1:C4");        

        // Add header row with formatting
        worksheet.addRow(dataObj?.headers);//fileInfo.length, 

        // Add data rows        
        dataObj?.data?.forEach((row, index) => {
            worksheet.addRow(Object.values(row));//fileInfo.length+(index+1), 
        });

        
        // **Apply Styling to Header Row**
        const headerRow = worksheet.getRow(fileInfo.length);
        headerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true, color: { argb: '161615' } }; // White text
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f5be01' } };
            cell.alignment = { horizontal: "left", vertical: "middle" };
            
            // **Apply AutoFilter to the Header Row**
            if(headerRow.actualCellCount == colNumber) {
                worksheet.autoFilter = { from: `A${fileInfo.length}`, to: cell.address };
            }
        });

        // **Apply Alternating Row Colors**
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > fileInfo.length) { // Skip header
                row.eachCell(cell => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFFF' } // Light blue & white
                    };
                    cell.alignment = {horizontal: "left", vertical: "middle", indent: 1};
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                });
            } else if(rowNumber < fileInfo.length-1) {
                row.eachCell(cell => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                });
            }
        });


        // Generate XLSX buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Convert buffer to Base64
        const base64String = buffer.toString("base64");

        // console.log("Base64 Encoded XLSX:", base64String);
        decodeBase64ToExcel(null, base64String);
    } catch (error) {
        decodeBase64ToExcel(error, "");
    }    
}



// async function generateEncodedXLSX(dataObj, decodeBase64ToExcel) {
//     try {
//         await preImageInsertion();

//         const oldWorkbook = new ExcelJS.Workbook();
//         await oldWorkbook.xlsx.readFile("excel_output/output.xlsx");
//         const oldWorksheet = oldWorkbook.getWorksheet("Sheet1");

//         const outputStream = fs.createWriteStream("excel_output/modified_output.xlsx");
//         const newWorkbook  = new ExcelJS.stream.xlsx.WorkbookWriter({stream: outputStream});
//         const newWorksheet = newWorkbook.addWorksheet(oldWorksheet.name);

//         oldWorksheet.eachRow(row => newWorksheet.addRow(row.values));

//         const fileInfoObj = {
//             "DIRECTION": dataObj?.dataInfo?.direction, 
//             "HSCODE": dataObj?.dataInfo?.hsCode, 
//             "FROM": dataObj?.dataInfo?.dateFrom, 
//             "TO": dataObj?.dataInfo?.dateTo, 
//             "TOTAL RECORDS": dataObj?.data?.length, 
//             "": ""
//         }
//         const fileInfo = Object.keys(fileInfoObj);        
//         for(let i=1; i<fileInfo.length; i++) newWorksheet.addRow(["","","",fileInfo[i], `${fileInfoObj[fileInfo[i]]}`]);

//         // **Merge Cells A1 to C1**
//         newWorksheet.mergeCells("A1:C4");        

//         // Add header row with formatting
//         newWorksheet.addRow(dataObj?.headers);//fileInfo.length, 

//         // Add data rows        
//         dataObj?.data?.forEach((row, index) => {
//             newWorksheet.addRow(Object.values(row));//fileInfo.length+(index+1), 
//         });

        
//         // **Apply Styling to Header Row**
//         const headerRow = newWorksheet.getRow(fileInfo.length);        
//         headerRow.eachCell((cell, colNumber) => {
//             cell.font = { bold: true, color: { argb: '161615' } }; // White text
//             cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f5be01' } };
//             cell.alignment = { horizontal: "left", vertical: "middle" };
            
//             // **Apply AutoFilter to the Header Row**
//             if(headerRow.actualCellCount == colNumber) {
//                 newWorksheet.autoFilter = { from: `A${fileInfo.length}`, to: cell.address };
//             }
//         });

//         // **Apply Alternating Row Colors**
//         newWorksheet.eachRow((row, rowNumber) => {
//             if (rowNumber > fileInfo.length) { // Skip header
//                 row.eachCell(cell => {
//                     cell.fill = {
//                         type: 'pattern',
//                         pattern: 'solid',
//                         fgColor: { argb: 'FFFFFF' } // Light blue & white
//                     };
//                     cell.alignment = {horizontal: "left", vertical: "middle", indent: 1};
//                     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//                 });
//             } else if(rowNumber < fileInfo.length-1) {
//                 row.eachCell(cell => {
//                     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//                 });
//             }
//         });


//         // Generate XLSX buffer
//         const buffer = await newWorkbook.commit();

//         // Convert buffer to Base64
//         // const base64String = buffer.toString("base64");

//         // console.log("Base64 Encoded XLSX:", base64String);
//         // decodeBase64ToExcel(null, base64String);
//     } catch (error) {
//         decodeBase64ToExcel(error, "");
//     }    
// }



function preImageInsertion() {
    return new Promise(async(resolve, reject) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet1');

            // **Read Image File**
            const imageId = workbook.addImage({ filename: "excel_output/cypher_logo.png", extension: "png" });

            // **Add Image to Worksheet**
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 1 }, // Top-left position (Column C, Row 2)
                ext: { width: 194.88, height: 66.25 } // Set image size
            });

            // Save the modified Excel file
            await workbook.xlsx.writeFile("excel_output/output.xlsx");
            return resolve(true);
        } catch (error) { reject(error); }
    });
}

function createDecodedXLSXFile(base64String) {
    const decodedBuffer = Buffer.from(base64String, 'base64');

    fs.writeFileSync("decoded.xlsx", decodedBuffer);

    console.log("Decoded XLSX file saved!");
}

const excelDownloadInitProcess = (dataArr, dataInfo) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const allHeaders = Object.keys(dataArr[0]).map(key => key.toUpperCase()), headers = [];
        // allHeaders.forEach(header => headers.push({ header: header.toUpperCase(), key: header, width: 20 }));
        const dataObj = { headers: allHeaders, data: dataArr, dataInfo};
    
        generateEncodedXLSX(dataObj, (err, base64String) => {
            if(!err) {
                createDecodedXLSXFile(base64String);
                console.log("time taken: ", Date.now()-startTime);
                return resolve(base64String);
            }
            else { return reject(err); }
        });
    });
}


const data = [
    { name: 'Alice', age: 25, city: 'New York' },
    { name: 'Bob', age: 30, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' },
    { name: 'Alice', age: 25, city: 'New York' },
    { name: 'Bob', age: 30, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' },
    { name: 'Alice', age: 25, city: 'New York' },
    { name: 'Bob', age: 30, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' },
    { name: 'Alice', age: 25, city: 'New York' },
    { name: 'Bob', age: 30, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' },
    { name: 'Alice', age: 25, city: 'New York' },
    { name: 'Bob', age: 30, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' },
    { name: 'Alice', age: 25, city: 'New York' },
    { name: 'Bob', age: 30, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' },
    { name: 'Alice', age: 25, city: 'New York' },
    { name: 'Bob', age: 30, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' }
];

// excelDownloadInitProcess(data);
exports.int_main = () => excelDownloadInitProcess(data);

