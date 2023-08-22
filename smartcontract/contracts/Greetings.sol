// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Greetings {
    string private greetingMessage;

    constructor(string memory initialMessage) {
        greetingMessage = initialMessage;
    }

    function setGreeting(string memory newGreeting) public {
        greetingMessage = newGreeting;
    }

    function getGreeting() public view returns (string memory) {
        return greetingMessage;
    }
}