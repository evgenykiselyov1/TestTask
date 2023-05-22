public with sharing class FileUploaderController {
    @AuraEnabled
    public static List<Sobject> saveRecords(String base64) {
        try {
            String fileBodyAsString = EncodingUtil.base64Decode(base64).toString();
            List<Policy_Transaction_Exception_Management__c> policyTransactionExceptionManagements = (List<Policy_Transaction_Exception_Management__c>)JSON.deserializeStrict(fileBodyAsString, List<Policy_Transaction_Exception_Management__c>.class);
            Database.SaveResult[] savedResults = Database.insert(policyTransactionExceptionManagements);
            List<String> insertedRecordsIds = new List<String>();
            for(Database.SaveResult result: savedResults){
                insertedRecordsIds.add(result.getId());
            }
            policyTransactionExceptionManagements = [SELECT CreatedDate,Carrier_File_Code__c,Insured_Name__c,LOB__c,Policy_Effective_Date__c,Policy_Number__c,Premium__c,Transaction_Code__c
                                                    FROM Policy_Transaction_Exception_Management__c 
                                                    WHERE id IN :insertedRecordsIds];
            return policyTransactionExceptionManagements;            
        } catch (Exception ex) {
            String excErrorMessage = ex.getMessage();
            throw new AuraHandledException(excErrorMessage);
        }
    }
}