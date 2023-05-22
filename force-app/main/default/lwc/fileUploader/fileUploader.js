import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveRecords from '@salesforce/apex/FileUploaderController.saveRecords';

import LightningAlert from "lightning/alert";

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
    fileData = {};
    @track records = [];//all created records
    columns = columns;

    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    totalRecords = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPages = 0; //Total no.of pages
    pageNumber = 0; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page
    
    get bDisableFirst() {
        return (this.pageNumber <= 1);
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }

    get isDisabledSaveRecords(){
        return (this.fileData.filename == undefined);
    }

    /**File uploader code block start*/
    openfileUpload(event) {
        const file = event.target.files[0];
        var fileSize = Math.round((file.size / 1048576));
        if(fileSize > 3.5){
            LightningAlert.open({
                message: "Selected file exceeds the limit of 3.5 MB. Please choose another file or reduce the selected one.",
                theme: "error",
                label: "File " +  file.name + " is too large"
            }).then(() => {
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
    
    handleClick(){
        const {base64, filename} = this.fileData;
        let titleStart = 'The file is uploaded';
        let variantStart = 'warning';
        let messageStart = 'The process is running';
        this.showToast(titleStart, messageStart, variantStart);
        saveRecords({ base64 }).then(result=>{
            for (let i = 0; i < result.length; i++) {
                result[i].rowNumber = i+1;
            }
            this.records = result;
            this.totalRecords = result.length; // update total records count                 
            this.pageSize = this.pageSizeOptions[0]; //set pageSize with default value as first option
            this.paginationHelper(); // call helper menthod to update pagination logic 
            this.fileData = {};
            let title = 'Records are created successfully!';
            let variant = 'success';
            let message = '';
            this.showToast(title, message, variant);
        })
        .catch(error => {
            LightningAlert.open({
                message: 'Something went wrong: ' + error.body.message,
                theme: "error",
                label: "Error with saving the records"
            }).then(() => {
                console.log("###Alert Closed");
            });
            return;
        });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

/**File uploader code block finish*/

/**Pagination code block start*/

    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }
/**Pagination code block finish*/

}