@isTest
public with sharing class FileUploaderControllerTest {
    @isTest
    public static void saveRecordsTest() {

        String testData = '['+
            '{'+
            '"Carrier_File_Code__c" : 10001,'+
            '"Insured_Name__c" : "Michael Gauss",'+
            '"LOB__c" : "AUTOP",'+
            '"Policy_Effective_Date__c" : "2023-05-22",'+
            '"Policy_Number__c" : 100000000001,'+
            '"Premium__c" : 101,'+
            '"Transaction_Code__c" : "BOE"'+
            '},'+
            '{'+
            '"Carrier_File_Code__c" : 10022,'+
            '"Insured_Name__c" : "Eric Pasqal",'+
            '"LOB__c" : "AUTOP",'+
            '"Policy_Effective_Date__c" : "2023-05-22",'+
            '"Policy_Number__c" : 100000000022,'+
            '"Premium__c" : 111,'+
            '"Transaction_Code__c" : "BRF"'+
            '}'+
        ']';
        Blob testDataBlob = Blob.valueof(testData);
        String fileBodyEncoded = EncodingUtil.base64Encode(testDataBlob);
        List<Policy_Transaction_Exception_Management__c> objects = FileUploaderController.saveRecords(fileBodyEncoded);
        System.assertEquals(2, objects.size());
    }

    @isTest
    public static void saveRecordsErrorTest() {

        String testData = '['+
            '{'+
            '"Carrier_File_Code" : 10001,'+
            '"Insured_Name__c" : "Michael Gauss",'+
            '"LOB__c" : "AUTOP",'+
            '"Policy_Effective_Date__c" : "2023-05-22",'+
            '"Policy_Number__c" : 100000000001,'+
            '"Premium__c" : 101,'+
            '"Transaction_Code__c" : "BOE"'+
            '},'+
            '{'+
            '"Carrier_File_Code__c" : 10022,'+
            '"Insured_Name__c" : "Eric Pasqal",'+
            '"LOB__c" : "AUTOP",'+
            '"Policy_Effective_Date__c" : "2023-05-22",'+
            '"Policy_Number__c" : 100000000022,'+
            '"Premium__c" : 111,'+
            '"Transaction_Code__c" : "BRF"'+
            '}'+
        ']';
        Blob testDataBlob = Blob.valueof(testData);
        String fileBodyEncoded = EncodingUtil.base64Encode(testDataBlob);
        try{
            List<Policy_Transaction_Exception_Management__c> objects = FileUploaderController.saveRecords(fileBodyEncoded);
        } catch (Exception ex) {
            System.assertEquals('Script-thrown exception', ex.getMessage());
        }  
    }
    
}