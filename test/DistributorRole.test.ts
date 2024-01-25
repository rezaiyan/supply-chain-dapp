import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('DistributorRole', function () {
    let distributorRole: any;
    let distributorAddress: string;
    let otherAddress: string;

    beforeEach(async function () {
        const DistributorRole = await ethers.getContractFactory('DistributorRole');
        distributorRole = await DistributorRole.deploy();

        const [distributorSigner, otherSigner] = await ethers.getSigners();
        distributorAddress = await distributorSigner.getAddress();
        otherAddress = await otherSigner.getAddress();

    });

    it('Should return true for a distributor', async function () {
        expect(await distributorRole.isDistributor(distributorAddress)).to.equal(true);
    });

    it('Should not add the same distributor', async function () {
        try {
            await distributorRole.addDistributor(distributorAddress);
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Roles: account already has role');
        }
    });

    it('Should add a distributor', async function () {
        await distributorRole.addDistributor(otherAddress);
        expect(await distributorRole.isDistributor(otherAddress)).to.equal(true);
    });

    it('Should renounce the distributor role', async function () {
        await distributorRole.renounceDistributor();
        expect(await distributorRole.isDistributor(distributorAddress)).to.equal(false);
    });

    it('Should not allow non-distributors to add a distributor', async function () {
        const [_, otherSigner] = await ethers.getSigners();
        try {
            await distributorRole.connect(otherSigner).addDistributor(otherAddress);
            // If the above line does not throw an error, the test should fail.
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Caller is not a distributor');
        }
    });

    it('Should not allow non-distributors to renounce the distributor role', async function () {
        const [_, otherSigner] = await ethers.getSigners();
        try {
            await distributorRole.connect(otherSigner).renounceDistributor();
            // If the above line does not throw an error, the test should fail.
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Roles: account does not have role');
        }
    });
});
