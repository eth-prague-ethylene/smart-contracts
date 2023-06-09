import { BigNumber, Signer } from 'ethers';
import { Ethylene } from '../typechain-types/index';
import EthyleneArtifact from '../artifacts/contracts/Ethylene.sol/Ethylene.json';
import { ethers, waffle } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

const { deployContract } = waffle;
const { expect } = chai;
chai.use(chaiAsPromised);
let user: SignerWithAddress;
let contractOwner: SignerWithAddress;
let random: SignerWithAddress;
let Ethylene: Ethylene;

const DEFAULT_CURRENCY = '0x07865c6e87b9f70255377e024ace6630c1eaa37f'; //USDC GOERLI
const DEFAULT_LIVENESS = 300;
const CLAIM = 'I just planted 10 trees on';

function stringToBytes(input: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(input);
}

describe('Initialization of core functions', function () {
  beforeEach(async function () {
    [user, contractOwner] = await ethers.getSigners();

    Ethylene = (await deployContract(contractOwner, EthyleneArtifact, [
      DEFAULT_CURRENCY,
      DEFAULT_LIVENESS,
    ])) as Ethylene;
  });

  describe('Ethylene Contract', function () {
    describe('General Stuff', function () {
      it('should have proper owner', async function () {
        expect(await Ethylene.owner()).to.equal(contractOwner.address);
      });
      it('should have proper default currency address', async function () {
        expect((await Ethylene.defaultCurrency()).toLowerCase()).to.equal(
          DEFAULT_CURRENCY
        );
      });
      it('should have proper default liveness', async function () {
        expect(await Ethylene.defaultLiveness()).to.equal(DEFAULT_LIVENESS);
      });
    });
    describe('Oracle Interactions', function () {
      it('should be able to assert to oracle', async function () {
        const bytes = stringToBytes('adasds');
        // const id = await Ethylene.assertToOracle(bytes);
        console.log(await (await Ethylene.assertToOracle(bytes)).wait());
      });
    });
  });
});
