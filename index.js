const BUTTONS_TOP = 500; // デフォルト 400
const BUTTONS_HEIGHT = 50;

const LANE_WIDTH = 70;
const DEFAULT_LEFT = 600;
//const LANE_LEFTS = [10, 100, 190, 280];
const LANE_LEFTS = [DEFAULT_LEFT, DEFAULT_LEFT+LANE_WIDTH, DEFAULT_LEFT+2*LANE_WIDTH, DEFAULT_LEFT+3*LANE_WIDTH];
const BLOCK_HEIGHT = 50; // 落ちてくるブロックの当たり判定のある部分の高さ

// 落ちてくるブロックの当たり判定のある部分のY座標の最小値と最大値
// ここを調節したら判定幅は容易に変わる
const HIT_Y_MIN = BUTTONS_TOP - BLOCK_HEIGHT;
const HIT_Y_MAX = BUTTONS_TOP + BUTTONS_HEIGHT;

//const CANVAS_WIDTH = 360;
const CANVAS_WIDTH = DEFAULT_LEFT+4*LANE_WIDTH;
const CANVAS_HEIGHT = 640; // デフォルト 540

const $start = document.getElementById('start');
const $zero = document.getElementById('zero');
const $one = document.getElementById('one');
const $two = document.getElementById('two');
const $three = document.getElementById('three');

const $canvas = document.getElementById('canvas');
const ctx = $canvas.getContext('2d');

/*
const okSound = new Audio('./ok.wav');
const missSound = new Audio('./miss.mp3');
const bgm = new Audio('./bgm.mp3');

const drumrollSound1 = new Audio('./drumroll1.mp3');
const drumrollSound2 = new Audio('./drumroll2.mp3');
*/

let blocks = [];
const hitLaneNumbers = [];
const missLaneNumbers = [];
const throughLaneNumbers = [];

let isPlaying = false;
let speed = 3;
let hitCount = 0;
let missCount = 0;
let throughCount = 0;
let comboCount = 0;
let baseSpeed = 50; // ノーツを落とすスピードのベース, 元は80
document.getElementById("judge_result").style.position = "absolute";
document.getElementById("judge_result").style.left = DEFAULT_LEFT+LANE_WIDTH + 50; // 判定結果の左の位置を決定
document.getElementById("judge_result").style.top = HIT_Y_MAX - 105; // 判定結果の上の位置を決定
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
	if(ev.code == 'KeyD')
		onKeyHit(0)
	if(ev.code == 'KeyF')
		onKeyHit(1)
	if(ev.code == 'KeyJ')
		onKeyHit(2)
	if(ev.code == 'KeyK')
		onKeyHit(3)
}

document.onkeyup = (ev) => {
	if(ev.code == 'KeyD')
		isKeysHit[0] = false;
	if(ev.code == 'KeyF')
		isKeysHit[1] = false;
	if(ev.code == 'KeyJ')
		isKeysHit[2] = false;
	if(ev.code == 'KeyK')
		isKeysHit[3] = false;
}

function onKeyHit(index){
	if(!isPlaying || isKeysHit[index])
		return;

	isKeysHit[index] = true;
	const hits = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[index] && HIT_Y_MIN < rect.Y && rect.Y < HIT_Y_MAX);

    // 判定ライン
	if(hits.length > 0){
		hits[0].IsHit = true; // 
		onHit(index);
	}
	else{
		onMiss(index);
    }

}

/*
function playSound(){
    //okSound.currentTime = 0;
    //okSound.play();
}
*/

function clearCanvas(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, $canvas.width, $canvas.height);
}

function drawLanes(){
    //ctx.strokeStyle = '#ccc';
    ctx.strokeStyle = '#fff';
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.strokeRect(LANE_LEFTS[i], 0, LANE_WIDTH, $canvas.height);
}

// 1000/60msに一回, 
function drawHit(laneNum){
    //ctx.fillStyle = '#fff';
    //ctx.fillStyle = '#000';
    //ctx.font = '20px bold MS ゴシック';
    //const textWidth = ctx.measureText('Hit').width;
    //ctx.fillText('HIT', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 10); // 元のコード
    //ctx.fillText('', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX - 105); // これつけても判定の重複が消えない
    //ctx.fillText('    ', LANE_LEFTS[1] + 50, HIT_Y_MAX - 105);
    //ctx.fillStyle = '#fff';
    //ctx.fillText('HIT', LANE_LEFTS[1] + 50, HIT_Y_MAX - 105); // 雰囲気判定ライン手前の判定
    document.getElementById("judge_result").textContent='HIT';
}

