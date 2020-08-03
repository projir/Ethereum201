pragma solidity 0.5.12;
import "./random.sol";

contract CoinFlip is Random {
    
    uint private balance;
    
    address internal owner;

    event betResult(uint winnings, uint balance);

    struct Punter {
        uint balance;
        uint winnings;
        uint bet;
    }
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Sender is not owner");
        _; // continue execution
    }

    mapping(address => Punter) private punters;
    mapping(bytes32 => address) private queries;
    
    function makeBet() public payable {
        require(msg.value > 0, "Payment must be greater than zero");

        Punter storage punter = punters[msg.sender];
        punter.bet = msg.value;

        bytes32 queryId = requestRandomNumber();
        queries[queryId] = msg.sender;
    }

    function onCallback(bytes32 queryId, uint256 randomNumber) internal {
        address sender = queries[queryId];
        if (sender == address(0)) {
            return;
        }

        uint256 result = randomNumber % 2;

        Punter storage punter = punters[sender];

        if (result == 1) {
            punter.winnings = punter.bet * 2;
            punter.balance += punter.winnings;
        } else {
            punter.winnings = 0;
            balance += punter.bet;
        }
        punter.bet = 0;

        delete queries[queryId];

        emit betResult(punter.winnings, punter.balance);
    }
    
    function withdrawBalance() public returns (uint) {
        Punter storage punter = punters[msg.sender];
        require(punter.balance > 0, "Nothing to withdraw");

        uint toTransfer = punter.balance;
        punter.balance = 0; // change state BEFORE transfer

        msg.sender.transfer(toTransfer); // revert on failure
        return toTransfer;
    }
    
    function getBalance() public view returns (uint) {
        return punters[msg.sender].balance;
    }

    function getWinning() public view returns (uint) {
        return punters[msg.sender].winnings;
    }

    function withdraw() public onlyOwner returns (uint) {
        uint toTransfer = balance;
        balance = 0; // change state BEFORE transfer

        msg.sender.transfer(toTransfer); // revert on failure
        return toTransfer;
    }
}