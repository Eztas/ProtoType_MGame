// 時間は一定で、速度が速くなるとそれに応じてノードの数が多くなる
// 速度8以上で設定数最大, というかそれ未満だとそもそもノーツを出し切れない
// コンボ数がジャマに感じるのも, スマホ版だから? 横向きで, 縦画面の長さに関する情報量がないから?
// 常に画面内のノーツの量が7+-2にするように間隔を決める?

// 24offsetつき->360を90でいける, しかし25にしたとたん急に無理

// 問題点
// 参考にしないといけない者
// ->文字の大きさ, スコアの付け方, ノーツの大きさ(=ラインの幅, 縦の長さ), ノーツの落ちる速度の方程式(間隔は入力スピードに合わせてどう変化するか)

// 参考にするもの
// チュウニズム->3D奥行き式, スコア真上, コンボ真ん中(上にcombo, 下に数字), まさかの判定位置がコンボと同じ位置
// beatmania->2D式, スコア真下, 判定ラインちょい上に, 判定結果 コンボ数という形で表示
// 論文「視線追従装置を用いたリズムアクションゲームにおけるスキルの分析」
// BMS -> 既にないのかどのゲームをしてたか分からない, あと拡張子名らしく分からない
// と思ったら簡略図があった
// BMS 評価判定は画面中央ちょい下, 左右は真ん中, コンボ数なし, スコアない代わりに真下にグルーブゲージ(溜まると終了)
// pop'n music13 カーニバル これに関しては具体的な図がない
// 予備実験1 BMS -> 予備実験2 pop'n ->本実験BMS
// フロー理論を用いた音楽ゲームの要素が面白さに与える影響
// スコア左上, コンボ数真ん中, 判定結果を判定ライン真上, なおこっちは右上にも判定結果一覧を常時載せてる

// 配置とは関係ないが、フロー理論を用いた音楽ゲームの要素が面白さに与える影響では
// スコアを100万点にして, ノーツ数でそれを割り, その点を加算させていた

// 関数説明
// filter関数, 配列に繋げる 使用方法は以下のようになります。
// 配列の値を、foreachのように一つずつ関数内の式で判定していきます。
// 判定でtrueになった場合だけ、新しく用意した配列に格納されます！
// const hoge = array.filter(value => value > 3), arrayの中で、条件を満たす値だけ, hogeに格納する

// forEach関数 配列に含まれる要素を先頭から順に取り出しコールバック関数を呼び出します。
// fruit.forEach(element => console.log(element));, fruitの要素を最初からとって、elementに格納して関数に用いる

// shift関数 配列の先頭の要素を削除しつつ, 返り値にはその先頭要素を渡す

// push関数 配列の末尾に引数の要素を追加する

// devicePixelRatio
// rect.Yがrectの下の部分なのか、上なのか、はたまた真ん中なのか分からない
// best 131, good 125, poor 27, miss, 77
// 256+27=283, 283+77=360, 361になったり一個単位の誤差があるのでそこに注意
// データ手入力も面倒

// 8セット感想
// 手は痛くならない, 1分半でもいいかもしれない
// ただ急変する画面を連続して見るからか気持ち悪い   
// 間違ったものとして、反応できなかったから、打ち間違えたからがあるといいかも
// 疲労感を聞こうと思ったが連続してプレイすると疲労はたまる, 測りにくい
// プレイしづらかったかとかも思ったけど(集中というより)撃ち間違え、まあ集中か

// ゲーム終わりにcsv書き込めばいいか
// blockの出現順番, レーン, スピード
// 打鍵レーンとその時間(height), 判定結果
// clock
let startTime; // 開始時間
//yourFunction(); // 計測する処理
//const endTime = performance.now(); // 終了時間

let notesList_forCSV = [['id', 'lane', 'speed', 'judge', "hitHeight", "judgeLineTime", "JudgeLine.Y"]];
//let playData_forCSV = [['time', 'lane', 'height', 'judge', "BUTTON_TOP"]];
let playData_forCSV = [['time', 'hitlane', 'notelane', 'noteID', 'height', "BUTTON_TOP", 'judge']];

//console.log(endTime - startTime); // 何ミリ秒かかったかを表示する

// 4.7 : 24.8 lab-PC
// 2.6 : 13.9 ノートPC
// 大体 5.3倍
// 大体ボタンは0.16倍
// public float HitPosition = (480 - 402) * POSITION_SCALE_FACTOR;
//const BUTTONS_HEIGHT = 180;  // デフォルト 50, HitPosition 402, ノートPC-150, lab-PC180
//const BUTTONS_HEIGHT = window.innerHeight * 0.16;
//const BUTTONS_TOP = window.innerHeight - BUTTONS_HEIGHT; // デフォルト 400
//const BUTTONS_TOP = 480; // 全然ちゃうやんけ
// Commands that are asking where to position something horizontally are based on a height of 480 pixels.
// 水平方向の位置を尋ねるコマンドは、高さ480ピクセルを基準にしている。

//innerHeight は Window インターフェイスの読み取り専用プロパティで、ウィンドウの内部の高さをピクセル単位で返します。
const LANE_WIDTH = 59; // ノートPC-59で4本4.45cmくらいやった, lab-PC-64くらい(白線が思うより太い)
// デフォルト70, 45は目分量でosu!lazerと同じ幅だった, osuは30らしい, columnWidth, でも30だと流石に狭すぎる
// 45でも測ったらあれやった, 定規で見たら4.45cmくらい(外線抜けば4.1cm)
//const DEFAULT_LEFT = 600;window.innerWidth
const DEFAULT_LEFT = window.innerWidth/2 - 2*LANE_WIDTH // columnstart 136
//const LANE_LEFTS = [10, 100, 190, 280];
const LANE_LEFTS = [DEFAULT_LEFT, DEFAULT_LEFT+LANE_WIDTH, DEFAULT_LEFT+2*LANE_WIDTH, DEFAULT_LEFT+3*LANE_WIDTH];
//const CANVAS_WIDTH = 360;
const CANVAS_WIDTH = DEFAULT_LEFT+4*LANE_WIDTH;
//const CANVAS_HEIGHT = window.innerHeight; // デフォルト 540, window.innerHeightで出来たら良さそう
const CANVAS_HEIGHT = window.outerHeight + 24; // 25以上でスクロールバー出る(ノーパソ)

