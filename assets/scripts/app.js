//공격 버튼 부터 만들기 
//체력바를 줄어들게 만든다. 페력의 시작값을 불러와야함
const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE =14; //우리의 공격력 보다 더 세기 때문에 운이 필요함 0과 14사이 
const STRONG_ATTACK_VALUE = 17; //강공격의 어택 밸류
const HEAL_VALUE =20; 
//공격은 10으로 설정 
// 최대값으로 처리된다 /vendor.js 로 0와 10 의 무작위 요소로 만듬
//상수 전역값은 대문자를 사용하고 단어를 구분할 땐 _ 를 사용 


// 초기 최대 생명은 100 (문자열) parseInt 로 숫자로 바꿔줘야함 
const MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0;
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; // MODE_STRONG_ATTACK=1;
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK ='PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_PLAYER_GAME_OVER = "GAME_OVER";

let battleLog = []; //배틀로그를 담을 빈 배열 





//정수나 숫자로 변환될 수 없는 내용을 입력해도 JS는 오류를 띄우지않고
//NaN을 띄운다.
//try catch를 계속해 나가기 위해서는 오류가 일어나야한다.
//자체적인 오류를 일으킬 수 있음 
//공식 오류 관리도구를 통해 오류를 처리할 수 있게된다.
//큰 어플일 경우 자체적인 오류를 일으키는 것은 흔한일 

function getMaxLifeValues() {
    const enteredValue = prompt('너와 몬스터의 최대 생명','100');
    let parsedValue  = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue <=0){
        
        throw {message: 'Invalid user input, not a number'};
        //새로운 에러를 만드는 키워드, 숫자나 문자열 혹은 객체도 오류가능


         //숫자가 아닌 값을 음수를 입력할 경우 디폴트 체력값을 정해줌
    } //chosenMaxLife 입력한 숫자가 아닌 경우와
    //parseInt의 결과도 숫자가 아니면 트수한 NaN 경우에 해당
    //체력 값은 변하니 let으로 설정
    //추후 사용자가 이 값을 설정하도록 할 것이기 때문에 전역이 아님

    return parsedValue;
}

let chosenMaxLife;
try {
    chosenMaxLife = getMaxLifeValues();
} catch (error){
    console.log(error);
    chosenMaxLife = 100;
    //폴백 로직 
    // 오류가 나면 기본값을 주고 폴백을 하고 사용자에게 알려줌 
    alert('You entered something wrong, default value of 100 was used.')
}





//일단 몬스터 체력 100으로 고정 
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true; // 라이프 제어하고자 하는 대상에 불리언
//다른 프로그램은 isLoggedIn 같은 것 








adjustHealthBars(chosenMaxLife);
//공격버튼을 체력을 낮추는 함수와 연결하고 싶다.
//vendor.js 파일에 있는 attackBtn을 사용할 것 

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife); // 리셋할 수 있음 다시 피를 채움 
}

// 이 함수에서 여러 이벤트가 로그에 기록 됨
function writeToLog(ev, val,monsterHealth,playerHealth) {
    //해당 이벤트에 대한 정보를 담아야함
    let logEntry;
    if(ev ===LOG_EVENT_PLAYER_ATTACK){
        logEntry = {
            event:ev,
            value: val,
            target :"MONSTER",
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth,
        };
        
    } else if(ev=== LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry = {
            event:ev,
            value: val,
            target :"MONSTER",
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth,
        };
        
    } else if (ev=== LOG_EVENT_MONSTER_ATTACK){
        logEntry = {
            event:ev,
            value: val,
            target :"PLAYER",
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth,
        };
        
    }
    else if (ev ===LOG_EVENT_PLAYER_HEAL){
        logEntry = {
            event:ev,
            value: val,
            target :"PLAYER",
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth,
        };
        
    } else if(ev=== LOG_EVENT_PLAYER_GAME_OVER){
        logEntry = {
            event:ev,
            value: val,//승자의 결과가 나올듯 
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth,
        };
        
    }
    battleLog.push(logEntry);
}


