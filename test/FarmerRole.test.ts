import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('FarmerRole', function () {
    let farmerRole: any;
    let farmerAddress: string;
    let otherAddress: string;

    beforeEach(async function () {
        const FarmerRole = await ethers.getContractFactory('FarmerRole');
        farmerRole = await FarmerRole.deploy();

        const [farmerSigner, otherSigner] = await ethers.getSigners();
        farmerAddress = await farmerSigner.getAddress();
        otherAddress = await otherSigner.getAddress();

    });

    it('Should return true for a farmer', async function () {
        expect(await farmerRole.isFarmer(farmerAddress)).to.equal(true);
    });

    it('Should not add the same farmer', async function () {
        try {
            await farmerRole.addFarmer(farmerAddress);
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Roles: account already has role');
        }
    });

    it('Should add a farmer', async function () {
        await farmerRole.addFarmer(otherAddress);
        expect(await farmerRole.isFarmer(otherAddress)).to.equal(true);
    });

    it('Should renounce the farmer role', async function () {
        await farmerRole.renounceFarmer();
        expect(await farmerRole.isFarmer(farmerAddress)).to.equal(false);
    });

    it('Should not allow non-farmers to add a farmer', async function () {
        const [_, otherSigner] = await ethers.getSigners();
        try {
            await farmerRole.connect(otherSigner).addFarmer(otherAddress);
            // If the above line does not throw an error, the test should fail.
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Caller is not a farmer');
        }
    });

    it('Should not allow non-farmers to renounce the farmer role', async function () {
        const [_, otherSigner] = await ethers.getSigners();
        try {
            await farmerRole.connect(otherSigner).renounceFarmer();
            // If the above line does not throw an error, the test should fail.
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Roles: account does not have role');
        }
    });
});
