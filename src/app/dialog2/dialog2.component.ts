
import { Inject } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-dialog2',
    templateUrl: './dialog2.component.html',
    styleUrls: ['./dialog2.component.scss']
})
export class Dialog2Component {
    constructor(
        public dialogRef: MatDialogRef<Dialog2Component>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _snackBar: MatSnackBar
    ) { }


}

export interface DialogData {
    peerId?: string;
    joinCall: boolean;
    name?:string;
}
