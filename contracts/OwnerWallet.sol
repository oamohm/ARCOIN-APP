// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title OwnerWallet
 * @notice Collects ARCOIN platform fees (transaction fees, subscriptions)
 * @dev Owner can update the receiver address at any time
 */
contract OwnerWallet is Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    address public feeReceiver;
    uint256 public totalCollected;
    uint256 public constant PLATFORM_FEE_BPS = 10; // 0.1%

    event FeeReceived(address indexed from, uint256 amount, string feeType);
    event ReceiverUpdated(address indexed oldReceiver, address indexed newReceiver);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(address _usdc, address _feeReceiver) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        feeReceiver = _feeReceiver;
    }

    function collectFee(uint256 amount, string calldata feeType) external nonReentrant {
        uint256 fee = (amount * PLATFORM_FEE_BPS) / 10000;
        require(usdc.transferFrom(msg.sender, address(this), fee), "Fee transfer failed");
        totalCollected += fee;
        emit FeeReceived(msg.sender, fee, feeType);
    }

    function updateFeeReceiver(address newReceiver) external onlyOwner {
        require(newReceiver != address(0), "Zero address");
        emit ReceiverUpdated(feeReceiver, newReceiver);
        feeReceiver = newReceiver;
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "Nothing to withdraw");
        require(usdc.transfer(feeReceiver, balance), "Withdrawal failed");
        emit Withdrawn(feeReceiver, balance);
    }
}
