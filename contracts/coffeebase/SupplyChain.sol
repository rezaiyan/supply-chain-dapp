// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../coffeecore/Ownable.sol";

contract SupplyChain is Ownable {
    address owner;
    uint upc;
    uint sku;
    uint256[] private itemIds;
    mapping(uint => Item) items;
    mapping(uint => string[]) itemsHistory;

    enum State {
        Harvested,
        Processed,
        Packed,
        ForSale,
        Sold,
        Shipped,
        Received,
        Purchased
    }

    State constant defaultState = State.Harvested;

    struct Item {
        uint sku;
        uint upc;
        address ownerID;
        address originFarmerID;
        string originFarmName;
        string originFarmInformation;
        string originFarmLatitude;
        string originFarmLongitude;
        uint productID;
        string productNotes;
        uint productPrice;
        State itemState;
        address distributorID;
        address retailerID;
        address consumerID;
    }

    event Harvested(uint upc);
    event Processed(uint upc);
    event Packed(uint upc);
    event ForSale(uint upc);
    event Sold(uint upc);
    event Shipped(uint upc);
    event Received(uint upc);
    event Purchased(uint upc);

    modifier verifyCaller(address _address) {
        require(msg.sender == _address, "Caller verification failed");
        _;
    }


    modifier paidEnough(uint _upc) {
        require(msg.value >= items[_upc].productPrice, "Insufficient funds");
        _;
    }

    modifier inState(uint _upc, State _state) {
        require(items[_upc].itemState == _state, "Invalid item state");
        _;
    }

    constructor() {
        owner = msg.sender;
        sku = 1;
        upc = 1;
    }

    function kill() public onlyOwner {
        selfdestruct(payable(owner));
    }

    function harvestItem(
        uint _upc,
        address _originFarmerID,
        string memory _originFarmName,
        string memory _originFarmInformation,
        string memory _originFarmLatitude,
        string memory _originFarmLongitude,
        string memory _productNotes
    ) public onlyFarmer {
        sku += 1;
        itemIds.push(_upc);
        items[_upc] = Item({
            sku: sku,
            upc: _upc,
            ownerID: _originFarmerID,
            originFarmerID: _originFarmerID,
            originFarmName: _originFarmName,
            originFarmInformation: _originFarmInformation,
            originFarmLatitude: _originFarmLatitude,
            originFarmLongitude: _originFarmLongitude,
            productID: _upc + sku,
            productNotes: _productNotes,
            productPrice: 0,
            itemState: defaultState,
            distributorID: address(0),
            retailerID: address(0),
            consumerID: address(0)
        });
        emit Harvested(_upc);
    }

    function processItem(
        uint _upc
    )
        public
        inState(_upc, State.Harvested)
        verifyCaller(msg.sender)
        onlyFarmer
    {
        Item storage item = items[_upc];
        item.itemState = State.Processed;

        emit Processed(_upc);
    }

    function packItem(
        uint _upc
    )
        public
        inState(_upc, State.Processed)
        verifyCaller(msg.sender)
        onlyFarmer
    {
        Item storage item = items[_upc];
        item.itemState = State.Packed;

        emit Packed(_upc);
    }

    function sellItem(
        uint _upc,
        uint _price
    ) public inState(_upc, State.Packed) verifyCaller(msg.sender) onlyFarmer {
        Item storage item = items[_upc];
        item.productPrice = _price;
        item.itemState = State.ForSale;

        emit ForSale(_upc);
    }

    function buyItem(
        uint _upc
    )
        public
        payable
        inState(_upc, State.ForSale)
        paidEnough(_upc)
        onlyDistributor
    {
        Item storage item = items[_upc];
        item.distributorID = msg.sender;
        item.ownerID = msg.sender;
        item.itemState = State.Sold;

        uint productPrice = item.productPrice;
        address payable originFarmer = payable(item.originFarmerID);

        (bool success, ) = originFarmer.call{value: productPrice}("");
        require(success, "Transfer failed");


        returnAmount(_upc, msg.sender);

        emit Sold(_upc);
    }

    function shipItem(
        uint _upc
    )
        public
        inState(_upc, State.Sold)
        verifyCaller(msg.sender)
        onlyDistributor
    {
        Item storage item = items[_upc];
        item.itemState = State.Shipped;

        emit Shipped(_upc);
    }

    function receiveItem(
        uint _upc
    )
        public
        inState(_upc, State.Shipped)
        verifyCaller(msg.sender)
        onlyRetailer
    {
        Item storage item = items[_upc];
        item.ownerID = msg.sender;
        item.retailerID = msg.sender;
        item.itemState = State.Received;

        emit Received(_upc);
    }

    function purchaseItem(
        uint _upc
    )
        public
        inState(_upc, State.Received)
        verifyCaller(msg.sender)
        onlyConsumer
    {
        Item storage item = items[_upc];
        item.ownerID = msg.sender;
        item.consumerID = msg.sender;
        item.itemState = State.Purchased;

        emit Purchased(_upc);
    }

    function fetchItemBufferOne(
        uint _upc
    )
        public
        view
        returns (
            uint,
            uint,
            address,
            address,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        Item memory item = items[_upc];
        return (
            item.sku,
            item.upc,
            item.ownerID,
            item.originFarmerID,
            item.originFarmName,
            item.originFarmInformation,
            item.originFarmLatitude,
            item.originFarmLongitude
        );
    }

    function fetchItemBufferTwo(
        uint _upc
    )
        public
        view
        returns (
            uint,
            uint,
            uint,
            string memory,
            uint,
            uint,
            address,
            address,
            address
        )
    {
        Item memory item = items[_upc];
        return (
            item.sku,
            item.upc,
            item.productID,
            item.productNotes,
            item.productPrice,
            uint(item.itemState),
            item.distributorID,
            item.retailerID,
            item.consumerID
        );
    }

    function getAllItems() public view returns (Item[] memory) {
        uint256 totalItems = itemIds.length;
        Item[] memory allItems = new Item[](totalItems);

        for (uint256 i = 0; i < totalItems; i++) {
            uint256 _upc = itemIds[i];
            allItems[i] = items[_upc];
        }

        return allItems;
    }

    function returnAmount(uint _upc, address _address) internal {
        uint price = items[_upc].productPrice;
        uint amountToReturn = msg.value - price;
        payable(_address).transfer(amountToReturn);
    }
}