const BLOCK_HEIGHT = 17;
const BUTTONS_HEIGHT = CANVAS_HEIGHT * 0.16 - BLOCK_HEIGHT/2; // 元の高さからブロックの半分だけ下にして, 中心感も再現
const BUTTONS_TOP = CANVAS_HEIGHT - BUTTONS_HEIGHT; // デフォルト 400

// 落ちてくるブロックの当たり判定のある部分の高さ,50, osuを真似てみた
// 10にしてたが、「ノートパソコンだと」定規で測って約3mm(=約17px辺りと判断)
// lab-PC 20px(0.6cm), 19px(0.55cm)

// 落ちてくるブロックの当たり判定のある部分のY座標の最小値(上側)と最大値(下側)
// ここを調節したら判定幅は容易に変わる
//const HIT_Y_MIN = BUTTONS_TOP - BLOCK_HEIGHT;
//const HIT_Y_MAX = BUTTONS_TOP + BLOCK_HEIGHT;
var BEST_Y_MIN;
var BEST_Y_MAX;
var GOOD_Y_MIN;
var GOOD_Y_MAX;
var MISS_Y_MIN;
var MISS_Y_MAX;

// $使うとjQueryに使えるらしい、でもまあ使わなくてもいけそうやし、いらなさそう
const start = document.getElementById('start');
const zero = document.getElementById('zero');
const one = document.getElementById('one');
const two = document.getElementById('two');
const three = document.getElementById('three');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
/*
const okSound = new Audio('./ok.wav');
const missSound = new Audio('./miss.mp3');
const bgm = new Audio('./bgm.mp3');

const drumrollSound1 = new Audio('./drumroll1.mp3');
const drumrollSound2 = new Audio('./drumroll2.mp3');
*/

let blocks = [];
//const bestLaneNumbers = [];
//const goodLaneNumbers = [];
//const missLaneNumbers = [];
//const poorLaneNumbers = [];

let isPlaying = false;
let speed = 3;
let bestCount = 0;
let goodCount = 0;
let missCount = 0;
let poorCount = 0;
let comboCount = 0;
let maxComboCount = 0;

const frameRate = 100; // フレームレート変わるとノーツの間隔が変わるの忘れてた
//const frameRate = 60; // 1秒間(1000ms間)にノーツをspeed分だけ移動させる回数
// なぜか改めて60にしたらがくがくしてる

//const playTime = 50; // 秒(実際は, 1000をかけて用いる)
const playTime = 90; 
// 90sはやはりしんどそう, 7戦目途中で切れた, 6戦目から疲労感(3戦目からわずかに)
// やはり大体長いverだと50~70sくらい
const ALL_NOTES = playTime*5; // 360, デフォルト 600, 1秒5ノーツ
const offsetTime = 300; // 0.7秒じゃ早すぎる
const baseSpeed = (frameRate*playTime)/ALL_NOTES; 
// 1秒間にframeRate回setIntervalはかつそれをplayTime秒だけ行うので
// それをALL_NOTES分で割ると…分からん!!
//const baseSpeed = (100*playTime)/ALL_NOTES; // ノーツを落とすスピード(ノーツ間の間隔)のベース, 元は80
// 2つとも60*speed, 0.01*60=0.6秒後に全員スタート
// 24でoffsetつき360だと、90で終わるけど、早すぎる気もする, ただどんなスピードでも行ける
// 19でoffsetつき450だと、90で終わるけど、早すぎる気もする, ただどんなスピードでも行ける
//let resultText = '';

/*
function initVolumes(initValue){
    const $elemVolume = document.getElementById("volume");
    const $elemRange = document.getElementById("vol-range");

    $elemVolume.addEventListener('change', () => setVolume($elemVolume.value));

    setVolume(initValue);

    function setVolume(value){
        $elemVolume.value = value;
        $elemRange.textContent = value;

        //bgm.volume = value;
        //okSound.volume = value;
        //missSound.volume = value;
    }
}
*/
const isKeysHit = [false, false, false, false];
document.onkeydown = (ev) => {
    if(ev.code == 'KeyD'){
        playData_forCSV.push([performance.now().toPrecision(4)-startTime, 0, "", "", "", BUTTONS_TOP, "NONE"]);
        onKeyHit(0);
    }
    if(ev.code == 'KeyF'){
        playData_forCSV.push([performance.now().toPrecision(4)-startTime, 1, "", "", "", BUTTONS_TOP, "NONE"]);
        onKeyHit(1);
    }
    if(ev.code == 'KeyJ'){
        playData_forCSV.push([performance.now().toPrecision(4)-startTime, 2, "", "", "", BUTTONS_TOP, "NONE"]);
        onKeyHit(2);
    }
    if(ev.code == 'KeyK'){
        playData_forCSV.push([performance.now().toPrecision(4)-startTime, 3, "", "", "", BUTTONS_TOP, "NONE"]);
        onKeyHit(3);
    }
   /*
    if(ev.code == 'KeyD')
        onKeyHit(0)
    if(ev.code == 'KeyF')
        onKeyHit(1)
    if(ev.code == 'KeyJ')
        onKeyHit(2)
    if(ev.code == 'KeyK')
        onKeyHit(3)
    */
    /*
    if(ev.code == 'KeyF'){
        playData_forCSV.push([performance.now().toPrecision(4)-startTime, 0, "", "", "", BUTTONS_TOP, "NONE"]);
        onKeyHit(0);
    }
    if(ev.code == 'KeyG'){
        playData_forCSV.push([performance.now().toPrecision(4)-startTime, 1, "", "", "", BUTTONS_TOP, "NONE"]);
        onKeyHit(1);
    }
    if(ev.code == 'KeyK'){
        playData_forCSV.push([performance.now().toPrecision(4)-startTime, 2, "", "", "", BUTTONS_TOP, "NONE"]);
        onKeyHit(2);
    }
    if(ev.code == 'KeyL'){
        playData_forCSV.push([performance.now().toPrecision(4)-startTime, 3, "", "", "", BUTTONS_TOP, "NONE"]);
        onKeyHit(3);
    }
    */
}
// おしっぱで対応されることを防ぐ
// 長押しだとずっとmissでいけてしまう
document.onkeyup = (ev) => {
    if(ev.code == 'KeyD')
        isKeysHit[0] = false;
    if(ev.code == 'KeyF')
        isKeysHit[1] = false;
    if(ev.code == 'KeyJ')
        isKeysHit[2] = false;
    if(ev.code == 'KeyK')
        isKeysHit[3] = false;
    /*
    if(ev.code == 'KeyF')
        isKeysHit[0] = false;
    if(ev.code == 'KeyG')
        isKeysHit[1] = false;
    if(ev.code == 'KeyK')
        isKeysHit[2] = false;
    if(ev.code == 'KeyL')
        isKeysHit[3] = false;
    */
}

