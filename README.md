# quest-view
Oculus QuestにPCのデスクトップ画面を持ち込むアセットです。  
遅延は0.3秒程度です。音声も出力されます。  
webrtc_unity_pluginを使って実装しています。(参考文献：https://github.com/mhama/WebRtcUnityPluginSample)  

PC上で配信用のソフトウェアを実行する必要があります。

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
