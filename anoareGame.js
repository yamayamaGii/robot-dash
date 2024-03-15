const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const imageNames=['player','mohikan','batabee']

//game object
const game={
  counter:0,
  backGrounds:[],
  enemys:[],
  image:{},
  isGameOver:true,
  score:0,
  timer:null
};

//複数画像読み込み
let imageLoadCounter=0;
for (const imageName of imageNames){
  const imagePath=`image/${imageName}.gif`;
  game.image[imageName]=new Image();
  game.image[imageName].src=imagePath;
  game.image[imageName].onload=()=>{
    imageLoadCounter+=1;
    if(imageLoadCounter===imageNames.length){
      console.log('画像のロード完了')
      init();
    }
  }
}

function init(){
  game.counter=0;
  game.enemys=[];
  game.isGameOver=false;
  game.score=0;
  createPlayer();
  game.timer=setInterval(ticker,30);
}

var btn = document.getElementById('btn');
var wrapper = document.getElementById('wrapper');

function createPlayer(){
  game.player={
    x:game.image.player.width/2,
    y:canvas.height-game.image.player.height/2,
    moveY:0,
    width:game.image.player.width,
    height:game.image.player.height,
    image:game.image.player
  }
}
function createMohikan(){
  game.enemys.push({
    x:canvas.width+game.image.mohikan.width/2,
    y:canvas.height-game.image.mohikan.height/2,
    width:game.image.mohikan.width,
    height:game.image.mohikan.height,
    moveX:-10,
    image:game.image.mohikan
  });
}
function createBatabee(){
  game.enemys.push({
    x:canvas.width+game.image.batabee.width/2,
    y:batabeeY,
    width:game.image.batabee.width,
    height:game.image.batabee.height,
    moveX:-15,
    image:game.image.batabee
  });
}
function createBackGround(){
  game.backGrounds=[];
  for(let x=0;x<=canvas.width;x+200){
    game.backGrounds.push({
      x:x,
      y:canvas.height,
      width:200,
      moveX:-20
    });
  }
}

function movePlayer(){
  game.player.y+=game.player.moveY;
  if(game.player.y>=canvas.height-game.player.height/2){
    game.player.y=canvas.height-game.player.height/2;
    game.player.moveY=0;
  }else{
    game.player.moveY+=3;
  }
}
function moveEnemys(){
  for(const enemy of game.enemys){
    enemy.x+=enemy.moveX;
  }
  //画面の外に出たキャラクタを配列から削除
  game.enemys=game.enemys.filter(enemy=>enemy.x-enemy.width);
}
function moveBackGrounds(){
  for(const backGround of game.backGrounds){
    backGround.x+=backGround.moveX;
  }
}

function drawPlayer(){
  ctx.drawImage(game.image.player,game.player.x-game.player.width/2,game.player.y-game.player.height/2)
}
function drawEnemys(){
  for(const enemy of game.enemys){
    ctx.drawImage(enemy.image,enemy.x-enemy.width/2,enemy.y-enemy.height/2);
  }
}
function drawScore(){
  ctx.fillStyle='black';
  ctx.font='24px Chalkduster';
  ctx.fillText(`score:${game.score}`,0,30);
}
function drawBackGrounds(){
  ctx.fillStyle='sienna';
  for(const backGround of game.backGrounds){
    ctx.fillRect(backGround.x,backGround.y-5,backGround.width,5);
    ctx.fillRect(backGround.x+20,backGround.y-20,backGround.width-40,5);
    ctx.fillRect(backGround.x+50,backGround.y-15,backGround.width-100,5);
  }
}

document.onkeydown=function(e){
  if(e.key===''&&game.player.moveY===0){
    game.player.moveY=-41;
  }
  if(e.key==='Enter'&&game.isGameOver===true){
    init();
  }
};

function ticker(){
  //画面クリア
  ctx.clearRect(0,0,canvas.width,canvas.height);

  //背景の作成
  if(game.counter%10===0){
    createBackGround();
  }

  //敵キャラクタ生成
if(Math.floor(Math.random()*(100-game.score/100))===0){
  createMohikan();
}
if(Math.floor(Math.random()*(200-gane.score/100))===0){
  createBatabee();
}

  //キャラクタ移動
moveBackGrounds();//背景の移動
movePlayer();//自機の移動
moveEnemys();//敵機の移動

//描画
drawBackGrounds();//背景の描画
drawPlayer();//自機の描画
moveEnemys();//敵機の描画
drawScore();//スコアの描画

//当たり判定
hitCheck();

//カウンタの更新
game.score+=1;
game.counter=(game.counter+1)%1000000;
}

function hitCheck(){
  for (const enemy of game.enemys){
    if(
      Math.abs(game.player.x-enemy.x)<game.player.width*0.8/2+enemy.width*0.9/2&&
      Math.ads(game.player.y-enemy.y)<game.player.height*0.5/2+enemy.height*0.9/2
    ){
      game.isGameOver=true;
      ctx.font='Chalkduster 100px serif'
      ctx.fillText(`Game Over!`,150,200);
      clearInterval(game.timer)
    }
  }
}