function onKeyHit(index){
	if(!isPlaying || isKeysHit[index])
		return;

	isKeysHit[index] = true;
    // レーン押しミスに対しては対応していないので注意

	//const hits = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && GOOD_Y_MIN <= rect.Y && rect.Y <= GOOD_Y_MAX);
    //const miss_list = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && GOOD_Y_MIN > rect.Y && rect.Y > GOOD_Y_MAX && MISS_Y_MIN <= rect.Y && rect.Y <= MISS_Y_MAX);

    //判定範囲上部はノーツ下部が触れた時, 判定範囲下部はノーツ上部が触れた時の仕様になってない
    // でもノーツのオブジェクトを中心から形を形成させたので, this.Yでいい(中心線だけで判断)
    //const miss_list = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && MISS_Y_MIN <= rect.Y && rect.Y <= MISS_Y_MAX);
    //const good_list = miss_list.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && GOOD_Y_MIN <= rect.Y && rect.Y <= GOOD_Y_MAX);
    //const best_list = good_list.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && BEST_Y_MIN <= rect.Y && rect.Y <= BEST_Y_MAX);

    //判定範囲上部はノーツ下部が触れた時, 判定範囲下部はノーツ上部が触れた時の仕様にした
    // しかしこれだとほぼgoodに入っているのに, 下だけがbestに当たっているからbestなんてこともあり,
    // やはりこれは直感に反する
    //const miss_list = blocks.filter(rect => !rect.IsHit && (rect.X == LANE_LEFTS[index]) && (MISS_Y_MIN <= (rect.Y+BLOCK_HEIGHT)) && (rect.Y <= MISS_Y_MAX));
    //const good_list = miss_list.filter(rect => !rect.IsHit && (rect.X == LANE_LEFTS[index]) && (GOOD_Y_MIN <= (rect.Y+BLOCK_HEIGHT)) && (rect.Y <= GOOD_Y_MAX));
    //const best_list = good_list.filter(rect => !rect.IsHit && (rect.X == LANE_LEFTS[index]) && (BEST_Y_MIN <= (rect.Y+BLOCK_HEIGHT)) && (rect.Y <= BEST_Y_MAX));
    // good_listにはキーを叩いた時にある範囲内にあるノーツのみが選ばれて格納されている
    //playData_forCSV.push([performance.now().toPrecision(4)-startTime, index, "", "", "", BUTTONS_TOP, "NONE"]);
    // あるキーが叩かれた時
    // BEST, GOODを含むMISSの範囲にあるブロック(ノーツのリスト)を得る
    // MISSの範囲にあるブロックの中で, MISSではなく, BEST, GOODの範囲のみにあるブロックを得る
    // GOODの範囲にあるブロックの中で, GOODではなく, BESTの範囲のみにあるブロックを得る
    // MISSリストの長さが1以上でBEST, GOODリストが空->MISSにノーツ有
    // GOODリストの長さが1以上でBESTリストが空->GOODにノーツ有
    // BESTリストの長さが1以上->BESTにノーツ有
    // 一番先(より早く生成された方の)ノーツを優先して判定を決める

    // missリストの中で見る
    // 一番若いIDの判定から優先する
    // 前のは試していないが、miss下とbestにあると先にbest判定だったが
    // miss下の方が先にあるのでそちらの判定から優先させる
    // 一度missの範囲を叩くべき範囲とする
    const hit_list = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && MISS_Y_MIN <= rect.Y && rect.Y <= MISS_Y_MAX);

    if(hit_list.length > 0){
        hit_list[0].IsHit = true;
        playData_forCSV[playData_forCSV.length - 1][2] = hit_list[0].LaneNumber;
        playData_forCSV[playData_forCSV.length - 1][3] = hit_list[0].noteID;
        playData_forCSV[playData_forCSV.length - 1][4] = hit_list[0].Y;
        notesList_forCSV[(hit_list[0].noteID)+1][4] = hit_list[0].Y;

        // MISSの範囲かつBESTの範囲にある時
        if(BEST_Y_MIN <= hit_list[0].Y && hit_list[0].Y <= BEST_Y_MAX){
            playData_forCSV[playData_forCSV.length - 1][6] = "BEST";
            notesList_forCSV[(hit_list[0].noteID)+1][3] = "BEST";
            onBest();
        }
        // MISSの範囲かつBEST範囲外であってGOODの範囲にある時
        else if(GOOD_Y_MIN <= hit_list[0].Y && hit_list[0].Y <= GOOD_Y_MAX){
            playData_forCSV[playData_forCSV.length - 1][6] = "GOOD";
            notesList_forCSV[(hit_list[0].noteID)+1][3] = "GOOD";
            onGood();
        }
        // MISSの範囲かつBESTでもGOODの範囲でもない時
        else{
            playData_forCSV[playData_forCSV.length - 1][6] = "MISS";
            notesList_forCSV[(hit_list[0].noteID)+1][3] = "MISS";
            onMiss();
        }
    }
    //isKeysHit[index] = false;

    /*
    if(miss_list.length > 0){
        if(good_list.length > 0){
            // best範囲にノーツがある時
            if(best_list.length > 0){
                best_list[0].IsHit = true;
                playData_forCSV[playData_forCSV.length - 1][2] = best_list[0].LaneNumber;
                playData_forCSV[playData_forCSV.length - 1][3] = best_list[0].noteID;
                playData_forCSV[playData_forCSV.length - 1][4] = best_list[0].Y;
                playData_forCSV[playData_forCSV.length - 1][6] = "BEST";
                notesList_forCSV[(best_list[0].noteID)+1][3] = "BEST";
                onBest();
            }
            // best範囲になくてgood範囲のみにノーツがある時
            else{
                good_list[0].IsHit = true;
                playData_forCSV[playData_forCSV.length - 1][2] = good_list[0].LaneNumber;
                playData_forCSV[playData_forCSV.length - 1][3] = good_list[0].noteID;
                playData_forCSV[playData_forCSV.length - 1][4] = good_list[0].Y;
                playData_forCSV[playData_forCSV.length - 1][6] = "GOOD";
                notesList_forCSV[(good_list[0].noteID)+1][3] = "GOOD";
                onGood();
            }
        }
        // goodの範囲になくてmissの範囲にある時
        else{
            //good_list[0].IsHit = true; // 成功はしてないがHit数にカウントはさせない
            miss_list[0].IsHit = true;
            playData_forCSV[playData_forCSV.length - 1][2] = miss_list[0].LaneNumber;
            playData_forCSV[playData_forCSV.length - 1][3] = miss_list[0].noteID;
            playData_forCSV[playData_forCSV.length - 1][4] = miss_list[0].Y;
            playData_forCSV[playData_forCSV.length - 1][6] = "MISS";
            notesList_forCSV[(miss_list[0].noteID)+1][3] = "MISS";
            onMiss();
        }
    }
    */
    //isKeysHit[index] = false;
    /*
	if(hits.length > 0){
		hits[0].IsHit = true;
		onGood(index);
	}
    else if(miss_list.length > 0){
        hits[0].IsHit = true; // 成功はしてないがHit数にカウントはさせない
		onMiss(index);
    }
    */
    /*
	else{
		onMiss(index);
    }
    */

}

