// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AutonomousAgent
 * @notice On-chain autonomous financial agent for auto-save, bill pay, tax optimization
 * @dev Configured via 4 parameters: goal, risk, budget, jurisdiction
 */
contract AutonomousAgent is Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;

    enum RiskLevel { Conservative, Moderate, Aggressive }

    struct AgentConfig {
        address user;
        string goal;
        RiskLevel riskTolerance;
        uint256 monthlyBudget;
        string legalJurisdiction;
        bool active;
        uint256 totalSaved;
        uint256 totalOptimized;
        uint256 lastActionTimestamp;
    }

    mapping(address => AgentConfig) public agents;

    event AgentConfigured(address indexed user, string goal, RiskLevel risk, uint256 budget);
    event AutoSaveExecuted(address indexed user, uint256 amount, address vault);
    event AgentPaused(address indexed user);
    event AgentActivated(address indexed user);

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }

    function configureAgent(
        string calldata goal,
        uint8 riskLevel,
        uint256 monthlyBudget,
        string calldata jurisdiction
    ) external {
        require(riskLevel <= 2, "Invalid risk level");
        agents[msg.sender] = AgentConfig({
            user: msg.sender,
            goal: goal,
            riskTolerance: RiskLevel(riskLevel),
            monthlyBudget: monthlyBudget,
            legalJurisdiction: jurisdiction,
            active: true,
            totalSaved: 0,
            totalOptimized: 0,
            lastActionTimestamp: block.timestamp
        });
        emit AgentConfigured(msg.sender, goal, RiskLevel(riskLevel), monthlyBudget);
    }

    function executeAutoSave(address user, address vault, uint256 amount) external onlyOwner nonReentrant {
        AgentConfig storage config = agents[user];
        require(config.active, "Agent not active");
        require(usdc.transferFrom(user, vault, amount), "Auto-save failed");
        config.totalSaved += amount;
        config.lastActionTimestamp = block.timestamp;
        emit AutoSaveExecuted(user, amount, vault);
    }

    function pauseAgent() external {
        agents[msg.sender].active = false;
        emit AgentPaused(msg.sender);
    }

    function activateAgent() external {
        agents[msg.sender].active = true;
        emit AgentActivated(msg.sender);
    }
}