function endRound(){
    const initialPlayerLife =currentPlayerHealth;
    const PlayerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
   currentPlayerHealth -= PlayerDamage;
   writeToLog(LOG_EVENT_MONSTER_ATTACK,PlayerDamage,currentMonsterHealth,currentPlayerHealth);
   //로그 쓰기 함수 호출 

   //체력이 다깎이고 추가 라이프가 있을 때
   if(currentPlayerHealth <= 0 && hasBonusLife){
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerLife; //몬스터 공격 전으로 생명 상태로 돌아감
    setPlayerHealth(initialPlayerLife);
    alert('다시 살아났습니다.')
    

   }
   
   if( currentMonsterHealth <= 0 && currentPlayerHealth > 0){ 
        alert('you won!');
        writeToLog(
            LOG_EVENT_PLAYER_GAME_OVER,
            'PLAYER_WON',
            currentMonsterHealth,
            currentPlayerHealth,
        ); //리셋되기전 결과 내용을 로그가 보고싶음
        reset();
   } else if (currentPlayerHealth <=0 && currentMonsterHealth >0) 
   {
    alert('you lost');
    writeToLog(
        LOG_EVENT_PLAYER_GAME_OVER,
        'MONSTER_WON',
        currentMonsterHealth,
        currentPlayerHealth,
    ); //리셋되기전 결과 내용을 로그가 보고싶음
    reset();
   } else if (currentMonsterHealth <=0 && currentPlayerHealth <=0 ) { 
    alert('무승부');
    writeToLog(
        LOG_EVENT_PLAYER_GAME_OVER,
        'A DRAW',
        currentMonsterHealth,
        currentPlayerHealth,
    ); //리셋되기전 결과 내용을 로그가 보고싶음
    reset();//누가 이기던 상관없이 reset 하는 것 피가 0인경우를 확인하는 것 
   }

//    if(currentMonsterHealth <= 0 || currentPlayerHealth <=0){
//     reset();
//    }//이렇게도 초기화 가능 (중복줄이기)

} // 몬스터가 공격을 하고 승리했는지 무승부했는지 확인


//강공격과 공격의 공통된 부분을 없애주기 위해 만든 함수 
function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if(mode===MODE_ATTACK){
    //     maxDamage =ATTACK_VALUE;
    //     logEvent= LOG_EVENT_PLAYER_ATTACK;
    // } else if(mode ===MODE_STRONG_ATTACK) 
    // {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent =LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    //위처럼 경우에 경우에 따라 다른 변수를 넣어 줄 경우 삼항연산자가 편하다.

    
   const damage= dealMonsterDamage(maxDamage);
   
   currentMonsterHealth -=damage; 
   writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth,
); //사용자가 때렸을 때 보여줄 로그들 
   endRound();
}

function attackHandler() {
//     //공격을 가하는데 dealMonster이 있음 
//    const damage= dealMonsterDamage(ATTACK_VALUE);
//    //함수가 실행되는 중에 안바뀌니 상수
//    //저장된 데미지를 통해 몬스터 체력 조정
//    currentMonsterHealth -=damage; //데미지를 입음 
//    //dealPlayerDamage 함수 : 몬스터가 사용자를 공격
//    const PlayerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
//    currentPlayerHealth -= PlayerDamage;
   
//    if( currentMonsterHealth <= 0 && currentPlayerHealth > 0){ // 체력이 0이하가 되면 승리 조건 사용자 피가 남아있어야함 
//         alert('you won!');
//    } else if (currentPlayerHealth <=0 && currentMonsterHealth >0) // 사용자의 피가 0이되면 진다. 몬스터 피가 남아있어야함.
//    {
//     alert('you lost');
//    } else if (currentMonsterHealth <=0 && currentPlayerHealth <=0 ) { //둘다 피가 다 떨어지면 무승부 
//     alert('무승부');
//    }
    attackMonster(MODE_ATTACK);
}

//강공격 만들기
function strongAttackHandler(){
    
   attackMonster(MODE_STRONG_ATTACK);

} 

function HealPlayerHandler(){
    let healValue;
    //if조건문을 만들어서 chosenMaxLife 보다 많은 지
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert('최대 체력이상 힐할 수가 없습니다.')
        healValue = chosenMaxLife - currentMonsterHealth;
    } else {
        healValue = HEAL_VALUE;
        //힐을 해도 최대 체력보다 적음  
        // healValue는 최대 체력과 현재 체력을 반영하는 동적인 코드이므로
        //게임안에서도 healValue를 반영해야함 
    }
    increasePlayerHealth(healValue); //체력을 회복해도 몬스터는 매턴때려야함
    currentPlayerHealth += healValue; //힐할 때 현재 플레이어의 피를 올려줘야함
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth,
    );
    endRound();

}

function printLogHandler() {
    console.log(battleLog);
}

attackBtn.addEventListener('click',attackHandler)
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',HealPlayerHandler);
logBtn.addEventListener('click',printLogHandler); //로그를 보여주는 함수 
