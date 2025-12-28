// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Question {
  string question;
  string[] options;
}

struct Answer {
  address respondent;
  uint8[] answers;
}

contract Survey {
  string public title;
  string public description;
  uint256 public targetNumber;
  uint256 public rewardAmount;
  Question[] public questions;
  Answer[] answers;
  //primitive: uint, int, bool, address, bytes32
  constructor(
    string memory _title,
    string memory _description,
    uint256 _targetNumber,
    Question[] memory _questions
  ) payable {
    title = _title;
    description = _description;
    targetNumber = _targetNumber;
    rewardAmount = msg.value / _targetNumber;
    for (uint i = 0; i < _questions.length; i++) {
      questions.push(
        Question({
          question: _questions[i].question,
          options: _questions[i].options
        })
      );
      /*Question storage q = questions.push(Question({})); // 만약 이전 과정이 없다면 푸시를 했을때 비어있는 구조체가 생성된다.
        q.question = _questions[i].question;
        q.options = _questions[i].options; */
    }
  }

  function submitAnswer(Answer calldata _answer) external {
    require(
      _answer.answers.length == questions.length,
      "Mismatched answers length"
    );
    require(answers.length < targetNumber, "This survey has been ended");

    answers.push(
      Answer({respondent: _answer.respondent, answers: _answer.answers})
    );
    payable(msg.sender).transfer(rewardAmount);
  }

  function getAnswers() external view returns (Answer[] memory) {
    return answers;
  }

  function getquestions() external view returns (Question[] memory) {
    return questions;
  }
}
