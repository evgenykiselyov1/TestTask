public with sharing class FileUploaderController {
    @AuraEnabled
    public static List<Sobject> saveRecords(String base64) {
        try {
            String fileBodyAsString = EncodingUtil.base64Decode(base64).toString();
            List<Policy_Transaction_Exception_Management__c> objects = (List<Policy_Transaction_Exception_Management__c>)JSON.deserializeStrict(fileBodyAsString, List<Policy_Transaction_Exception_Management__c>.class);
            Database.SaveResult[] result=Database.insert(objects);
            List<String> ids = new List<String>();
            for(Database.SaveResult res: result){
                ids.add(res.getId());
            }
            objects = [SELECT CreatedDate,Carrier_File_Code__c,Insured_Name__c,LOB__c,Policy_Effective_Date__c,Policy_Number__c,Premium__c,Transaction_Code__c
                        FROM Policy_Transaction_Exception_Management__c WHERE id IN :ids];
            return objects;            
        } catch (Exception ex) {
            String errorMsg = ex.getMessage();
            throw new AuraHandledException(ErrorMsg);
        }
    }
}