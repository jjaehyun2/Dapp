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
  Question[] public questions;
  Answer[] answers;
  //primitive: uint, int, bool, address, bytes32
  constructor(
    string memory _title,
    string memory _description,
    Question[] memory _questions
  ) {
    title = _title;
    description = _description;
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

    answers.push(
      Answer({respondent: _answer.respondent, answers: _answer.answers})
    );
  }

  function getAnswers() external view returns (Answer[] memory) {
    return answers;
  }

  function getquestions() external view returns (Question[] memory) {
    return questions;
  }
}
