// 速度を速くしたとき、後半でラグいような気がした, まあひどくはないから大丈夫かな
// ランダム生成はいいけど、もしかしたら毎回ノーツがバラバラカモ
// 間隔変えてる都合のせいか、356or357
// 1:41:49, 大体1分40秒くらい
// 時間は一定で、速度が速くなるとそれに応じてノードの数が多くなる
// 速度8で固定すると、570(可変もないからね)
// 1:37:12, そこそこ差がでかいな
// 103000ms, 103秒, 1分43秒
// 実はHitとThrough足したら前ノーツ数になる? 288 282 234になってた
// 次 403 167 290 間違いない, こうなるとmissって何? 存在価値ある?
// ある種、Hitになるまでのmiss, Hit, HitしそびれたThroughに別れるのでは?

const BUTTONS_TOP = 400;
const BUTTONS_HEIGHT = 50;

const LANE_WIDTH = 70;
const LANE_LEFTS = [10, 100, 190, 280];
const BLOCK_HEIGHT = 50;

const HIT_Y_MIN = BUTTONS_TOP - BLOCK_HEIGHT;
const HIT_Y_MAX = BUTTONS_TOP + BUTTONS_HEIGHT;

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 540;

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
//let speed = 3;
//let speed = document.getElementById("speed").value;
let speed = 8; //入力が上手くいっていない?
let hitCount = 0;
let missCount = 0;
let throughCount = 0;
//let resultText = '';

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
		hits[0].IsHit = true;
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
    ctx.strokeStyle = '#ccc';
    for(let i =0; i < LANE_LEFTS.length; i++)
        ctx.strokeRect(LANE_LEFTS[i], 0, LANE_WIDTH, $canvas.height);
}

function drawHit(laneNum){
    ctx.fillStyle = '#0ff';
    ctx.font = '20px bold MS ゴシック';
    const textWidth = ctx.measureText('Hit').width;
    ctx.fillText('HIT', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 10);
}

function drawThrough(laneNum){
    ctx.fillStyle = '#ff0';
    ctx.font = '20px bold MS ゴシック';
    const textWidth = ctx.measureText('Thro').width; // Thro
    ctx.fillText('Thro', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 30);
}

function drawMiss(laneNum){
    ctx.fillStyle = '#f0f';
    ctx.font = '20px bold MS ゴシック';
    const textWidth = ctx.measureText('Miss').width;
    ctx.fillText('Miss', LANE_LEFTS[laneNum] + (LANE_WIDTH - textWidth) / 2, HIT_Y_MAX + 50);
}

function onHit(laneNum){
    hitCount++;
    //okSound.currentTime = 0;
    //okSound.play();
    hitLaneNumbers.push(laneNum);
    setTimeout(() => {
        hitLaneNumbers.shift();
    }, 500);
}

function onMiss(laneNum){
    missCount++;
    //missSound.currentTime = 0;
    //missSound.play();
    missLaneNumbers.push(laneNum);
    setTimeout(() => {
        missLaneNumbers.shift();
    }, 500);
}

function onThrough(laneNum){
	throughCount++;

    throughLaneNumbers.push(laneNum);
    setTimeout(() => {
        throughLaneNumbers.shift();
    }, 500);
}

class Block{
    constructor(laneNum, delay){
        this.LaneNumber = laneNum;
        this.X = LANE_LEFTS[laneNum];
        this.Y = - 80 * delay;
        this.Width = LANE_WIDTH;
        this.Height = BLOCK_HEIGHT;
        this.IsHit = false;
        this.IsThrough = false;
    }

    // ヒットされていないのにHIT_Y_MAXより下に落ちてきたら見逃しと判断する
    Update(){
        if(!this.IsHit && !this.IsThrough && this.Y > HIT_Y_MAX){
            this.IsThrough = true;
			onThrough(this.LaneNumber);
        }
        this.Y += speed; // 多分speedの分だけ更新しながらYが増える->つまり高度が落ちる->ノーツが落ちる
    }

