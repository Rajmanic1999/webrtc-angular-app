import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Peer from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog } from '@angular/material/dialog';
import { CallInfoDialogComponents, DialogData } from './dialog/callinfo-dialog.component';




@Injectable()
export class CallService {

    public data:any=[ ];

    public local_mic_switch:boolean = true;
    public local_video_switch:boolean = true;

    public remote_mic_switch:boolean = true;
    public remote_video_switch:boolean = true;

    private its_host:boolean=false;
    sec_call=0;
    private peer: Peer;
    private mediaCall: Peer.MediaConnection;

    localstream;
    private localStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public localStream$ = this.localStreamBs.asObservable();

    remotestream;
    private remoteStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public remoteStream$ = this.remoteStreamBs.asObservable();

    private isCallStartedBs = new Subject<boolean>();
    public isCallStarted$ = this.isCallStartedBs.asObservable();

    isMicrophoneEnabled:boolean=false;
    isCameraEnabled:boolean=false;
    stream;
    peers_id;
    constructor(private snackBar: MatSnackBar,public dialog: MatDialog) { }


    public  initPeer(): string {
        if (!this.peer || this.peer.disconnected) {
            const peerJsOptions: Peer.PeerJSOption = {
                debug: 3,
                config: {
                    iceServers: [
                        {
                            urls: [
                                'stun:stun1.l.google.com:19302',
                                'stun:stun2.l.google.com:19302',
                            ],
                        }]
                },
            };
            try {
                let id = uuidv4();
                this.peers_id=id;
                console.log(id);
                this.peer = new Peer(id, peerJsOptions);
                return id;
            } catch (error) {
                console.error(error);
            }
        }
    }
    public firstcall(connection,remotePeerId){
      connection.on('open', function(){
        console.log("================== Send msg1 +++++++++++++++++++++++++++");
        connection.send('Raja,'+remotePeerId);
      });
    }
    public async establishMediaCall(remotePeerId: string) {
      this.isMicrophoneEnabled=true;
      this.isCameraEnabled=true;
      this.peers_id=remotePeerId;
        try {
            this.its_host=true;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
                this.localstream=stream;
                this.localStreamBs.next(stream);
                this.isCallStartedBs.next(true);

                this.mediaCall.on('stream',
                    (remoteStream) => {
                      this.remotestream=remoteStream;
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

    public async enableCallAnswer() {
      this.isMicrophoneEnabled=true;
      this.isCameraEnabled=true;
      var check=false;
      this.data.push({name:"Dr. Raja (me)",admited:true,"peerid":this.peers_id});
        try {

            console.log("===========================================================================================Jion call");
            this.peer.on('connection', (conn) => {
            conn.on('data', async (data) => {
                // Will print 'hi!'
                console.log("00000000000000000000000000000000 Receive msg1 +++++++++++++++++++++++++++");
                console.log(data);
                data=data.split(",");
                console.error(data);
                this.data.push({name:data[0],admited:false,"peerid":data[1]});
              });
            });

          // if(this.sec_call==1)  {
            if(true){
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.localstream=stream;
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {

                this.mediaCall = call;
                this.isCallStartedBs.next(true);

                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                  this.remotestream=remoteStream;
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open(err, 'Close');
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });
          }
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

getData(){
  return (this.data);
}
sendData(){
  this.data.push( {name:"test"});
}
 public async enableans(){
      this.peer.on('connection', (conn) => {
        conn.on('data', async (data) => {
            // Will print 'hi!'
            console.log("00000000000000000000000000000000 Receive msg1 +++++++++++++++++++++++++++");
            console.log(data);
            console.error("test1="+data);
            return data;
          });
        });
    }
// await this.sleep(3000);


    public callans(id){
      alert("first inside function="+id);
      this.peer.on('connection', (conn)=> {
        alert("2 inside function="+id);
        conn.on('open', ()=>{
          alert("test2="+id);
          console.log("================== Send msg2 +++++++++++++++++++++++++++");
          conn.send(id);
        });
      });
      return true;
    }
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



  local_toggleVideo() {
    if(this.localstream != null && this.localstream.getVideoTracks().length > 0){
      this.local_video_switch = !this.local_video_switch;
      this.localstream.getVideoTracks()[0].enabled = this.local_video_switch;
    }

  }

  local_toggleMic() {
    if(this.localstream  != null && this.localstream .getAudioTracks().length > 0){
      this.local_mic_switch = !this.local_mic_switch;
      this.localstream .getAudioTracks()[0].enabled = this.local_mic_switch;
    }
  }


  remote_toggleVideo() {
    if(this.remotestream != null && this.remotestream.getVideoTracks().length > 0){
      this.remote_video_switch = !this.remote_video_switch;
      this.remotestream.getVideoTracks()[0].enabled = this.remote_video_switch;
    }

  }

  remote_toggleMic() {
    if(this.remotestream  != null && this.remotestream .getAudioTracks().length > 0){
      this.remote_mic_switch = !this.remote_mic_switch;
      this.remotestream .getAudioTracks()[0].enabled = this.remote_mic_switch;
    }
  }

    // public senmsg(){
    //   var conn = this.peer.connect(this.peers_id);
    //   conn.on('open', function(){
    //     console.log("================== Send msg +++++++++++++++++++++++++++");
    //     conn.send('hi!');
    //   });
    // }
    // public receive(){
    //   this.peer.on('connection', function(conn) {
    //     conn.on('data', function(data){
    //       // Will print 'hi!'
    //       console.log("00000000000000000000000000000000 Receive msg +++++++++++++++++++++++++++");
    //       console.log(data);
    //     });
    //   });
    // }
    // switchMicrophone(){
    //   this.isMicrophoneEnabled = !this.isMicrophoneEnabled;
    //   this.stream.getAudioTracks()[0].enabled = this.isMicrophoneEnabled;
    // }

    // switchCamera(){
    //   this.isCameraEnabled = !this.isCameraEnabled;
    //   this.mediaCall.getVideoTracks()[0].enabled = this.isCameraEnabled;
    //   this.mediaCall.getVideoTracks()[0].enabled = this.isCameraEnabled;
    // }
}
