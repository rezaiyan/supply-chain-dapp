
export enum Role {
    Owner,
    Farmer,
    Distributor,
    Retailer,
    Consumer,
    Unknown,
}

export enum State {
    Harvested,
    Processed,
    Packed,
    ForSale,
    Sold,
    Shipped,
    Received,
    Purchased
}

export class Item {
    sku: number;
    upc: number;
    ownerID: string;
    originFarmerID: string;
    originFarmName: string;
    originFarmInformation: string;
    originFarmLatitude: string;
    originFarmLongitude: string;
    productID: number;
    productNotes: string;
    productPrice: number;
    itemState: State;
    distributorID: string;
    retailerID: string;
    consumerID: string;

    constructor(
        sku: number,
        upc: number,
        ownerID: string,
        originFarmerID: string,
        originFarmName: string,
        originFarmInformation: string,
        originFarmLatitude: string,
        originFarmLongitude: string,
        productID: number,
        productNotes: string,
        productPrice: number,
        itemState: State,
        distributorID: string,
        retailerID: string,
        consumerID: string
    ) {
        this.sku = sku;
        this.upc = upc;
        this.ownerID = ownerID;
        this.originFarmerID = originFarmerID;
        this.originFarmName = originFarmName;
        this.originFarmInformation = originFarmInformation;
        this.originFarmLatitude = originFarmLatitude;
        this.originFarmLongitude = originFarmLongitude;
        this.productID = productID;
        this.productNotes = productNotes;
        this.productPrice = productPrice;
        this.itemState = itemState;
        this.distributorID = distributorID;
        this.retailerID = retailerID;
        this.consumerID = consumerID;
    }
}
