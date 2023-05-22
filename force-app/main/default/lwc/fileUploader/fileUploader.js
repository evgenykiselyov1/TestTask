/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 05-22-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningAlert from "lightning/alert";
import saveRecords from '@salesforce/apex/FileUploaderController.saveRecords';

const columns = [
    {label : 'Sequence Number', fieldName : 'rowNumber', type : 'number'},
    { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', 
    typeAttributes: { year: 'numeric', month: 'numeric', day: 'numeric'}},
    { label: 'Policy Number', fieldName: 'Policy_Number__c' },
    { label: 'Transaction Code', fieldName: 'Transaction_Code__c' },
    { label: 'Insured Name', fieldName: 'Insured_Name__c' },
    { label: 'LOB', fieldName: 'LOB__c' },
    { label: 'Policy Effective Date', fieldName: 'Policy_Effective_Date__c', type: 'date',
    typeAttributes: { year: 'numeric', month: 'numeric', day: 'numeric'}},
    { label: 'Premium', fieldName: 'Premium__c' },
    { label: 'Carrier File Code', fieldName: 'Carrier_File_Code__c' },
];

export default class FileUploader extends LightningElement {
    
    @track records = [];//all created records
    columns = columns;
    fileData = {};
    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    totalRecordsNumber = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPagesNumber = 0; //Total no.of pages
    pageNumber = 0; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page
    
    get isDisableFirst() {
        return (this.pageNumber <= 1);
    }
    get isDisableLast() {
        return this.pageNumber == this.totalPagesNumber;
    }

    get isDisabledSaveRecords(){
        return (this.fileData.filename == undefined);
    }

    /**File uploader code block start*/
    handleFileUpload(event) {
        const file = event.target.files[0];
        var fileSize = Math.round((file.size / 1048576));
        if(fileSize > 3.5){
            LightningAlert.open({
                message: "Selected file exceeds the limit of 3.5 MB. Please choose another file or reduce the selected one.",
                theme: "error",
                label: "File " +  file.name + " is too large"
            })
            .then(() => {
                console.log("###Alert Closed");
            });
        }else{
            var reader = new FileReader();
            reader.onload = () => {
            var base64 = reader.result.split(',')[1];
            this.fileData = {
                'filename': file.name,
                'base64': base64
                }
            }
            reader.readAsDataURL(file);  
        }
    }
    
    handleSaveRecords(){
        const {base64, filename} = this.fileData;
        this.showToast('The file is uploaded', 'warning', 'The process is running');
        saveRecords({ base64 })
        .then(result=>{
            for (let i = 0; i < result.length; i++) {
                result[i].rowNumber = i+1;
            }
            this.records = result;
            this.totalRecordsNumber = result.length; // update total records count                 
            this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
            this.paginationHelper(); // call helper menthod to update pagination logic 
            this.fileData = {};
            this.showToast('Records are created successfully!', 'success', '');
        })
        .catch(error => {
            LightningAlert.open({
                message: 'Something went wrong: ' + error.body.message,
                theme: "error",
                label: "Error with saving the records"
            })
            .then(() => {
                console.log("###Alert Closed");
            });
            return;
        });
    }

/**File uploader code block finish*/

/**Pagination code block start*/

   handleRecordsPerPageChange(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
   handlePreviousPageClick() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
   handleNextPageClick() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
   handleFirstPageClick() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
   handleLastPageClick() {
        this.pageNumber = this.totalPagesNumber;
        this.paginationHelper();
    }
    // JS function to handle pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPagesNumber = Math.ceil(this.totalRecordsNumberNumber / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPagesNumber) {
            this.pageNumber = this.totalPagesNumber;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecordsNumber) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }
/**Pagination code block finish*/

showToast(title, message, variant) {
    const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
    });
    this.dispatchEvent(event);
}

}