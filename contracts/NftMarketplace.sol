// SPDX-License-Identifier: MIT
// 1. List item
// 2. Cancel listing
// 3. Buy item
// 4. Update listing
// 5. Withdraw proceeds
// 6. Get listing
// 7. Get proceeds
// 8. Random comment

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Compile again pls

error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);
error NftMarketplace__NoProceeds();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__TheOwner();
error NftMarketplace__NotOwner();

contract NftMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        string action
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    modifier isListed(
        address nftAddress,
        uint256 tokenId,
        bool shouldBeListed
    ) {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (listedItem.price > 0 && shouldBeListed == false) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        } else if (listedItem.price <= 0 && shouldBeListed == true) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender,
        bool shouldBeOwner
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (owner != spender && shouldBeOwner == true) {
            revert NftMarketplace__NotOwner();
        } else if (owner == spender && shouldBeOwner == false) {
            revert NftMarketplace__TheOwner();
        }
        _;
    }

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isListed(nftAddress, tokenId, false)
        isOwner(nftAddress, tokenId, msg.sender, true)
    {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        address nftAddressTemp = nftAddress;
        uint256 tokenIdTemp = tokenId;
        uint256 priceTemp = price;
        s_listings[nftAddressTemp][tokenIdTemp] = Listing(
            priceTemp,
            msg.sender
        );
        emit ItemListed(
            msg.sender,
            nftAddressTemp,
            tokenIdTemp,
            priceTemp,
            "list_item"
        );
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isListed(nftAddress, tokenId, true)
        isOwner(nftAddress, tokenId, msg.sender, true)
    {
        uint256 price = s_listings[nftAddress][tokenId].price;
        delete s_listings[nftAddress][tokenId];
        emit ItemCanceled(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId, true)
        isOwner(nftAddress, tokenId, msg.sender, false)
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert NftMarketplace__PriceNotMet(
                nftAddress,
                tokenId,
                listedItem.price
            );
        }
        s_proceeds[listedItem.seller] += msg.value;
        delete s_listings[nftAddress][tokenId];
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        nonReentrant
        isListed(nftAddress, tokenId, true)
        isOwner(nftAddress, tokenId, msg.sender, true)
    {
        if (newPrice <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(
            msg.sender,
            nftAddress,
            tokenId,
            newPrice,
            "update_price"
        );
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NftMarketplace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed!");
    }

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
