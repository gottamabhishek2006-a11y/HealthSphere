// src/pages/TelemedicinePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const TelemedicinePage = () => {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const stompRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws/signaling");
    const stompClient = Stomp.over(socket);
    stompRef.current = stompClient;

    stompClient.connect({}, () => {
      setConnected(true);
      stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        handleSignal(payload);
      });
    });

    setupWebRTC();

    return () => {
      if (stompClient) stompClient.disconnect();
      if (pcRef.current) pcRef.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const setupWebRTC = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const pc = new RTCPeerConnection();
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "candidate",
          candidate: JSON.stringify(event.candidate),
        });
      }
    };

    pcRef.current = pc;
  };

  const sendSignal = (message) => {
    if (!stompRef.current || !connected) return;
    stompRef.current.send(
      `/app/signal/${roomId}`,
      {},
      JSON.stringify(message)
    );
  };

  const handleSignal = async (msg) => {
    const pc = pcRef.current;
    if (!pc) return;
    if (msg.type === "offer") {
      await pc.setRemoteDescription(JSON.parse(msg.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendSignal({ type: "answer", sdp: JSON.stringify(answer) });
    } else if (msg.type === "answer") {
      await pc.setRemoteDescription(JSON.parse(msg.sdp));
    } else if (msg.type === "candidate") {
      const candidate = new RTCIceCandidate(JSON.parse(msg.candidate));
      await pc.addIceCandidate(candidate);
    }
  };

  const startCall = async () => {
    const pc = pcRef.current;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignal({ type: "offer", sdp: JSON.stringify(offer) });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Telemedicine Room: {roomId}</h2>
      <button onClick={startCall}>Start Call</button>
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          style={{ width: "45%", border: "1px solid #ccc" }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "45%", border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
};

export default TelemedicinePage;
