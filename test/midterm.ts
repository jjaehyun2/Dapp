// it("Survey init", async()=>{
//   const {ethers} = await network.connect();
//   const title ="설문조사";
//   const description = "@@조사@@";
//   const questions : Question[]= [
//     {
//       question:"questions",
//       options:["옵션","11"],
//     }
//   ]
//   // const s = await ethers.deployContract("Survey",[ //0번 계좌가 default로 배포
//   //   title,
//   //   description,
//   //   questions
//   // ]);
//   // const _title = await s.title();
//   // const _desc = await s.description();
//   // const _question = (await s.getQuestions()) as Question[];
//   // expect(_title).eq(title);
//   // expect(_desc).eq(description);
//   // expect(_question[0].options).deep.eq(questions[0].options)

//   // const signers = await ethers.getSigners();
//   // const respondent = signers[1];
//   // await s.connect(respondent);
//   // await s.submitAnswer({
//   //   respondent:respondent.address,
//   //   answers:[1],
//   // });
  
//   // console.log(await s.getAnswers());
//   const factory = await ethers.deployContract("SurveyFactory",[
//     ethers.parseEther("50"),
//     ethers.parseEther("0.1")
//   ]);
//   const tx = await factory.createSurvey({
//     title,
//     description,
//     targetNumber:100,
//     questions
//   },{
//     value:ethers.parseEther("100")
//   });
//   const receipt = await tx.wait();

//   let surveyAddress;
//   receipt?.logs.forEach(log=>{
//     const event = factory.interface.parseLog(log);
//     if(event?.name == "SurveyCreated"){
//       surveyAddress = event.args[0];
//     }
//   })

//   // const surveys = await factory.getSurveys();
//   const surveyC = await ethers.getContractFactory("Survey");
//   const signers = await ethers.getSigners();
//   const respondent = signers[0];
//   const survey = surveyC.attach(surveyAddress!);
//   await survey.connect(respondent);
//   // console.log(ethers.formatEther(await ethers.provider.getBalance(respondent)));
//   const submitTx = await survey.submitAnswer({
//     respondent,
//     answers:[1]
//   });
//   await submitTx.wait();
//   await ethers.provider.getBalance(respondent);
//   // console.log(ethers.formatEther(await ethers.provider.getBalance(respondent)));
// }); 

//require, event, require에 대한 테스트
// describe("SurveyFactory Contract", () => {
//   let factory,owner,respondent1,respondent2;


//   beforeEach(async () => {
//     const { ethers } = await network.connect();
//     const signers = await ethers.getSigners();
//     [owner, respondent1, respondent2] = signers;



//     factory = await ethers.deployContract("SurveyFactory", [

//       ethers.parseEther("50"), // min_pool_amount

//       ethers.parseEther("0.1"), // min_reward_amount

//     ]);

//   });



//   it("should deploy with correct minimum amounts", async () => {
//     // TODO: check min_pool_amount and min_reward_amount
//     expect(await factory.connect(owner).getMinPoolAmount()).to.equal(ethers.parseEther("50"));
//     expect(await factory.connect(owner).getMinRewardAmount()).to.equal(ethers.parseEther("0.1"));
//   });



//   it("should create a new survey when valid values are provided", async () => {

//     // TODO: prepare SurveySchema and call createSurvey with msg.value
//     const title = "설문조사";
//     const description = "테스트 설명";
//     const questions = [
//       { question: "질문1", options: ["1번", "2번"] }
//     ];
//     const targetNumber = 10;
//     const poolAmount = ethers.parseEther("100");

//     const beforeSurvey= await factory.getSurveys();

//     const tx = await factory.connect(respondent1).createSurvey({
//       title,description,targetNumber,questions
//     },{value:poolAmount});
//     const receipt = await tx.wait(); 

//     // TODO: check event SurveyCreated emitted
//     const eventFound = receipt?.logs.some(log => {
//     const event = factory.interface.parseLog(log);
//       return event?.name === "SurveyCreated";
//     });
//     expect(eventFound).to.be.true;

