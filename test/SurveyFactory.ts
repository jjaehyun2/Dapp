import { expect } from "chai";
import { network } from "hardhat";

describe("SurveyFactory Contract", () => {
  let factory: any, owner: any, respondent1: any, respondent2: any;

  beforeEach(async () => {
    const { ethers } = await network.connect();
    [owner, respondent1, respondent2] = await ethers.getSigners();

    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"), // min_pool_amount
      ethers.parseEther("0.1"), // min_reward_amount
    ]);
  });

  it("should deploy with correct minimum amounts", async () => {
    // TODO: check min_pool_amount and min_reward_amount
    const { ethers } = await network.connect();
    expect(await factory.min_pool_amount()).to.equal(ethers.parseEther("50"));
    expect(await factory.min_reward_amount()).to.equal(
      ethers.parseEther("0.1"),
    );
  });

  it("should create a new survey when valid values are provided", async () => {
    // TODO: prepare SurveySchema and call createSurvey with msg.value
    const { ethers } = await network.connect();
    const surveySchema = {
      title: "설문조사 생성",
      description: "유효한 설문 생성테스트",
      targetNumber: 10,
      questions: [{ question: "질문", options: ["1", "2"] }],
    };

    const tx = await factory.createSurvey(surveySchema, {
      value: ethers.parseEther("50"),
    });

    // TODO: check event SurveyCreated emitted
    await expect(tx).to.emit(factory, "SurveyCreated");

    // TODO: check surveys array length increased
    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(1);
  });

  it("should revert if pool amount is too small", async () => {
    // TODO: expect revert when msg.value < min_pool_amount
    const { ethers } = await network.connect();
    const surveySchema = {
      title: "pool이 너무 작은 경우",
      description: "low pool amount",
      targetNumber: 10,
      questions: [{ question: "질문", options: ["1", "2"] }],
    };

    await expect(
      factory.createSurvey(surveySchema, {
        value: ethers.parseEther("49"),
      }),
    ).to.be.revertedWith("Insufficient pool amount");
  });

  it("should revert if reward amount per respondent is too small", async () => {
    // TODO: expect revert when msg.value / targetNumber < min_reward_amount
    const { ethers } = await network.connect();
    const surveySchema = {
      title: "reward가 너무 작은 경우",
      description: "Low Reward",
      targetNumber: 600,
      questions: [{ question: "질문", options: ["1", "2"] }],
    };

    await expect(
      factory.createSurvey(surveySchema, {
        value: ethers.parseEther("50"),
      }),
    ).to.be.revertedWith("Insufficient reward amount");
  });

  it("should store created surveys and return them from getSurveys", async () => {
    // TODO: create multiple surveys and check getSurveys output
    const { ethers } = await network.connect();
    const survey1 = {
      title: "Survey 1",
      description: "First Survey",
      targetNumber: 10,
      questions: [{ question: "질문1", options: ["1", "2"] }],
    };
    const survey2 = {
      title: "Survey 2",
      description: "Second Survey",
      targetNumber: 20,
      questions: [{ question: "질문2", options: ["1", "2"] }],
    };

    await factory.createSurvey(survey1, { value: ethers.parseEther("50") });
    await factory.createSurvey(survey2, { value: ethers.parseEther("50") });

    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(2); //갯수 확인
    expect(ethers.isAddress(surveys[0])).to.be.true; // 반환된 주소 확인
    expect(ethers.isAddress(surveys[1])).to.be.true;
  });
});