function drawThrough(laneNum){
    //ctx.fillStyle = '#fff';
    //ctx.fillStyle = '#000';
    //ctx.font = '20px bold MS ゴシック';
    //const textWidth = ctx.measureText('Thro').width; // Thro
    //ctx.fillText('Thro', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 30); // 元のコード
    //ctx.fillText('', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX - 105);
    //ctx.fillText('    ', LANE_LEFTS[1] + 50, HIT_Y_MAX - 105);
    //ctx.fillStyle = '#fff';
    //ctx.fillText('Thro', LANE_LEFTS[1] + 50,  HIT_Y_MAX - 105);
    document.getElementById("judge_result").textContent='Thro';
}

function drawMiss(laneNum){
    //ctx.fillStyle = '#fff';
    //ctx.fillStyle = '#000';
    //ctx.font = '20px bold MS ゴシック';
    //const textWidth = ctx.measureText('Miss').width;
    //ctx.fillText('Miss', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 50); // 元のコード
    //ctx.fillText('    ', LANE_LEFTS[1] + 50, HIT_Y_MAX - 105);
    //ctx.fillStyle = '#fff';
    //ctx.fillText('Miss', LANE_LEFTS[1] + 50, HIT_Y_MAX - 105); // 雰囲気判定ライン手前の判定
    document.getElementById("judge_result").textContent='Miss';
}

function onHit(laneNum){
    hitCount++;
    comboCount++;
    //okSound.currentTime = 0;
    //okSound.play();
    hitLaneNumbers.push(laneNum);
    setTimeout(() => {
        hitLaneNumbers.shift();
    }, 500);
}

function onMiss(laneNum){
    missCount++;
    comboCount = 0;
    //missSound.currentTime = 0;
    //missSound.play();
    missLaneNumbers.push(laneNum);
    setTimeout(() => {
        missLaneNumbers.shift();
    }, 500);
}

function onThrough(laneNum){
	throughCount++;
    comboCount = 0;
    throughLaneNumbers.push(laneNum);
    setTimeout(() => {
        throughLaneNumbers.shift();
    }, 500);
}

class Block{
    constructor(laneNum, delay, distanceForSpeed){
        this.LaneNumber = laneNum;
        this.X = LANE_LEFTS[laneNum];
        this.Y = - baseSpeed * distanceForSpeed *  delay; // 実はずっと裏で生成済みになっている, 高さが増えることで目に見える
        // this.Y = - 80 * delay
        this.Width = LANE_WIDTH;
        this.Height = BLOCK_HEIGHT;
        this.IsHit = false; // レーン押下時の過剰ヒットを防ぐことと, 未ヒットのものだけスルー対象になるようにする
        this.IsThrough = false;
    }

    // ヒットされていないのにHIT_Y_MAXより下に落ちてきたら見逃しと判断する
    // onkeyhitとaddeventlistenerの2者でtrueにされる
    Update(){
        if(!this.IsHit && !this.IsThrough && this.Y > HIT_Y_MAX){
            this.IsThrough = true;
			onThrough(this.LaneNumber);
        }
        // 入力時以外speedここだけ
        this.Y += speed; // 多分speedの分だけ更新しながらYが増える->つまり高度が落ちる->ノーツが落ちる
    }

    Draw(){
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.X, this.Y + 20, this.Width, this.Height - 40);
        //ctx.fillRect(this.X, this.Y, this.Width, this.Height); //でもよいがブロックが厚くなりすぎるので・・・
    }
}

///

window.onload = () => {
    $canvas.width = CANVAS_WIDTH;
    $canvas.height = CANVAS_HEIGHT;

	clearCanvas();
	drawLanes();

	setPositionButtons();
	addEventListeners();
	//initVolumes(0.5);
}

function setPositionButtons(){
    const buttons = [$zero, $one, $two, $three];
	for(let i = 0; i < buttons.length; i++){
		buttons[i].style.left = LANE_LEFTS[i] + 'px';
		buttons[i].style.top = BUTTONS_TOP + 'px';
		buttons[i].style.width = LANE_WIDTH + 'px';
		buttons[i].style.height = BUTTONS_HEIGHT + 'px';
    }
}