//     // TODO: check surveys array length increased
//     const afterSurvey = await factory.getSurveys();
//     expect(afterSurvey.length).to.equal(beforeSurvey.length + 1);
//   });



//   it("should revert if pool amount is too small", async () => {

//     // TODO: expect revert when msg.value < min_pool_amount
//     const title = "설문조사";
//     const description = "테스트 설명";
//     const questions = [
//       { question: "질문1", options: ["1번", "2번"] }
//     ];
//     const targetNumber = 10;
//     const poolAmount = ethers.parseEther("49"); // min_pool_amount보다 작은 경우

//     await expect(
//       factory.connect(respondent1).createSurvey({ title, description, targetNumber, questions }, { value: poolAmount })
//     ).to.be.revertedWith("insufficient pool amount");
//   });



//   it("should revert if reward amount per respondent is too small", async () => {

//     // TODO: expect revert when msg.value / targetNumber < min_reward_amount
//     const title = "설문조사";
//     const description = "테스트 설명";
//     const questions = [
//       { question: "질문1", options: ["1번", "2번"] }
//     ];
//     const targetNumber = 1000000;
//     const poolAmount = ethers.parseEther("51"); 

//     await expect(
//       factory.connect(respondent2).createSurvey({ title, description, targetNumber, questions }, { value: poolAmount })
//     ).to.be.revertedWith("insufficient reward amount");
//   });



//   it("should store created surveys and return them from getSurveys", async () => {

//     // TODO: create multiple surveys and check getSurveys output
//     // 첫 번째 설문 
//     const firstTx = await factory.connect(respondent1).createSurvey({
//       title: "설문1",
//       description: "설명1",
//       targetNumber: 10,
//       questions: [{ question: "Q1", options: ["A", "B"] }]
//     }, { value: ethers.parseEther("100") });

//     const firstReceipt = await firstTx.wait(); 
//     const firstContractAddress = firstReceipt.logs.map(log => {
//       const event = factory?.interface?.parseLog(log);
//         if (event?.name === "SurveyCreated") {
//           return event?.args[0];
//         }
//     }).filter(Boolean).pop();


//     // 두 번째 설문 
//     const secondTx = await factory.connect(respondent2).createSurvey({
//       title: "설문2",
//       description: "설명2",
//       targetNumber: 20,
//       questions: [{ question: "Q2", options: ["X", "Y"] }]
//     }, { value: ethers.parseEther("100") });

//     const secondReceipt = await secondTx.wait(); 
//     const secondContractAddress = secondReceipt.logs.map(log => {
//       const event = factory?.interface?.parseLog(log);
//         if (event?.name === "SurveyCreated") {
//           return event?.args[0];
//         }
//     }).filter(Boolean).pop();

//     const surveys = await factory.getSurveys();

//     // 배열 길이 확인
//     expect(surveys.length).to.be.gte(2);

//     // getSurveys()에서 ContractAddress 확인
//     expect(surveys[0]).to.equal(firstContractAddress);
//     expect(surveys[1]).to.equal(secondContractAddress);
//   });

// });


// it("Survey init", async()=>{
//   const {ethers} = await network.connect();
//   const title ="설문조사";
//   //32바이트 이하 - Slot, 초과 - pointer ref
//   const description = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#";
//   const questions : Question[]= [
//     {
//       question:"questionsabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
//       options:["옵션","11"],
//     },
//     {
//       question:"short string",
//       options:["옵션","11","22"],
//     }
//   ]
 

