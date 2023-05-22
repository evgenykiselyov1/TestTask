/**
 * @description       : This is an apex test Class for apex controller of the fileuploader component. 
 *                      It provides tests for positive and negative scenarios
 * @author            : Ievgen Kyselov
 * @group             : 
 * @last modified on  : 05-22-2023
 * @last modified by  : Ievgen Kyselov
**/

@isTest
public with sharing class FileUploaderControllerTest {
    @isTest
    public static void saveRecordsPositiveTest() {
        //Given
        String fileDataMock = '['+
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
        Blob fileDataBlob = Blob.valueof(fileDataMock);
        String fileBodyEncoded = EncodingUtil.base64Encode(fileDataBlob);
        //When
        List<Policy_Transaction_Exception_Management__c> policyTransactionExceptionManagements = FileUploaderController.saveRecords(fileBodyEncoded);
        //Then
        System.assertEquals(2, policyTransactionExceptionManagements.size());
    }

    @isTest
    public static void saveRecordsNegativeTest() {
        //Given
        String fileDataMock = '['+
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
        Blob fileDataBlob = Blob.valueof(fileDataMock);
        String fileBodyEncoded = EncodingUtil.base64Encode(fileDataBlob);
        try{
            //When
            List<Policy_Transaction_Exception_Management__c> policyTransactionExceptionManagements = FileUploaderController.saveRecords(fileBodyEncoded);
        } catch (Exception ex) {
            //Then
            System.assertEquals('Script-thrown exception', ex.getMessage());
        }  
    }
    
}