    Draw(){
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.X, this.Y + 20, this.Width, this.Height - 40);
        //ctx.fillRect(this.X, this.Y, this.Width, this.Height);
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
	initVolumes(0.5);
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

function addEventListeners(){
	$start.addEventListener('click', (ev) => {
        ev.preventDefault();
        gameStart();
    });

	const buttons = [$zero, $one, $two, $three];
    const events = ['mousedown', 'touchstart'];

    for(let i = 0; i < LANE_LEFTS.length; i++){
        for(let k = 0; k < events.length; k++){
            buttons[i].addEventListener(events[k], (ev) => {
                ev.preventDefault();

                if(!isPlaying)
                    return;

                const hits = blocks.filter(rect => !rect.IsHit && rect.X == LANE_LEFTS[i] && HIT_Y_MIN < rect.Y && rect.Y < HIT_Y_MAX);
                if(hits.length > 0){
					hits[0].IsHit = true;
                    onHit(i);
				}
                else
                    onMiss(i);
            });
        }
    }
}

/*
タイマー処理の部分を示します。
現在プレイ中でない場合は何もしません。更新時はブロックの落下速度を少しずつ上げていきます
->速度可変取り除く予定
*/
setInterval(() => {
    if(!isPlaying)
        return;

    //if(speed < 5) speed += 0.005; // 落下速度可変要素の削除

	clearCanvas();
	drawLanes();

    blocks.forEach(block => block.Update());
    blocks.forEach(block => block.Draw());

    hitLaneNumbers.forEach(num => drawHit(num));
    throughLaneNumbers.forEach(num => drawThrough(num));
    missLaneNumbers.forEach(num => drawMiss(num));

    ctx.font = '20px bold MS ゴシック';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Hit  ${hitCount}    Through  ${throughCount}    Miss  ${missCount}`, 10, 10);
}, 1000 / 60);

function gameStart(){
    blocks.length = 0;
    // 上から落ちてくるブロックをランダムに生成する
    // だんだん間隔を詰める
    for(let i=0; i < 40; i += 2)
		blocks.push(new Block(Math.floor(Math.random() * 4), i));
    for(let i=40; i < 70; i += 1.5)
		blocks.push(new Block(Math.floor(Math.random() * 4), i));
    for(let i=70; i < 600; i ++)
		blocks.push(new Block(Math.floor(Math.random() * 4), i));

    hitCount = 0;
    missCount = 0;
    throughCount = 0;

    speed = 8; // letでspeed定義しているが、ここで実際には代入
    //speed = document.getElementById("speed").value; // なんかvalueでも事故る
    isPlaying = true;

    //bgm.currentTime = 0;
    //bgm.play();

    $start.style.display = 'none';

    // BGMの終了近くになったら以降は新しいブロックを落とさないようにする
    // blocksからY座標が-10以下のものと取り除く（ついでに必要ないCANVAS_HEIGHT以上のものの取り除く）
    setTimeout(() => {
        blocks = blocks.filter(rect => rect.Y > -10 && rect.Y < CANVAS_HEIGHT);
    }, 1000 * 100);

    setTimeout(async() => {
        isPlaying = false;

        //bgm.pause();
        //await playDrumroll();

        const resultText = `Hit: ${hitCount}\nThrough: ${throughCount}\nMiss: ${missCount}`;
        showResult(resultText);
    }, 1000 * 103); // 1000 * 103
}


function showResult(resultText){
    const arr = resultText.split('\n');
    if(arr.length < 3)
        return;

    ctx.fillStyle = '#ff0';
    ctx.font = '20px bold MS ゴシック';

    const textWidth1 = ctx.measureText('結果').width;
    const x1 =  (CANVAS_WIDTH - textWidth1) / 2;
    ctx.fillStyle = '#fff';
    ctx.fillText('結果', x1, 160);

    const textWidth = ctx.measureText(arr[1]).width;
    const x =  (CANVAS_WIDTH - textWidth) / 2;
    ctx.fillStyle = '#0ff';
    ctx.fillText(arr[0], x, 200);
    ctx.fillStyle = '#ff0';
    ctx.fillText(arr[1], x, 230);
    ctx.fillStyle = '#f0f';
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
