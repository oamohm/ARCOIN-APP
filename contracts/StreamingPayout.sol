// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title StreamingPayout
 * @notice Handles bulk USDC streaming payouts with pause/resume/stop functionality
 * @dev Deployed on Arc Network (Chain ID: 5042002)
 */
contract StreamingPayout is ReentrancyGuard, Ownable, Pausable {
    IERC20 public immutable usdc;
    
    struct StreamJob {
        bytes32 jobId;
        address initiator;
        uint256 totalAmount;
        uint256 disbursedAmount;
        uint256 recipientCount;
        bool active;
        bool paused;
        bool completed;
        string memo;
    }

    mapping(bytes32 => StreamJob) public jobs;
    mapping(bytes32 => mapping(uint256 => bool)) public paid;

    event JobCreated(bytes32 indexed jobId, address initiator, uint256 totalAmount, uint256 recipientCount);
    event PaymentSent(bytes32 indexed jobId, address indexed recipient, uint256 amount);
    event JobPaused(bytes32 indexed jobId);
    event JobResumed(bytes32 indexed jobId);
    event JobStopped(bytes32 indexed jobId, uint256 disbursedAmount);

    constructor(address _usdc, address _owner) Ownable(_owner) {
        usdc = IERC20(_usdc);
    }

    function createJob(
        bytes32 jobId,
        address[] calldata recipients,
        uint256[] calldata amounts,
        string calldata memo
    ) external whenNotPaused nonReentrant {
        require(recipients.length == amounts.length, "Length mismatch");
        require(jobs[jobId].initiator == address(0), "Job exists");

        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }

        require(usdc.transferFrom(msg.sender, address(this), total), "Transfer failed");

        jobs[jobId] = StreamJob({
            jobId: jobId,
            initiator: msg.sender,
            totalAmount: total,
            disbursedAmount: 0,
            recipientCount: recipients.length,
            active: true,
            paused: false,
            completed: false,
            memo: memo
        });

        emit JobCreated(jobId, msg.sender, total, recipients.length);
    }

    function processPayments(
        bytes32 jobId,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256[] calldata indices
    ) external onlyOwner nonReentrant {
        StreamJob storage job = jobs[jobId];
        require(job.active && !job.paused && !job.completed, "Job not active");

        for (uint256 i = 0; i < recipients.length; i++) {
            if (!paid[jobId][indices[i]]) {
                paid[jobId][indices[i]] = true;
                job.disbursedAmount += amounts[i];
                require(usdc.transfer(recipients[i], amounts[i]), "Payment failed");
                emit PaymentSent(jobId, recipients[i], amounts[i]);
            }
        }

        if (job.disbursedAmount >= job.totalAmount) {
            job.completed = true;
        }
    }

    function pauseJob(bytes32 jobId) external {
        StreamJob storage job = jobs[jobId];
        require(msg.sender == job.initiator || msg.sender == owner(), "Unauthorized");
        require(job.active && !job.paused, "Cannot pause");
        job.paused = true;
        emit JobPaused(jobId);
    }

    function resumeJob(bytes32 jobId) external {
        StreamJob storage job = jobs[jobId];
        require(msg.sender == job.initiator || msg.sender == owner(), "Unauthorized");
        require(job.active && job.paused, "Not paused");
        job.paused = false;
        emit JobResumed(jobId);
    }

    function stopJob(bytes32 jobId) external nonReentrant {
        StreamJob storage job = jobs[jobId];
        require(msg.sender == job.initiator || msg.sender == owner(), "Unauthorized");
        require(job.active, "Already stopped");
        job.active = false;

        uint256 remaining = job.totalAmount - job.disbursedAmount;
        if (remaining > 0) {
            require(usdc.transfer(job.initiator, remaining), "Refund failed");
        }

        emit JobStopped(jobId, job.disbursedAmount);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}
