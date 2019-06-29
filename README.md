# quest-view
Oculus QuestにPCのデスクトップ画面を持ち込むUnityアセットです。  
遅延は0.3秒程度です。音声も出力されます。  
webrtc_unity_pluginを使って実装しています。(参考文献：https://github.com/mhama/WebRtcUnityPluginSample)  

映像の伝送のためにPC上で配信用のソフトウェアを実行する必要があります。
現状では、OculusQuestとPCは同一LAN内である必要があります。(本アセットと配信ソフトを改造すれば同一LAN外でも可能ですがサポート対象外とします)

Unityのバージョン 2019.1.3 と 2018.4.0 で動作確認済みです

# installation 

unity packageをインポート　  
unity の unsafe フラグを有効化  
Scenes/example 以下に利用例  

# 配信ソフトの使い方

electron.exeを実行  
画面の流れに従う  
表示されたipアドレスをScripts/Connect.csのStartConnect(string ipAddress)に何らかの方法で渡す。   
(https://github.com/shinyoshiaki/quest-rdp にバーチャルキーボードを使ってIPアドレスを入力する例を用意しています)   

 # 配布ページ 
 https://github.com/shinyoshiaki/quest-view/releases  
 quest-view.unitypackage : アセット　  
 streamer.zip : 配信用ソフト  
 
 # 利用アセット
 websocket-sharp:https://github.com/sta/websocket-sharp  
 UniRx:https://github.com/neuecc/UniRx  
 Utf8Json:https://github.com/neuecc/Utf8Json  

# The MIT License (MIT)  

Copyright (c) 2019 ShinYoshiaki
