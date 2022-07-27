//공격 버튼 부터 만들기 
//체력바를 줄어들게 만든다. 페력의 시작값을 불러와야함
const ATTACK_VALUE = 10;
//공격은 10으로 설정 
// 최대값으로 처리된다 /vendor.js 로 0와 10 의 무작위 요소로 만듬
//상수 전역값은 대문자를 사용하고 단어를 구분할 땐 _ 를 사용 

let chosenMaxLife  =100;
//체력 값은 변하니 let으로 설정
//추후 사용자가 이 값을 설정하도록 할 것이기 때문에 전역이 아님

//일단 몬스터 체력 100으로 고정 
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;





adjustHealthBars(chosenMaxLife);
//공격버튼을 체력을 낮추는 함수와 연결하고 싶다.
//vendor.js 파일에 있는 attackBtn을 사용할 것 
function attackHandler() {
    //공격을 가하는데 dealMonster이 있음 
   const damage= dealMonsterDamage(ATTACK_VALUE);
   //함수가 실행되는 중에 안바뀌니 상수
   //저장된 데미지를 통해 몬스터 체력 조정
   currentMonsterHealth -=damage; //데미지를 입음 
}

attackBtn.addEventListener('click',attackHandler)