/*
function playSound(){
    //okSound.currentTime = 0;
    //okSound.play();
}
*/

function clearCanvas(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawLanes(){
    //ctx.strokeStyle = '#ccc';
    ctx.strokeStyle = '#fff';
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.strokeRect(LANE_LEFTS[i], 0, LANE_WIDTH, canvas.height);

    /*
    ctx.fillStyle = '#f00';
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.fillRect(LANE_LEFTS[i], BUTTONS_TOP - 4*5, LANE_WIDTH, 4*5);
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.fillRect(LANE_LEFTS[i], BUTTONS_TOP, LANE_WIDTH, 4*5);
    ctx.fillStyle = '#0f0';
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.fillRect(LANE_LEFTS[i], BUTTONS_TOP - 4*9, LANE_WIDTH, 4*4);
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.fillRect(LANE_LEFTS[i], BUTTONS_TOP + 4*5, LANE_WIDTH, 4*4);
    ctx.fillStyle = '#00f';
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.fillRect(LANE_LEFTS[i], BUTTONS_TOP - 4*13, LANE_WIDTH, 4*4);
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.fillRect(LANE_LEFTS[i], BUTTONS_TOP + 4*9, LANE_WIDTH, 4*4);
    */
}

// 1000/60msに一回, 
/*
function drawBest(laneNum){
    //ctx.fillStyle = '#fff';
    //ctx.fillStyle = '#000';
    //ctx.font = '20px bold MS ゴシック';
    //const textWidth = ctx.measureText('Hit').width;
    //ctx.fillText('HIT', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, GOOD_Y_MAX + 10); // 元のコード
    //ctx.fillText('', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, GOOD_Y_MAX - 105); // これつけても判定の重複が消えない
    //ctx.fillText('    ', LANE_LEFTS[1] + 50, GOOD_Y_MAX - 105);
    //ctx.fillStyle = '#fff';
    //ctx.fillText('HIT', LANE_LEFTS[1] + 50, GOOD_Y_MAX - 105); // 雰囲気判定ライン手前の判定
    document.getElementById("judge_result").textContent='BEST';
}
*/

/*
function drawGood(laneNum){
    //ctx.fillStyle = '#fff';
    //ctx.fillStyle = '#000';
    //ctx.font = '20px bold MS ゴシック';
    //const textWidth = ctx.measureText('Hit').width;
    //ctx.fillText('HIT', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, GOOD_Y_MAX + 10); // 元のコード
    //ctx.fillText('', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, GOOD_Y_MAX - 105); // これつけても判定の重複が消えない
    //ctx.fillText('    ', LANE_LEFTS[1] + 50, GOOD_Y_MAX - 105);
    //ctx.fillStyle = '#fff';
    //ctx.fillText('HIT', LANE_LEFTS[1] + 50, GOOD_Y_MAX - 105); // 雰囲気判定ライン手前の判定
    document.getElementById("judge_result").textContent='GOOD';
}
*/

/*
function drawMiss(laneNum){
    //ctx.fillStyle = '#fff';
    //ctx.fillStyle = '#000';
    //ctx.font = '20px bold MS ゴシック';
    //const textWidth = ctx.measureText('Miss').width;
    //ctx.fillText('Miss', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, GOOD_Y_MAX + 50); // 元のコード
    //ctx.fillText('    ', LANE_LEFTS[1] + 50, GOOD_Y_MAX - 105);
    //ctx.fillStyle = '#fff';
    //ctx.fillText('Miss', LANE_LEFTS[1] + 50, GOOD_Y_MAX - 105); // 雰囲気判定ライン手前の判定
    document.getElementById("judge_result").textContent='MISS';
}
*/

/*
function drawPoor(laneNum){
    //ctx.fillStyle = '#fff';
    //ctx.fillStyle = '#000';
    //ctx.font = '20px bold MS ゴシック';
    //const textWidth = ctx.measureText('Thro').width; // Thro
    //ctx.fillText('Thro', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, GOOD_Y_MAX + 30); // 元のコード
    //ctx.fillText('', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, GOOD_Y_MAX - 105);
    //ctx.fillText('    ', LANE_LEFTS[1] + 50, GOOD_Y_MAX - 105);
    //ctx.fillStyle = '#fff';
    //ctx.fillText('Thro', LANE_LEFTS[1] + 50,  GOOD_Y_MAX - 105);
    document.getElementById("judge_result").textContent='POOR';
}
*/

//function onBest(laneNum){
function onBest(){
    document.getElementById("judge_result").textContent='BEST';
    bestCount++;
    //document.getElementById("score_result").textContent = String(1000 * bestCount + 500 * goodCount - 0*missCount - 100*poorCount).padStart(6, '0');
    comboCount++;
    document.getElementById("combo_result").textContent = String(comboCount).padStart(4, '0');
    if(comboCount > maxComboCount){
        maxComboCount = comboCount;
    }
    //okSound.currentTime = 0;
    //okSound.play();
    /*
    bestLaneNumbers.push(laneNum);
    setTimeout(() => {
        bestLaneNumbers.shift();
    }, 500);
    */
}

//function onGood(laneNum){
function onGood(){
    document.getElementById("judge_result").textContent='GOOD';
    goodCount++;
    //document.getElementById("score_result").textContent = String(1000 * bestCount + 100 * goodCount - 0*missCount - 500*poorCount).padStart(6, '0');
    comboCount++;
    document.getElementById("combo_result").textContent = String(comboCount).padStart(4, '0');
    if(comboCount > maxComboCount){
        maxComboCount = comboCount;
    }
    //okSound.currentTime = 0;
    //okSound.play();
    /*
    goodLaneNumbers.push(laneNum);
    setTimeout(() => {
        goodLaneNumbers.shift();
    }, 500);
    */
}

//function onMiss(laneNum){
function onMiss(){
    document.getElementById("judge_result").textContent='MISS';
    missCount++;
    //document.getElementById("score_result").textContent = String(1000 * bestCount + 500 * goodCount - 0*missCount - 100*poorCount).padStart(6, '0');
    comboCount=0;
    document.getElementById("combo_result").textContent = String(comboCount).padStart(4, '0');
    //missSound.currentTime = 0;
    //missSound.play();
    /*
    missLaneNumbers.push(laneNum);
    setTimeout(() => {
        missLaneNumbers.shift();
    }, 500);
    */
}

//function onPoor(laneNum){
function onPoor(){
    document.getElementById("judge_result").textContent='POOR';
	poorCount++;
    //document.getElementById("score_result").textContent = String(1000 * bestCount + 500 * goodCount - 0*missCount - 100*poorCount).padStart(6, '0');
    comboCount = 0;
    document.getElementById("combo_result").textContent = String(comboCount).padStart(4, '0');
    /*
    poorLaneNumbers.push(laneNum);
    setTimeout(() => {
        poorLaneNumbers.shift();
    }, 500);
    */
}

class Block{
    // スピードに応じた間隔を空けているのになぜ低速ではノーツが来ないのか
    // Y=0スタートのため、Y=500くらいのボタンを押す箇所に最初のノーツがたどり着くタイミングが違うから
    // 0から500にたどり着くまでspeed8の最初のノーツがspeed2のノーツよりも違う
    // つまり等間隔のオフセットも必要
    // 遅いほどY=500に近く、速いほどY=500から遠いオフセットがいる
    constructor(laneNum, delay, distanceForSpeed){
        this.LaneNumber = laneNum;
        this.noteID = delay;
        this.X = LANE_LEFTS[laneNum];
        //this.Y = - baseSpeed * distanceForSpeed * delay; // 実はずっと裏で生成済みになっている, 高さが増えることで目に見える
        // this.Y = - 80 * delay
        this.Y = -(baseSpeed * distanceForSpeed * delay) - offsetTime*distanceForSpeed + BUTTONS_TOP;
        this.Width = LANE_WIDTH;
        this.Height = BLOCK_HEIGHT;
        this.IsHit = false; // まだ叩かれてない, best, good, missのいずれの判定もない
        this.IsPoor = false; // スルーされたノーツに関するフラグ
        notesList_forCSV.push([delay, laneNum, distanceForSpeed]);
        //this.judgetime = 0;
    }

    // ヒットされていないのにGOOD_Y_MAXより下に落ちてきたら見逃しと判断する
    // onkeyhitとaddeventlistenerの2者でtrueにされる
    Update(){
        //if(!this.IsHit && !this.IsPoor && this.Y > GOOD_Y_MAX){
        if(!this.IsHit && !this.IsPoor && this.Y > MISS_Y_MAX){ // Missの範囲も超えて初めてスルー
            this.IsPoor = true;
            notesList_forCSV[this.noteID+1][3] = "POOR";
			onPoor();
        }
        if(this.Y <= BUTTONS_TOP+1){ // <=はいけて、==だとなぜか消える, でも705.6あるんよな
            notesList_forCSV[this.noteID+1][5] = performance.now().toPrecision(4) - startTime;
            notesList_forCSV[this.noteID+1][6] = this.Y;
        }
        // 入力時以外speedここだけ
        /*
        if(BEST_Y_MAX < this.Y && this.Y <= GOOD_Y_MAX){ // <=はいけて、==だとなぜか消える, でも705.6あるんよな
            //notesList_forCSV[this.noteID+1][4] = performance.now().toPrecision(4) - startTime;
            //notesList_forCSV[this.noteID+1][5] = this.Y;
            this.IsHit = true;
            onBest();
        }
        */
        this.Y += speed; // 多分speedの分だけ更新しながらYが増える->つまり高度が落ちる->ノーツが落ちる
    }

    Draw(){
        if(!this.IsHit){
            ctx.fillStyle = '#fff';
        }
        else{
            ctx.fillStyle = '#000';
        }
        //ctx.fillRect(this.X, this.Y + 20, this.Width, this.Height - 40); // 公式の謎のおもんぱかりが
        //ctx.fillRect(this.X, this.Y, this.Width, this.Height);
        ctx.fillRect(this.X, (this.Y - (this.Height/2)), this.Width, this.Height);
        // widthはleftから右に出る, 負の数ならleftから左に図が出る
        // おそらくheightは
        //x 矩形の開始位置の X 座標です。
        //y 矩形の開始位置の Y 座標です。
        //width 矩形の幅です。正の数であれば右方向、負の数であれば左方向です。
        //height 矩形の高さです。正の数であれば下方向、負の数であれば上方向です。
    }
}

/*
window.onload = () => {
    //document.documentElement.requestFullscreen();
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

	clearCanvas();
	drawLanes();

	setPositionButtons();
	addEventListeners();
	//initVolumes(0.5);
}
*/
document.getElementById('get_full_screen').addEventListener('click', (ev) => {
    document.documentElement.requestFullscreen();
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    document.getElementById('get_full_screen').style.display = "none";
    clearCanvas();
    drawLanes();

    setPositionButtons();
    addEventListeners();
});

function setPositionButtons(){
    const buttons = [zero, one, two, three];
	for(let i = 0; i < buttons.length; i++){
		buttons[i].style.left = LANE_LEFTS[i] + 'px';
		buttons[i].style.top = BUTTONS_TOP + 'px';
		buttons[i].style.width = LANE_WIDTH + 'px';
		buttons[i].style.height = BUTTONS_HEIGHT + 'px';
    }
}

// window読み込み時に起動
// ゲーム開始時のボタン押下に対するイベントリスナと, レーン押下に対するイベントリスナ
// これはキーリスナではなくてボタンを直に押した時のリスナー
// キーボードのみで完結させるなら必要ない
function addEventListeners(){
    // 最初の起動
	start.addEventListener('click', (ev) => {
        //document.documentElement.requestFullscreen();
        ev.preventDefault();
        gameStart();
    });

	const buttons = [zero, one, two, three];
    const events = ['mousedown', 'touchstart'];

    for(let i = 0; i < LANE_LEFTS.length; i++){
        for(let k = 0; k < events.length; k++){
            // 各ボタンのaddEventListener
            buttons[i].addEventListener(events[k], (ev) => {
                ev.preventDefault(); // ある種ボタン同時押しは許されない?

                if(!isPlaying){
                    return;
                }

                const hit_list = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && MISS_Y_MIN <= rect.Y && rect.Y <= MISS_Y_MAX);

                if(hit_list.length > 0){
                    hit_list[0].IsHit = true;
                    //playData_forCSV[playData_forCSV.length - 1][2] = hit_list[0].LaneNumber;
                    playData_forCSV[playData_forCSV.length - 1][3] = hit_list[0].noteID;
                    playData_forCSV[playData_forCSV.length - 1][4] = hit_list[0].Y;
            
                    // MISSの範囲かつBESTの範囲にある時
                    if(BEST_Y_MIN <= hit_list[0].Y && hit_list[0].Y <= BEST_Y_MAX){
                        playData_forCSV[playData_forCSV.length - 1][6] = "BEST";
                        notesList_forCSV[(hit_list[0].noteID)+1][3] = "BEST";
                        onBest();
                    }
                    // MISSの範囲かつBEST範囲外であってGOODの範囲にある時
                    else if(GOOD_Y_MIN <= hit_list[0].Y && hit_list[0].Y <= GOOD_Y_MAX){
                        playData_forCSV[playData_forCSV.length - 1][6] = "GOOD";
                        notesList_forCSV[(hit_list[0].noteID)+1][3] = "GOOD";
                        onGood();
                    }
                    // MISSの範囲かつBESTでもGOODの範囲でもない時
                    else{
                        playData_forCSV[playData_forCSV.length - 1][6] = "MISS";
                        notesList_forCSV[(hit_list[0].noteID)+1][3] = "MISS";
                        onMiss();
                    }
                }
                /*
                // hit済みのノーツをもう一度ヒットさせないための、!rect.IsHit
                // ボタンを押した時に, 判定幅にまだヒット判定のないノーツがあるかを確認
                if(hits.length > 0){
					hits[0].IsHit = true; // hitしてたらtrueにして過剰ヒットを防ぐ
                    onGood(i);
				}
                // Missの範囲を設けないと意味がない感
                else{
                    onMiss(i);
                }
                */
            });
        }
    }
}

