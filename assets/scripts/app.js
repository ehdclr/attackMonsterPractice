//공격 버튼 부터 만들기 
//체력바를 줄어들게 만든다. 페력의 시작값을 불러와야함
const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE =14; //우리의 공격력 보다 더 세기 때문에 운이 필요함 0과 14사이 
const STRONG_ATTACK_VALUE = 17; //강공격의 어택 밸류
const HEAL_VALUE =20; 
//공격은 10으로 설정 
// 최대값으로 처리된다 /vendor.js 로 0와 10 의 무작위 요소로 만듬
//상수 전역값은 대문자를 사용하고 단어를 구분할 땐 _ 를 사용 

const enteredValue = prompt('너와 몬스터의 최대 생명','100');
// 초기 최대 생명은 100 (문자열) parseInt 로 숫자로 바꿔줘야함 


let chosenMaxLife  = parseInt(enteredValue);
if (isNaN(chosenMaxLife) || chosenMaxLife <=0){
    chosenMaxLife = 100; //숫자가 아닌 값을 음수를 입력할 경우 디폴트 체력값을 정해줌
} //chosenMaxLife 입력한 숫자가 아닌 경우와
//parseInt의 결과도 숫자가 아니면 트수한 NaN 경우에 해당
//체력 값은 변하니 let으로 설정
//추후 사용자가 이 값을 설정하도록 할 것이기 때문에 전역이 아님

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


function endRound(){
    const initialPlayerLife =currentPlayerHealth;
    const PlayerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
   currentPlayerHealth -= PlayerDamage;

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
        reset();
   } else if (currentPlayerHealth <=0 && currentMonsterHealth >0) 
   {
    alert('you lost');
    reset();
   } else if (currentMonsterHealth <=0 && currentPlayerHealth <=0 ) { 
    alert('무승부');
    reset();//누가 이기던 상관없이 reset 하는 것 피가 0인경우를 확인하는 것 
   }

//    if(currentMonsterHealth <= 0 || currentPlayerHealth <=0){
//     reset();
//    }//이렇게도 초기화 가능 (중복줄이기)

} // 몬스터가 공격을 하고 승리했는지 무승부했는지 확인


//강공격과 공격의 공통된 부분을 없애주기 위해 만든 함수 
function attackMonster(mode) {
    let maxDamage;
    if(mode ==='ATTACK'){
        maxDamage =ATTACK_VALUE;
    } else if(mode ='STRONG_ATTACK') 
    {
        maxDamage = STRONG_ATTACK_VALUE;
    }
    
   const damage= dealMonsterDamage(maxDamage);
   
   currentMonsterHealth -=damage; 
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
    attackMonster("ATTACK");
}

//강공격 만들기
function strongAttackHandler(){
    
   attackMonster("STRONG_ATTACK");

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
    endRound();

}

attackBtn.addEventListener('click',attackHandler)
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',HealPlayerHandler);
