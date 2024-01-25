import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('RetailerRole', function () {
    let retailerRole: any;
    let retailerAddress: string;
    let otherAddress: string;

    beforeEach(async function () {
        const RetailerRole = await ethers.getContractFactory('RetailerRole');
        retailerRole = await RetailerRole.deploy();

        const [retailerSigner, otherSigner] = await ethers.getSigners();
        retailerAddress = await retailerSigner.getAddress();
        otherAddress = await otherSigner.getAddress();

    });

    it('Should return true for a retailer', async function () {
        expect(await retailerRole.isRetailer(retailerAddress)).to.equal(true);
    });

    it('Should not add a same retailer', async function () {
        try {
            await retailerRole.addRetailer(retailerAddress);
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Roles: account already has role');
        }
    });

    it('Should add a retailer', async function () {
        await retailerRole.addRetailer(otherAddress);
        expect(await retailerRole.isRetailer(otherAddress)).to.equal(true);
    });

    it('Should renounce the retailer role', async function () {
        await retailerRole.renounceRetailer();
        expect(await retailerRole.isRetailer(retailerAddress)).to.equal(false);
    });

    it('Should not allow non-retailers to add a retailer', async function () {
        const [_, otherSigner] = await ethers.getSigners();
        try {
            await retailerRole.connect(otherSigner).addRetailer(otherAddress);
            // If the above line does not throw an error, the test should fail.
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Caller is not a retailer');
        }
    });

    it('Should not allow non-retailers to renounce the retailer role', async function () {
        const [_, otherSigner] = await ethers.getSigners();
        try {
            await retailerRole.connect(otherSigner).renounceRetailer();
            // If the above line does not throw an error, the test should fail.
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Roles: account does not have role');
        }
    });


});