//   const survey = await ethers.deployContract("Survey",[
//     title,
//     description,
//     100,
//     questions
//   ],{
//     value:ethers.parseEther("100")
//   });
//   const slot0Data = await ethers.provider.getStorage(survey.getAddress(),ethers.toBeHex(0,32));
//   const slot1Data = await ethers.provider.getStorage(survey.getAddress(),ethers.toBeHex(1,32));
//   const slot2Data = await ethers.provider.getStorage(survey.getAddress(),ethers.toBeHex(2,32));
//   const slot3Data = await ethers.provider.getStorage(survey.getAddress(),ethers.toBeHex(3,32));
//   const slot4Data = await ethers.provider.getStorage(survey.getAddress(),ethers.toBeHex(4,32));
//   const slot5Data = await ethers.provider.getStorage(survey.getAddress(),ethers.toBeHex(5,32));
//   const slot6Data = await ethers.provider.getStorage(survey.getAddress(),ethers.toBeHex(6,32));
//   console.log(Buffer.from(slot0Data.slice(2), 'hex').toString('utf-8'));
//   const decodeUni = (hex:string)=>Buffer.from(hex.slice(2),"hex").toString("utf-8");
//   const nextHash = (hex:string,i:number)=>
//     "0x"+(BigInt(hex) + BigInt(i)).toString(16);
//   console.log("primitive type");
//   console.log(slot2Data); 
//   console.log(slot3Data); 


//   //long string type
//   console.log("\n long string type "); 
//   console.log(slot1Data); 
//   const pDesc = ethers.keccak256(ethers.toBeHex(1,32));
//   const desc0 = await ethers.provider.getStorage(await survey.getAddress(),pDesc);
//   console.log(decodeUni(desc));
//   여기까지
//   const desc1 = await ethers.provider.getStorage(await survey.getAddress(),nextHash(pDesc,1));
//   const desc2 = await ethers.provider.getStorage(await survey.getAddress(),nextHash(pDesc,2));

//   console.log(desc0);
//   console.log(desc1);
//   console.log(desc2);
  // Array type
  // pQuestions = 0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b
  // question1 <- pQuestions 0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19c
  // question1.option[] <- pQuestions + 1 0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19d
  // question2 <- pQuestions +2 0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19e
  // question2.option[] <- pQuestions +3. 0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19f
  // console.log("\n-----array type");
  // const pQuestions = ethers.keccak256(ethers.toBeHex(4,32));
  // const question1 = await ethers.provider.getStorage(survey.getAddress(),nextHash(pQuestions,0));
  // const question1_option = await ethers.provider.getStorage(survey.getAddress(),nextHash(pQuestions,1));
  // const question2 = await ethers.provider.getStorage(survey.getAddress(),nextHash(pQuestions,2));
  // const question2_option = await ethers.provider.getStorage(survey.getAddress(),nextHash(pQuestions,3));
  // console.log(slot4Data);
  // console.log("question1",question1);
  // console.log("question1_optioin",question1_option);
  // console.log("question2",question2, decode(question2));
  // console.log("question2_option",question2_option);
  
  // //map
  // //map[k,slot address]
  // console.log(slot6Data);
  // const address = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";
  // const mapKeyAddress = ethers.keccak256(ethers.toBeHex(address,32) + ethers.toBeHex(6,32).slice(2));
  // const map1Value = await ethers.provider.getStorage(survey.getAddress(),mapKeyAddress );
  // console.log(map1Value);


// }); 