/*
タイマー処理の部分を示します。
現在プレイ中でない場合は何もしません。
更新時はブロックの落下速度を少しずつ上げていきます -> 取り除きました
スコア表示もここで
*/
/*指定した関数またはコードを実行する前にタイマーが待つべき時間をミリ秒 (1/1000 秒) 単位で指定します。 */
setInterval(() => {
    if(!isPlaying)
        return;

    //if(speed < 5) speed += 0.005; // 落下速度可変要素の削除

	clearCanvas(); // 毎10m秒消されてるから, 赤いラインとか残したくても残らなかった
	drawLanes();
    // 1回ノーツを書くと消すことができない
    // clearしないと残り続けることになる
    // だから毎度消す->書き直す->書き直す際に座標位置がずれてることを利用する

    blocks.forEach(block => block.Update()); // blocksの中のblockを1つずつ取り出し、個々で更新する
    blocks.forEach(block => block.Draw());

    /*
    bestLaneNumbers.forEach(num => drawBest(num));
    goodLaneNumbers.forEach(num => drawGood(num));
    poorLaneNumbers.forEach(num => drawPoor(num));
    missLaneNumbers.forEach(num => drawMiss(num));
    */

    //ctx.font = '30px bold MS ゴシック';
    //ctx.textBaseline = 'top';
    //ctx.fillStyle = '#fff';
    //ctx.fillText(`Hit  ${goodCount}    poor  ${poorCount}    Miss  ${missCount}`, 10, 10);
    //ctx.fillText(`Combo`, LANE_LEFTS[1] + 50, canvas.height/2 - 80);
    //ctx.fillText(`${comboCount}`, LANE_LEFTS[1] + 50, canvas.height/2 - 60); // コンボ数を真ん中に表示
    //ctx.fillText(`Score`, LANE_LEFTS[1] + 50, 10); // スコアを画面上に表示
    //ctx.fillText(`${10000 * goodCount}`, LANE_LEFTS[1] + 50, 30);
    //document.getElementById("score_result").innerText = "Score\n"+String(10000 * goodCount - 1000*missCount);
    //document.getElementById("combo_result").innerText = "Combo\n"+String(comboCount);
    //document.getElementById("combo_result").textContent = String(comboCount) + "x";
    //document.getElementById("score_result").textContent = String(1000 * bestCount + 500 * goodCount - 0*missCount - 100*poorCount).padStart(8, '0');
    //document.getElementById("score_result").textContent = String(1000 * bestCount + 500 * goodCount - 0*missCount - 100*poorCount).padStart(6, '0');
    //document.getElementById("combo_result").textContent = String(comboCount).padStart(4, '0');
//}, 1000 / 60); // 元々60fpsってことか
}, 1000 / frameRate);

