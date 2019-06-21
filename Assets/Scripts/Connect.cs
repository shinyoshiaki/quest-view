using UnityEngine;
using WebRTC;
using WebSocketSharp;
using Utf8Json;
using UniRx;
using System;
public class Connect : MonoBehaviour
{
    WebSocket ws;
    Signaling signaling;
    public string roomId = "test2";

    void Start()
    {
        Observable.Timer(TimeSpan.FromSeconds(2)).Subscribe(_ => Create());
        Observable.Timer(TimeSpan.FromSeconds(2)).Subscribe(_ => Debug.Log("2秒遅れて実行"));

        Debug.Log("start");
        ws = new WebSocket("ws://127.0.0.1:8080");
        ws.Connect();
        signaling = new Signaling(roomId);
        signaling.OnConnectMethod += OnConnet;
        signaling.OnDataMethod += OnData;
        signaling.OnSdpMethod += OnSdp;

        ws.OnMessage += (_, e) =>
        {
            OnMessage(e.Data);
        };
    }

    void OnConnet(string str)
    {
        Debug.Log("connect");
        ws.Send(str);
        signaling.peer.SendDataViaDataChannel("test");
    }

    public void Send(string str)
    {
        signaling.peer.SendDataViaDataChannel(str);
    }

    void OnData(string s)
    {
        Debug.Log("data " + s);
    }

    void OnSdp(string s)
    {
        Debug.Log("sendsdp " + s);
        ws.Send(s);
    }

    class RoomJson
    {
        public string type;
        public string roomId;
    }

    public void Create()
    {
        Debug.Log("create");
        var data = new RoomJson();
        data.type = "create";
        data.roomId = roomId;
        var json = JsonSerializer.ToJsonString(data);
        ws.Send(json);

    }

    public void Join()
    {
        Debug.Log("join");
        var data = new RoomJson();
        data.type = "join";
        data.roomId = roomId;
        var json = JsonSerializer.ToJsonString(data);
        ws.Send(json);
    }


    class OnMessageS
    {
        public string type;
    }
    void OnMessage(string s)
    {
        var data = JsonSerializer.Deserialize<OnMessageS>(s);
        switch (data.type)
        {
            case "sdp":
                OnSdpData(s);
                break;
            case "join":
                OnJoin(s);
                break;
        }
    }

    void OnSdpData(string s)
    {
        signaling.SetSdp(s);
    }
    void OnJoin(string e)
    {
        Debug.Log("onjoin");
        signaling.peer.CreateOffer();
    }

}