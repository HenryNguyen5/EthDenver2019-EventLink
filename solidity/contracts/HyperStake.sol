pragma solidity 0.4.24;
import "chainlink/solidity/contracts/Chainlinked.sol";


contract HyperStake is Chainlinked  {
    mapping (address => uint256) balanceOf;
    address[] stakers;
    uint maxStake;
    string receiver;
    address receiversAddress;
    bytes32 specId;

    constructor (address _linkToken, address _oracle, uint _maxStakeEther, string _receiver) public {
        setLinkToken(_linkToken);
        setOracle(_oracle);
        specId = bytes32("17837b52542e4e1ab0f9f20f73e8a7a2");

        maxStake = _maxStakeEther * 1 ether;
        receiver = _receiver;
    }

    function getReceiver() public view returns (string) {
        return receiver;
    }

    function getMaxStake() public view returns (uint) {
        return maxStake;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getBalanceOfStaker(address user) public view returns (uint) {
        return balanceOf[user];
    }

    // not safe at all kek
    function stake() public payable {
        uint userBalance = balanceOf[msg.sender];
        if(userBalance == 0) {
            stakers.push(msg.sender);
        }
        if(userBalance + msg.value > maxStake){
            uint remainder = userBalance + msg.value - maxStake;
            balanceOf[msg.sender] = maxStake;
            msg.sender.transfer(remainder);
        } else {
            balanceOf[msg.sender] += msg.value;
        }
    }

    function refund() public {
        // TODO: should not refund until a set amount of blocks passes
        for (uint index = 0; index < stakers.length; index++) {
            stakers[index].transfer(balanceOf[stakers[index]]);
        }
        address burnAddress;
        selfdestruct(burnAddress);
    }

    // when staking contracts open
    // each contract has a keybase username associated to it on construction
    // once a payout is requested, the user
    // should verify the identity of the party before paying out
    // getRequest[0] = "http://localhost/verifyReceiver?receiver=ethglobal";
    function requestPayout(string subdomain) public { 
        // TODO: should not payout until a set amount of blocks passes
        Chainlink.Request memory req = newRequest(specId, this, this.fufillPayout.selector);
        req.add("get", concat("http://",subdomain,".ngrok.io/verifyReceiver?username=",receiver));
        chainlinkRequest(req, 1 ether);
        receiversAddress = msg.sender;
    }

    function fufillPayout(bytes32 _requestId, bool shouldPayout) public recordChainlinkFulfillment(_requestId) {
        if(shouldPayout){
            receiversAddress.transfer(getBalance());
        }
    }

    function concat(string memory str1, string memory str2, string memory str3, string memory str4) public pure returns (string memory) {
        return string(abi.encodePacked(str1, str2, str3, str4));
    }
}
