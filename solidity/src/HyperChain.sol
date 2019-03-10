// pragma solidity 0.4.24;
// import "../../node_modules/chainlink/solidity/contracts/Chainlinked.sol";
// import "./HyperStake.sol";

// contract HyperChain {
//     address public owner;
//     address public node;
//     bytes32 public specId;

//     constructor(address _node, address _link, address _oracle, bytes32 _specId) {
//         setLinkToken(_link);
//         setOracle(_oracle);
//         owner = msg.sender;
//         specId = _specId;
//         node = _node;
//     }

//     function createStakingContracts(bytes32 amt, string receiver) external {
//         HyperStake hyperStake = new HyperStake( uint(amt), receiver);
//     }
// }