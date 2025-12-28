import { expect } from "chai";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}
it("Survey init", async () => {
  const { ethers } = await network.connect();
  const title = "막무가내 설문조사";
  const description = "중앙화된 설문조사";
  const questions: Question[] = [
    {
      question: "누가 응답을 관리",
      options: ["구글폼 운영자", "블록체인"],
    },
  ];
  const s = await ethers.deployContract("Survey", [
    title,
    description,
    questions,
  ]);
  const _title = await s.title();
  const _description = await s.description();
  const _questions = (await s.getquestions()) as Question[];
  expect(_title).eq(title);
  expect(_description).eq(description);
  expect(_questions[0].options).deep.eq(questions[0].options);

  const signers = await ethers.getSigners();
  const respondent = signers[1];
  await s.connect(respondent);
  s.submitAnswer({
    respondent: respondent.address,
    answers: [1],
  });
  console.log(await s.getAnswers());
});