// window読み込み時に起動
// ゲーム開始時のボタン押下に対するイベントリスナと, レーン押下に対するイベントリスナ
function addEventListeners(){
    // 最初の起動
	$start.addEventListener('click', (ev) => {
        ev.preventDefault();
        gameStart();
    });

	const buttons = [$zero, $one, $two, $three];
    const events = ['mousedown', 'touchstart'];

    for(let i = 0; i < LANE_LEFTS.length; i++){
        for(let k = 0; k < events.length; k++){
            // 各ボタンのaddEventListener
            buttons[i].addEventListener(events[k], (ev) => {
                ev.preventDefault(); // ある種ボタン同時押しは許されない?

                if(!isPlaying)
                    return;

                const hits = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[i] && HIT_Y_MIN < rect.Y && rect.Y < HIT_Y_MAX);
                // hit済みのノーツをもう一度ヒットさせないための、!rect.IsHit
                // ボタンを押した時に, 判定幅にまだヒット判定のないノーツがあるかを確認
                if(hits.length > 0){
					hits[0].IsHit = true; // hitしてたらtrueにして過剰ヒットを防ぐ
                    onHit(i);
				}
                // Missの範囲を設けないと意味がない感
                else{
                    onMiss(i);
                }
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
setInterval(() => {
    if(!isPlaying)
        return;

    //if(speed < 5) speed += 0.005; // 落下速度可変要素の削除

	clearCanvas();
	drawLanes();

    blocks.forEach(block => block.Update()); // blocksの中のblockを1つずつ取り出し、個々で更新する
    blocks.forEach(block => block.Draw());

    hitLaneNumbers.forEach(num => drawHit(num));
    throughLaneNumbers.forEach(num => drawThrough(num));
    missLaneNumbers.forEach(num => drawMiss(num));

    ctx.font = '20px bold MS ゴシック';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    //ctx.fillText(`Hit  ${hitCount}    Through  ${throughCount}    Miss  ${missCount}`, 10, 10);
    ctx.fillText(`Combo`, LANE_LEFTS[1] + 50, $canvas.height/2 - 80);
    ctx.fillText(`${comboCount}`, LANE_LEFTS[1] + 50, $canvas.height/2 - 60); // コンボ数を真ん中に表示
    ctx.fillText(`Score:  ${10000 * hitCount}`, LANE_LEFTS[1], 10); // スコアを画面上に表示
//}, 1000 / 60);
}, 1000 / 100);

function gameStart(){

    speed = parseFloat(document.getElementById("speed").value); // なんかvalueでも事故る
    document.getElementById("speed").style.display = 'none';
    blocks.length = 0;
    
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
    // laneNum と Delay
    // speedに応じてこのDelayをかけたらいいのでは
    for(let i=0; i < 600; i ++) {
        blocks.push(new Block(Math.floor(Math.random() * 4), i, speed));
        //blocks.push(new Block(Math.floor(Math.random() * 4), i, (speed))); // これにしたら間隔詰まってる感は出てきた, delayとかあの-80とかの調整かな
    }

    hitCount = 0;
    missCount = 0;
    throughCount = 0;
    comboCount = 0;

    isPlaying = true;

    //bgm.currentTime = 0;
    //bgm.play();

    $start.style.display = 'none';

    // BGMの終了近くになったら以降は新しいブロックを落とさないようにする 1000*100の話
    // blocksからY座標が-10以下のものと取り除く（ついでに必要ないCANVAS_HEIGHT以上のものの取り除く）
    setTimeout(() => {
        // blocksの中でも、-10以下までのもの(上表示すぎるもの)と, HWIGHT以上, 既に通過したものを取り消す(filterの条件に合わないようにして格納させない)
        blocks = blocks.filter(rect => rect.Y > -10 && rect.Y < CANVAS_HEIGHT);
    }, 1000 * 100);

    setTimeout(async() => {
        isPlaying = false;

        //bgm.pause();
        //await playDrumroll();

        const resultText = `Hit: ${hitCount}\nThrough: ${throughCount}\nMiss: ${missCount}`;
        showResult(resultText);
    }, 1000 * 102); // 1000 * 103
}


function showResult(resultText){
    clearCanvas(); // コンボとかが邪魔, ここは最悪画面遷移でもいい
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

    $start.style.display = 'block';
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
