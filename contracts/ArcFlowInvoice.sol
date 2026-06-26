// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ArcFlowInvoice
 * @notice Tokenizes vendor invoices as NFTs for financing on the Arc Network
 * @dev ERC-721 based invoice NFT with built-in liquidity marketplace
 */
contract ArcFlowInvoice is ERC721, Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    uint256 private _nextTokenId;

    struct Invoice {
        address vendor;
        address buyer;
        uint256 amount;
        uint256 dueDate;
        uint256 discountRate;   // basis points (e.g., 650 = 6.5%)
        uint256 fundedAmount;
        address funder;
        bool paid;
        bool defaulted;
        string description;
    }

    mapping(uint256 => Invoice) public invoices;

    event InvoiceMinted(uint256 indexed tokenId, address vendor, address buyer, uint256 amount);
    event InvoiceFunded(uint256 indexed tokenId, address funder, uint256 fundedAmount);
    event InvoicePaid(uint256 indexed tokenId, uint256 amount);
    event InvoiceDefaulted(uint256 indexed tokenId);

    constructor(address _usdc, address _owner) ERC721("ArcFlow Invoice", "ARCINV") Ownable(_owner) {
        usdc = IERC20(_usdc);
    }

    function mintInvoice(
        address buyer,
        uint256 amount,
        uint256 dueDate,
        uint256 discountRate,
        string calldata description
    ) external returns (uint256) {
        require(amount > 0, "Amount must be positive");
        require(dueDate > block.timestamp, "Due date must be future");
        require(discountRate <= 5000, "Discount rate too high");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        invoices[tokenId] = Invoice({
            vendor: msg.sender,
            buyer: buyer,
            amount: amount,
            dueDate: dueDate,
            discountRate: discountRate,
            fundedAmount: 0,
            funder: address(0),
            paid: false,
            defaulted: false,
            description: description
        });

        emit InvoiceMinted(tokenId, msg.sender, buyer, amount);
        return tokenId;
    }

    function fundInvoice(uint256 tokenId) external nonReentrant {
        Invoice storage inv = invoices[tokenId];
        require(inv.funder == address(0), "Already funded");
        require(!inv.paid && !inv.defaulted, "Invoice resolved");
        require(block.timestamp < inv.dueDate, "Invoice expired");

        uint256 payout = inv.amount - (inv.amount * inv.discountRate / 10000);
        require(usdc.transferFrom(msg.sender, inv.vendor, payout), "Transfer failed");

        inv.funder = msg.sender;
        inv.fundedAmount = payout;

        emit InvoiceFunded(tokenId, msg.sender, payout);
    }

    function settleInvoice(uint256 tokenId) external nonReentrant {
        Invoice storage inv = invoices[tokenId];
        require(inv.funder != address(0), "Not funded");
        require(!inv.paid, "Already paid");
        require(msg.sender == inv.buyer, "Only buyer");

        require(usdc.transferFrom(msg.sender, inv.funder, inv.amount), "Settlement failed");
        inv.paid = true;

        emit InvoicePaid(tokenId, inv.amount);
    }

    function markDefault(uint256 tokenId) external onlyOwner {
        invoices[tokenId].defaulted = true;
        emit InvoiceDefaulted(tokenId);
    }
}
