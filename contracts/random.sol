pragma solidity >= 0.5.0 < 0.6.0;
import "./provableAPI.sol";

contract Random is usingProvable {
    
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;

    event randomNumberLog(string msg, uint256 randomNumber);

    constructor () public {
        requestRandomNumber();
    }
    
    function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {
        require(msg.sender == provable_cbAddress(), "Callback failed on provable address");
        
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result)));
        
        emit randomNumberLog("Random number callback", randomNumber);

        onCallback(_queryId, randomNumber);
    }

    function onCallback(bytes32 queryId, uint256 randomNumber) internal {
        
    }

    function requestRandomNumber() public payable returns (bytes32) {
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        bytes32 queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );

        emit randomNumberLog("Requesting random number", 0);

        return queryId;
    }
    
}
