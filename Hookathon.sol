// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPancakeRouter {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
}

contract ExclusiveAccessPools {
    struct User {
        uint256 tradeCount;
        uint256 totalVolume;
        bool eligible;
    }

    mapping(address => User) public users;
    address[] public exclusivePools;
    address public pancakeRouterAddress; // Address of PancakeSwap router
    IPancakeRouter pancakeRouter;

    uint256 public minTradeCount = 10;
    uint256 public minVolume = 1 ether; // 1 BNB

    constructor(address _pancakeRouterAddress) {
        pancakeRouterAddress = _pancakeRouterAddress;
        pancakeRouter = IPancakeRouter(_pancakeRouterAddress);
    }

    function registerTrade(uint256 volume) public {
        users[msg.sender].tradeCount += 1;
        users[msg.sender].totalVolume += volume;

        if (users[msg.sender].tradeCount >= minTradeCount && users[msg.sender].totalVolume >= minVolume) {
            users[msg.sender].eligible = true;
        }
    }

    function createExclusivePool() public {
        require(users[msg.sender].eligible, "Not eligible for exclusive pool");
        exclusivePools.push(msg.sender); 
    }

    function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired) public {
        require(users[msg.sender].eligible, "Not eligible to add liquidity");


        pancakeRouter.addLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            0, 
            0, 
            msg.sender, // recipient
            block.timestamp // deadline
        );
    }
}
