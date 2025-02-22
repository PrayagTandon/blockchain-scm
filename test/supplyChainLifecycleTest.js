const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("SupplyChain Contract", () => {
  let supplyChain;

  beforeEach(async () => {
    const SupplyChain = await ethers.getContractFactory("SupplyChainLifecycle");
    supplyChain = await SupplyChain.deploy();
  });

  it("Should create a batch", async () => {
    await supplyChain.createBatch("Medicine", 100);
    const batch = await supplyChain.getBatch(0);
    expect(batch.name).to.equal("Medicine");
  });
});