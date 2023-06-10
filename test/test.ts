import { BigNumber, Signer } from 'ethers';
import { Ethylene } from '../typechain-types/index';
import EthyleneArtifact from '../artifacts/contracts/Ethylene.sol/Ethylene.json';
import { ethers, waffle } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
const { mine } = require('@nomicfoundation/hardhat-network-helpers');

const { deployContract } = waffle;
const { expect } = chai;
chai.use(chaiAsPromised);
let user: SignerWithAddress;
let contractOwner: SignerWithAddress;
let USDC_WHALE: SignerWithAddress;
let Ethylene: Ethylene;

const DEFAULT_CURRENCY = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'; //wmatic mumbai
const DEFAULT_LIVENESS = 60;
const CLAIM = 'Hello World';
const LENS_ID = '18ad653a-af18-4be5-9246-06be8dcaf3f9';
const OPTIMISTIC_ORACLE_V3_ADDRESS =
  '0xAfAE2dD69F115ec26DFbE2fa5a8642D94D7Cd37E'; // MUMBAI

function stringToBytes(input: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(input);
}

function bytesToString(bytes: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

describe('Initialization of core functions', function () {
  beforeEach(async function () {
    [user, contractOwner] = await ethers.getSigners();

    Ethylene = (await deployContract(contractOwner, EthyleneArtifact, [
      DEFAULT_CURRENCY,
      DEFAULT_LIVENESS,
      OPTIMISTIC_ORACLE_V3_ADDRESS,
    ])) as Ethylene;

    // USDC_WHALE = await ethers.getImpersonatedSigner(
    //   '0x03939E53DD4627F9780550F4FEDAc5715Ae52F99'
    // );
  });

  describe('Ethylene Contract', function () {
    describe('General Stuff', function () {
      it('should have proper owner', async function () {
        expect(await Ethylene.owner()).to.equal(contractOwner.address);
      });
      it('should have proper default currency address', async function () {
        expect((await Ethylene.defaultCurrency()).toLowerCase()).to.equal(
          DEFAULT_CURRENCY.toLowerCase()
        );
      });
      it('should have proper default liveness', async function () {
        expect(await Ethylene.defaultLiveness()).to.equal(DEFAULT_LIVENESS);
      });
    });
    describe('Oracle Interactions', function () {
      it('should be able to assert to oracle', async function () {
        const claimBytes = stringToBytes(CLAIM);
        const lensIdBytes = stringToBytes(LENS_ID);
        await Ethylene.assertToOracle(claimBytes, lensIdBytes);
        await expect(Ethylene.assertToOracle(claimBytes, lensIdBytes)).to.be
          .fulfilled;
      });
      it('should be able to get assertion data', async function () {
        const claimBytes = stringToBytes(CLAIM);
        const lensIdBytes = stringToBytes(LENS_ID);
        await Ethylene.assertToOracle(claimBytes, lensIdBytes);
        await expect(Ethylene.assertToOracle(claimBytes, lensIdBytes)).to.be
          .fulfilled;

        await expect(Ethylene.getAssertionData(lensIdBytes)).to.be.fulfilled;
      });
      it('should not be able to get assertion result before settlement', async function () {
        const claimBytes = stringToBytes(CLAIM);
        const lensIdBytes = stringToBytes(LENS_ID);
        await expect(Ethylene.assertToOracle(claimBytes, lensIdBytes)).to.be
          .fulfilled;
        await expect(
          Ethylene.getAssertionResult(lensIdBytes)
        ).to.be.rejectedWith('Assertion not settled');
      });
      it('should not be able to settle assertion before it expired ', async function () {
        const claimBytes = stringToBytes(CLAIM);
        const lensIdBytes = stringToBytes(LENS_ID);
        await expect(Ethylene.assertToOracle(claimBytes, lensIdBytes)).to.be
          .fulfilled;
        await expect(Ethylene.settleAssertion(lensIdBytes)).to.be.rejectedWith(
          'Assertion not expired'
        );
      });
      it('should be able to settle the assertion', async function () {
        const EthyleneWithZeroExpirationTime = (await deployContract(
          contractOwner,
          EthyleneArtifact,
          [DEFAULT_CURRENCY, 0, OPTIMISTIC_ORACLE_V3_ADDRESS]
        )) as Ethylene;

        const claimBytes = stringToBytes(CLAIM);
        const lensIdBytes = stringToBytes(LENS_ID);
        await expect(
          EthyleneWithZeroExpirationTime.assertToOracle(claimBytes, lensIdBytes)
        ).to.be.fulfilled;
        await expect(
          EthyleneWithZeroExpirationTime.settleAssertion(lensIdBytes)
        ).to.be.fulfilled;
      });
      it('should be able to get assertion result after settlement', async function () {
        const EthyleneWithZeroExpirationTime = (await deployContract(
          contractOwner,
          EthyleneArtifact,
          [DEFAULT_CURRENCY, 0, OPTIMISTIC_ORACLE_V3_ADDRESS]
        )) as Ethylene;

        const claimBytes = stringToBytes(CLAIM);
        const lensIdBytes = stringToBytes(LENS_ID);
        await expect(
          EthyleneWithZeroExpirationTime.assertToOracle(claimBytes, lensIdBytes)
        ).to.be.fulfilled;

        await expect(
          EthyleneWithZeroExpirationTime.settleAssertion(lensIdBytes)
        ).to.be.fulfilled;

        expect(
          await EthyleneWithZeroExpirationTime.getAssertionResult(lensIdBytes)
        ).to.be.true;
      });
      it('should not be able to dispute when expired', async function () {
        const EthyleneWithZeroExpirationTime = (await deployContract(
          contractOwner,
          EthyleneArtifact,
          [DEFAULT_CURRENCY, 0, OPTIMISTIC_ORACLE_V3_ADDRESS]
        )) as Ethylene;
        const OptimisticOracleV3 = await ethers.getContractAt(
          'IOptimisticOracleV3Extended',
          OPTIMISTIC_ORACLE_V3_ADDRESS
        );

        const claimBytes = stringToBytes(CLAIM);
        const lensIdBytes = stringToBytes(LENS_ID);

        await expect(
          EthyleneWithZeroExpirationTime.assertToOracle(claimBytes, lensIdBytes)
        ).to.be.fulfilled;

        const assertionId =
          await EthyleneWithZeroExpirationTime.getAssertionIdByLensPostId(
            lensIdBytes
          );

        await expect(
          OptimisticOracleV3.disputeAssertion(assertionId, user.address)
        ).to.be.revertedWith('Assertion is expired');
      });
      it.skip('should be able to get assertion result after settlement when disputed', async function () {
        const OptimisticOracleV3 = await ethers.getContractAt(
          'IOptimisticOracleV3Extended',
          OPTIMISTIC_ORACLE_V3_ADDRESS
        );

        const claimBytes = stringToBytes(CLAIM);
        const lensIdBytes = stringToBytes(LENS_ID);

        await expect(Ethylene.assertToOracle(claimBytes, lensIdBytes)).to.be
          .fulfilled;

        const assertionId = await Ethylene.getAssertionIdByLensPostId(
          lensIdBytes
        );

        await expect(
          OptimisticOracleV3.disputeAssertion(assertionId, user.address)
        ).to.be.fulfilled;

        // TODO: NEEDS SOME ADDITIONAL STEPS TO MAKE IT WORK

        // await mine(150);

        await Ethylene.settleAssertion(lensIdBytes);

        // await expect(
        //   Ethylene.settleAssertion(lensIdBytes)
        // ).to.be.fulfilled;

        // expect(
        //   await Ethylene.getAssertionResult(lensIdBytes)
        // ).to.be.true;

        // expect(
        //   await Ethylene.getAssertionResult(lensIdBytes)
        // ).to.be.false;
      });
    });
  });
});
