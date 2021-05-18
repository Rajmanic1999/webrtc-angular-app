import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { CallService } from '../call.service';
import { CallInfoDialogComponents, DialogData } from '../dialog/callinfo-dialog.component';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit, OnDestroy {
  public isCallStarted$: Observable<boolean>;
  private peerId: string;

  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;

  constructor(public dialog: MatDialog, public callService: CallService) {
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer();
    // alert(this.peerId)
  }

  ngOnInit(): void {
    this.callService.localStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => this.localVideo.nativeElement.srcObject = stream)
    this.callService.remoteStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => this.remoteVideo.nativeElement.srcObject = stream)
      // this.showModal(false);
  }

  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }
  showModal1(){
    this.callService.enableans();
  }
  public showModal(joinCall: boolean): void {
    // alert(this.peerId)
    let dialogData: DialogData = ({ peerId: this.peerId, joinCall: false });
    const dialogRef = this.dialog.open(CallInfoDialogComponents, {
      width: '250px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(async (peerId) => this.callService.enableans()
        ),
      )
      .subscribe(data => {
        console.error(data)
      });
  }

  public endCall() {
    this.callService.closeMediaCall();
  }
  public sendinvite(data){
    var data1=this.callService.callans(1);
    console.error(data1);

  }
}
