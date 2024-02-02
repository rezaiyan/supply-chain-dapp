import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('ConsumerRole', function () {
    let consumerRole: any;
    let consumerAddress: string;
    let otherAddress: string;

    beforeEach(async function () {
        const ConsumerRole = await ethers.getContractFactory('ConsumerRole');
        consumerRole = await ConsumerRole.deploy();

        const [consumerSigner, otherSigner] = await ethers.getSigners();
        consumerAddress = await consumerSigner.getAddress();
        otherAddress = await otherSigner.getAddress();

    });

    it('Should return true for a consumer', async function () {
                expect(await consumerRole.isConsumer(consumerAddress)).to.equal(true);
    });

    it('Should not add the same consumer', async function () {
        try {
            await consumerRole.addConsumer(consumerAddress);
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Roles: account already has role');
        }
    });

    it('Should add a consumer', async function () {
        await consumerRole.addConsumer(otherAddress);
        expect(await consumerRole.isConsumer(otherAddress)).to.equal(true);
    });

    it('Should renounce the consumer role', async function () {
        await consumerRole.renounceConsumer();
        expect(await consumerRole.isConsumer(consumerAddress)).to.equal(false);
    });

    it('Should not allow non-consumers to add a consumer', async function () {
        const [_, otherSigner] = await ethers.getSigners();
        try {
            await consumerRole.connect(otherSigner).addConsumer(otherAddress);
            // If the above line does not throw an error, the test should fail.
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Caller is not a consumer');
        }
    });

    it('Should not allow non-consumers to renounce the consumer role', async function () {
        const [_, otherSigner] = await ethers.getSigners();
        try {
            await consumerRole.connect(otherSigner).renounceConsumer();
            // If the above line does not throw an error, the test should fail.
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.include('Roles: account does not have role');
        }
    });
});