describe("Survey init", () => {

  const title = "막무가내 설문조사라면";

  const description =

    "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";

  const questions: Question[] = [

    {
      question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
      options: [

        "구글폼 운영자",

        "탈중앙화된 블록체인 (관리주체 없으며 모든 데이터 공개)",

        "상관없음",

      ],
    }

  ];



  const getSurveyContractAndEthers = async (survey: {

    title: string;

    description: string;

    targetNumber: number;

    questions: Question[];

  }) => {

    const { ethers } = await network.connect();

    const cSurvey = await ethers.deployContract("Survey", [

      survey.title,

      survey.description,

      survey.targetNumber,

      survey.questions,

    ]);

    return { ethers, cSurvey };

  };



  describe("Deployment", () => {

    it("should store survey info correctly", async () => {

      // targetNumber와 함께 배포 시 title/description/targetNumber/rewardAmount 검증
      const targetNumber = 10;
      const { ethers } = await network.connect();
      const value = ethers.parseEther("1"); 
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],
        { value }
      );

      // 컨트랙트에 저장된 값 검증
      expect(await cSurvey.title()).to.equal(title);
      expect(await cSurvey.description()).to.equal(description);
      expect((await cSurvey.targetNumber()).toString()).to.equal(
        targetNumber.toString()
      );

      // rewardAmount는 msg.value / targetNumber
      const expectedReward = value / BigInt(targetNumber);
      expect(await cSurvey.rewardAmount()).to.equal(expectedReward);

    });

    it("should calculate rewardAmount correctly", async () => {

      // 배포 시 rewardAmount 계산이 올바른지 별도 테스트
      const targetNumber = 4;
      const { ethers } = await network.connect();
      const value = ethers.parseEther("2");
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],
        { value }
      );

      const expectedReward = value / BigInt(targetNumber);
      expect(await cSurvey.rewardAmount()).to.equal(expectedReward);
    });

  });



  describe("Questions and Answers", () => {

    it("should return questions correctly", async () => {

      const targetNumber = 5;
      const { ethers } = await network.connect();
      const value = ethers.parseEther("2");
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],
        { value }
      );

      const fetched = await cSurvey.getQuestions();
      expect(fetched.length).to.equal(questions.length);
      expect(fetched[0].question).to.equal(questions[0].question);
      expect(fetched[0].options.length).to.equal(questions[0].options.length);
      expect(fetched[0].options[0]).to.equal(questions[0].options[0]);
    });

    it("should allow valid answer submission", async () => {
      // 타깃 1인 설문에 대해 응답 제출 후 answers 배열에 반영되는지 검사
      const targetNumber = 1;
      const { ethers } = await network.connect();
      const value = ethers.parseEther("2");
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],
        { value }
      );
      const signers = await ethers.getSigners();
      const respondent = signers[1];

      await cSurvey.connect(respondent).submitAnswer({
        respondent: respondent.address,
        answers: [1], 
      });

      const answers = await cSurvey.getAnswers();
      expect(answers.length).to.equal(1);
      expect(answers[0].respondent).to.equal(respondent.address);
      expect(Number(answers[0].answers[0])).to.equal(1);

    });

    it("should revert if answer length mismatch", async () => {

      const targetNumber = 10;
      const { ethers } = await network.connect();
      const value = ethers.parseEther("2");
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],{value}
      );
      const signers = await ethers.getSigners();
      const respondent = signers[1];

      await expect(
        cSurvey.connect(respondent).submitAnswer({
          respondent: respondent.address,
          answers: [1,2,3], 
      })).to.be.revertedWith("Mismatched answers len");
      
    });

    it("should revert if target reached", async () => {

      const targetNumber = 1; // limit = 1
      const { ethers } = await network.connect();

      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions]
      );

      const signers = await ethers.getSigners();
      const respondent1 = signers[1];
      const respondent2 = signers[2];


      await cSurvey.connect(respondent1).submitAnswer({
        respondent: respondent1.address,
        answers: [0],
      });
     
      await expect(
        cSurvey.connect(respondent2).submitAnswer({
          respondent: respondent2.address,
          answers: [0],
        })
      ).to.be.revertedWith("This survey has been ended");

    });

  });



  describe("Rewards", () => {

    it("should pay correct reward to respondent", async () => {

      const targetNumber = 10;
      const { ethers } = await network.connect();
      const value = ethers.parseEther("1"); // 총 풀 1 ETH
      const cSurvey = await ethers.deployContract(
        "Survey",
        [title, description, targetNumber, questions],
        { value }
      );

      const signers = await ethers.getSigners();
      const respondent = signers[1];


      const contractBefore = await ethers.provider.getBalance(
        await cSurvey.getAddress()
      );

      const rewardAmount = await cSurvey.rewardAmount();

      await cSurvey.connect(respondent).submitAnswer({
        respondent: respondent.address,
        answers: [0],
      });

      const contractAfter = await ethers.provider.getBalance(
        await cSurvey.getAddress()
      );

      expect(contractBefore - contractAfter).to.equal(rewardAmount);

    });

  });

});