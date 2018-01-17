pragma solidity ^0.4.7;
contract ERC20 {

}
contract DuboToken is ERC20 {

}
contract Dubo {
    mapping (address=>uint256) personalSum;
    uint256 sum = 0;
    uint256 gameCount = 0;
    mapping (uint256 => address) idMapGameAddress;
    event PlayEvent(address player, uint256 amount ,uint256 game_id);
    event newGameEvent(uint256 game_id,address gameAddress);

    function Dobo() public {
        
    }
    function play(uint256 game_id) {
        address player = msg.sender;
        personalSum[player] = personalSum[player] + msg.value;
        sum = sum + msg.value;
        PlayEvent(player,msg.value,game_id);
        /*
        
        call game
        
         */
    }
    function newGame(address gameAddress) public {
        idMapGameAddress[gameCount]=gameAddress;
        newGameEvent(gameCount,gameAddress);
        gameCount++;
    }
    function setGameAddress(uint256 game_id,address gameAddress) public {
        require(gameCount>game_id);
        idMapGameAddress[game_id]=gameAddress;
    }
}