function gameStart(){

    speed = parseFloat(document.getElementById("speed").value); // なんかvalueでも事故る
    document.body.classList.add("cursor-hide");
    document.getElementById("speed").style.display = 'none';
    /*
    if(!(document.getElementById('check_score').checked)){
        document.getElementById("score_result").style.display = 'none';
    }
    */
    if(!(document.getElementById('check_combo').checked)){
        document.getElementById("combo_result").style.display = 'none';
    }
    if(!(document.getElementById('check_judge').checked)){
        document.getElementById("judge_result").style.display = 'none';
    }
    document.getElementById("check_group").style.display = 'none';
    blocks.length = 0;

    // osu!mania perfect=16, great 64 - 3×OD, good 97 - 3×OD
    // ok 127 - 3×OD, meh 151-3×OD, miss 188- 3×OD

    // 1000/100, 10msごとの場合
    BEST_Y_MIN = BUTTONS_TOP - speed*5; // best上側範囲, 10msに1回setInterval
    BEST_Y_MAX = BUTTONS_TOP + speed*5; // best下側範囲, 10msに1回setInterval
    GOOD_Y_MIN = BUTTONS_TOP - speed*9; // good上側範囲, 10msに1回setInterval
    GOOD_Y_MAX = BUTTONS_TOP + speed*9; // good下側範囲, 10msに1回setInterval
    MISS_Y_MIN = BUTTONS_TOP - speed*13; // miss上側範囲, 10msに1回setInterval
    MISS_Y_MAX = BUTTONS_TOP + speed*13; // miss下側範囲, 10msに1回setInterval
    /*
    BEST_Y_MIN = BUTTONS_TOP - speed*4; // best上側範囲, 10msに1回setInterval
    BEST_Y_MAX = BUTTONS_TOP + speed*4; // best下側範囲, 10msに1回setInterval
    GOOD_Y_MIN = BUTTONS_TOP - speed*8; // good上側範囲, 10msに1回setInterval
    GOOD_Y_MAX = BUTTONS_TOP + speed*8; // good下側範囲, 10msに1回setInterval
    MISS_Y_MIN = BUTTONS_TOP - speed*13; // miss上側範囲, 10msに1回setInterval
    MISS_Y_MAX = BUTTONS_TOP + speed*13; // miss下側範囲, 10msに1回setInterval
    */

    // BMS, Just Great 2/60フレーム, Great1フレーム, Good1+3フレーム, Bad1+3+2フレーム
    // 1フレーム=1000/60ms
    // 2/60フレーム = 2 / 60 * 1000/60 = 2000/3600 ms
    /*
    BEST_Y_MIN = BUTTONS_TOP - speed*1; // best上側範囲, 1000/60=50/3msに1回setInterval
    BEST_Y_MAX = BUTTONS_TOP + speed*1; // best下側範囲, 1000/60=50/3msに1回setInterval
    GOOD_Y_MIN = BUTTONS_TOP - speed*4; // good上側範囲, 1000/60=50/3msに1回setInterval
    GOOD_Y_MAX = BUTTONS_TOP + speed*4; // good下側範囲, 1000/60=50/3msに1回setInterval
    MISS_Y_MIN = BUTTONS_TOP - speed*6; // miss上側範囲, 1000/60=50/3msに1回setInterval
    MISS_Y_MAX = BUTTONS_TOP + speed*6; // miss下側範囲, 1000/60=50/3msに1回setInterval
    */

    // 本質としては3/5倍してる
    // 1000/60, 16.7ms(=1フレーム)ごとの場合, フロー論文側
    /*
    BEST_Y_MIN = BUTTONS_TOP - speed*3; // best上側範囲, 1000/60=50/3msに1回setInterval
    BEST_Y_MAX = BUTTONS_TOP + speed*3; // best下側範囲, 1000/60=50/3msに1回setInterval
    GOOD_Y_MIN = BUTTONS_TOP - speed*(27/5); // good上側範囲, 1000/60=50/3msに1回setInterval
    GOOD_Y_MAX = BUTTONS_TOP + speed*(27/5); // good下側範囲, 1000/60=50/3msに1回setInterval
    MISS_Y_MIN = BUTTONS_TOP - speed*(39/5); // miss上側範囲, 1000/60=50/3msに1回setInterval
    MISS_Y_MAX = BUTTONS_TOP + speed*(39/5); // miss下側範囲, 1000/60=50/3msに1回setInterval
    */
    /*
    ctx.fillStyle = '#f00';
    ctx.strokeRect(LANE_LEFTS[0], MISS_Y_MIN, LANE_WIDTH*4, GOOD_Y_MIN - MISS_Y_MIN);
    */

    //document.getElementById("score_result").style.left = DEFAULT_LEFT+2*LANE_WIDTH - 10 + 'px'; // スコア結果の左の位置を決定
    //document.getElementById("score_result").style.left = DEFAULT_LEFT+LANE_WIDTH+10 + 'px'; // osu!参考
    //document.getElementById("score_result").style.left = DEFAULT_LEFT+7 + 'px'; // osu!参考
    //document.getElementById("score_result").style.top = 0 + 'px'; // スコア結果の上の位置を決定
    //document.getElementById("combo_result").style.left = DEFAULT_LEFT+2*LANE_WIDTH - 10 + 'px'; // コンボ結果の左の位置を決定
    document.getElementById("combo_result").style.left = DEFAULT_LEFT+LANE_WIDTH+7 + 'px'; // osu! 参考
    document.getElementById("combo_result").style.top = (CANVAS_HEIGHT - BUTTONS_HEIGHT)/2 + 'px'; // コンボ結果の上の位置を決定
    // document.getElementById("combo_result").style.top = (window.innerHeight - BUTTONS_HEIGHT)/2 + 'px'; // コンボ結果の上の位置を決定
    //document.getElementById("judge_result").style.left = DEFAULT_LEFT+2*LANE_WIDTH - 10 + 'px'; // 判定結果の左の位置を決定
    document.getElementById("judge_result").style.left = DEFAULT_LEFT+LANE_WIDTH+10 + 'px'; // 判定結果の左の位置を決定
    document.getElementById("judge_result").style.top = BUTTONS_TOP - 40 + 'px'; // 判定結果の上の位置を決定
    // なぜか判定結果の位置を動的に変えられない
    // 上から落ちてくるブロックをランダムに生成する
    // だんだん間隔を詰める
    // 20, 20, 530個, 故に, 計570個
    /*
    for(let i=0; i < 40; i += 2)
		blocks.push(new Block(Math.floor(Math.random() * 4), i));
    for(let i=40; i < 70; i += 1.5)
		blocks.push(new Block(Math.floor(Math.random() * 4), i));
    for(let i=70; i < 600; i ++)
		blocks.push(new Block(Math.floor(Math.random() * 4), i));
    */
    // laneNum
    // speedに応じてをかけたらいいのでは
    for(let i=0; i < ALL_NOTES; i ++) {
        blocks.push(new Block(Math.floor(Math.random() * 4), i, speed));
        //blocks.push(new Block(1, i, speed));
    }

    bestCount = 0;
    goodCount = 0;
    missCount = 0;
    poorCount = 0;
    comboCount = 0;
    maxComboCount = 0;
    //document.getElementById("score_result").textContent = String(1000 * bestCount + 500 * goodCount - 0*missCount - 100*poorCount).padStart(6, '0');
    document.getElementById("combo_result").textContent = String(comboCount).padStart(4, '0');
    //bgm.currentTime = 0;
    //bgm.play();

    start.style.display = 'none';

    // BGMの終了近くになったら以降は新しいブロックを落とさないようにする 1000*100の話
    // blocksからY座標が-10以下のものと取り除く（ついでに必要ないCANVAS_HEIGHT以上のものの取り除く）
    /*
    setTimeout(() => {
        // blocksの中でも、-10以下までのもの(上表示すぎるもの)と, HWIGHT以上, 既に通過したものを取り消す(filterの条件に合わないようにして格納させない)
        blocks = blocks.filter(rect => rect.Y > -10 && rect.Y < CANVAS_HEIGHT);
    //}, 1000 * 100);
    }, 1000 * 90);
    */
    isPlaying = true;
    startTime = performance.now().toPrecision(4); // 開始時間
    //playData_forCSV .push([performance.now().toPrecision(4)-startTime, '', '', '', '', "", '']); // 1行後くらいなら0だった
    setTimeout(async() => {
        isPlaying = false;

        //bgm.pause();
        //await playDrumroll();

        const resultText = `BEST: ${bestCount}\nGOOD: ${goodCount}\nMISS: ${missCount}\nPOOR: ${poorCount}\nMAXCOMBO: ${maxComboCount}`;
        showResult(resultText);
    //}, 1000 * 102); // 1000 * 103
    }, 1000 * playTime + 10*offsetTime + 1000); // Y=0スタートだと90じゃ足りない
}

