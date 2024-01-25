import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('SupplyChain', async function () {
    let supplyChain: any;
    let owner: any;
    let farmer: any;
    let distributor: any;
    let retailer: any;
    let consumer: any;

    beforeEach(async function () {
        const SupplyChain = await ethers.getContractFactory('SupplyChain');
        supplyChain = await SupplyChain.deploy();

        [owner, farmer, distributor, retailer, consumer] = await ethers.getSigners();

        await supplyChain.connect(owner).addFarmer(farmer);
        await supplyChain.connect(owner).addDistributor(distributor);
        await supplyChain.connect(owner).addRetailer(retailer);
        await supplyChain.connect(owner).addConsumer(consumer);
    });
    it('should allow a farmer to harvest, process, pack, sell, ship, receive, and purchase an item', async function () {
        const upc = 1;
        const productPrice = ethers.parseEther('1');


        await supplyChain.connect(farmer).harvestItem(upc, farmer.address, "Farm1", "Farm Info", "123.456", "789.012", "Product Notes");
        await supplyChain.connect(farmer).processItem(upc);
        await supplyChain.connect(farmer).packItem(upc);
        await supplyChain.connect(farmer).sellItem(upc, productPrice);
        await supplyChain.connect(distributor).buyItem(upc, { value: productPrice });
        await supplyChain.connect(distributor).shipItem(upc);
        await supplyChain.connect(retailer).receiveItem(upc);
        await supplyChain.connect(consumer).purchaseItem(upc);
        const [, fetchedUpc, , , , , , ,] = await supplyChain.fetchItemBufferTwo(upc);

        expect(fetchedUpc).to.equal(upc);
    });

    it('should not allow a non-farmer to harvest an item', async function () {
        const upc = 1;
        try {
            await supplyChain.connect(distributor).harvestItem(upc, distributor.address, "Farm1", "Farm Info", "123.456", "789.012", "Product Notes");
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Caller is not a farmer');
        }
    });

    it('should not allow a distributor to ship an item without buying it', async function () {
        const upc = 1;
        try {
            await supplyChain.connect(distributor).shipItem(upc);
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Invalid item state');
        }
    });

    it('should revert if a distributor does not send enough funds to buy an item', async function () {
        const upc = 1;
        try {
            await supplyChain.connect(farmer).harvestItem(upc, farmer.address, "Farm1", "Farm Info", "123.456", "789.012", "Product Notes");
            await supplyChain.connect(farmer).processItem(upc);
            await supplyChain.connect(farmer).packItem(upc);
            await supplyChain.connect(farmer).sellItem(upc, ethers.parseEther('1'));
            await supplyChain.connect(distributor).buyItem(upc, { value: ethers.parseEther('0.5') });
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Insufficient funds');
        }
    });

    it('should not allow a non-distributor to buy an item', async function () {
        const upc = 1;
        const productPrice = ethers.parseEther('1');
        try {
            await supplyChain.connect(farmer).harvestItem(upc, farmer.address, "Farm1", "Farm Info", "123.456", "789.012", "Product Notes");
            await supplyChain.connect(farmer).processItem(upc);
            await supplyChain.connect(farmer).packItem(upc);
            await supplyChain.connect(farmer).sellItem(upc, productPrice);
            await supplyChain.connect(consumer).buyItem(upc, { value: productPrice });
            
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Caller is not a distributor');
        }
    });
});
