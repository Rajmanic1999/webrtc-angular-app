import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Peer from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog } from '@angular/material/dialog';
import { CallInfoDialogComponents, DialogData } from './dialog/callinfo-dialog.component';




@Injectable()
export class PeerCallService {

    public data:any=[ ];
    public mic_switch:boolean = true;
    public video_switch:boolean = true;

    private its_host:boolean=false;
    sec_call=0;
    private peer: Peer;
    private mediaCall: Peer.MediaConnection;

    localstream;
    private localStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public localStream$ = this.localStreamBs.asObservable();
    private remoteStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public remoteStream$ = this.remoteStreamBs.asObservable();

    private isCallStartedBs = new Subject<boolean>();
    public isCallStarted$ = this.isCallStartedBs.asObservable();

    stream;
    peers_id;
    constructor(private snackBar: MatSnackBar,public dialog: MatDialog) { }

    public firstcall(connection,remotePeerId){
      connection.on('open', function(){
        console.log("================== Send msg1 +++++++++++++++++++++++++++");
        connection.send('Raja,'+remotePeerId);
      });
    }
    public async establishMediaCall(remotePeerId: string) {
      this.peers_id=remotePeerId;
        try {
            this.its_host=true;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.stream=stream;
            const connection = this.peer.connect(remotePeerId);
            connection.on('error', err => {
                console.error(err);
                this.snackBar.open(err, 'Close');
            });
            this.firstcall(connection,remotePeerId);
            var data=0;
            // connection.on('data', conn => {
            //   console.error(conn);
              // if(conn==1){
                if(true){
                this.mediaCall = this.peer.call(remotePeerId, stream);
                if (!this.mediaCall) {
                    let errorMessage = 'Unable to connect to remote peer';
                    this.snackBar.open(errorMessage, 'Close');
                    throw new Error(errorMessage);
                }
                this.localStreamBs.next(stream);
                this.isCallStartedBs.next(true);

                this.mediaCall.on('stream',
                    (remoteStream) => {
                        this.remoteStreamBs.next(remoteStream);
                    });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close');
                    console.error(err);
                    this.isCallStartedBs.next(false);
                });
                this.mediaCall.on('close', () => this.onCallClose());
              }
            // });

        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close');
            this.isCallStartedBs.next(false);
        }
    }

sleep(ms) {​​​​​​​​
    return new Promise(resolve=>setTimeout(resolve, ms));
}​​​​​​​​


    private onCallClose() {
        this.remoteStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
        this.localStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
        this.snackBar.open('Call Ended', 'Close');
    }

    public closeMediaCall() {
      this.videoff();
      this.mediaCall?.close();
        if (!this.mediaCall) {
            this.onCallClose()
        }
        this.isCallStartedBs.next(false);

    }

    public destroyPeer() {
      this.videoff();
        this.mediaCall?.close();
        this.peer?.disconnect();
        this.peer?.destroy();

    }

    public videoff(){
      this.data=[];

      this.localStreamBs?.value.getTracks().forEach(track => {
        track.stop();
      });
      this.remoteStreamBs?.value.getTracks().forEach(track => {
        track.stop();
      });
    }



  toggleVideo() {
    if(this.localstream != null && this.localstream.getVideoTracks().length > 0){
      this.video_switch = !this.video_switch;
      this.localstream.getVideoTracks()[0].enabled = this.video_switch;
    }

  }

  toggleMic() {
    if(this.localstream  != null && this.localstream .getAudioTracks().length > 0){
      this.mic_switch = !this.mic_switch;

      this.localstream .getAudioTracks()[0].enabled = this.mic_switch;
    }
  }

}