//https://noauto-nolife.com/post/javascript-download-csv/
function create_csv(data, file_name){
    //作った二次元配列をCSV文字列に直す。
    let csv_string  = ""; 
    for (let d of data) {
        csv_string += d.join(",");
        csv_string += '\r\n';
    } 
    //ファイル名の指定
    let link        = document.createElement("a");
    link.download   = file_name; // ないと複数ファイルの時新しい方に上書き
    //CSVのバイナリデータを作る
    let blob        = new Blob([csv_string], {type: "text/csv"});
    link.href       = URL.createObjectURL(blob);
    link.click();
}


function showResult(resultText){
    clearCanvas(); // コンボとかが邪魔, ここは最悪画面遷移でもいい
    document.body.classList.remove("cursor-hide");
    document.getElementById("judge_result").textContent = "";
    //document.getElementById("score_result").style.display = 'inline';
    document.getElementById("combo_result").style.display = 'inline';

    document.getElementById("combo_result").innerText = resultText;
    notesList_forCSV.push(["BEST", "GOOD", "MISS", "POOR", "MAXCOMBO"]);
    notesList_forCSV.push([bestCount, goodCount, missCount, poorCount, maxComboCount]);

    // 生成したノーツがどの順番, どのレーンで, どのスピード(10msで移動するピクセル)のデータcsvを作る
    create_csv(notesList_forCSV, 'notes_data.csv');
    // キーを打った時間, 打ったレーン, その時のノーツ(MISS等の範囲内で判定ラインに最も近い)のレーン, ノーツの番目, ノーツの位置, 判定ラインの位置, 判定結果
    create_csv(playData_forCSV, 'play_data.csv');

    /*
    const arr = resultText.split('\n');
    if(arr.length < 3)
        return;

    ctx.fillStyle = '#fff';
    ctx.font = '20px bold MS ゴシック';

    const textWidth1 = ctx.measureText('result').width;
    const x1 =  (CANVAS_WIDTH - textWidth1) / 2;
    ctx.fillStyle = '#fff';
    ctx.fillText('結果', x1, 160);

    const textWidth = ctx.measureText(arr[1]).width;
    const x =  (CANVAS_WIDTH - textWidth) / 2;
    ctx.fillStyle = '#fff';
    ctx.fillText(arr[0], x, 200);
    ctx.fillStyle = '#fff';
    ctx.fillText(arr[1], x, 230);
    ctx.fillStyle = '#fff';
    ctx.fillText(arr[2], x, 260);
    ctx.fillStyle = '#fff';
    ctx.fillText(arr[3], x, 290);

    start.style.display = 'block';
    */
}

/*
async function playDrumroll(){
    //drumrollSound1.currentTime = 0;
    //drumrollSound1.play();

    return new Promise((resolve) => {
        setTimeout(() => {
            //drumrollSound1.pause();
            setTimeout(() => {
                //drumrollSound2.currentTime = 0;
                //drumrollSound2.play();
                resolve();
            }, 300);
        }, 2500);
    });
}
*/



// https://www.youtube.com/watch?v=e9NOhg2Iv9E 1:43
