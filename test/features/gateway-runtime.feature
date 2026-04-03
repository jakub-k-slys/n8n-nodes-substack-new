Feature: Gateway runtime
  Scenario: decode a supported gateway operation
    Given the gateway resource "profile" and operation "getProfilePosts"
    When I decode the gateway operation
    Then the decoded gateway operation should equal:
      """
      {
        "_tag": "Profile",
        "operation": "getProfilePosts"
      }
      """

  Scenario: reject an unsupported gateway operation
    Given the gateway resource "note" and operation "getProfile"
    When I decode the gateway operation
    Then the gateway operation error should equal:
      """
      {
        "_tag": "UnsupportedOperation",
        "resource": "note",
        "operation": "getProfile"
      }
      """

  Scenario: read typed note creation input
    Given the gateway context parameters:
      """
      {
        "content": "hello",
        "attachment": "https://example.com/file.png"
      }
      """
    And the typed gateway operation:
      """
      {
        "_tag": "Note",
        "operation": "createNote"
      }
      """
    When I read gateway input
    Then the read gateway input should equal:
      """
      {
        "_tag": "createNote",
        "content": "hello",
        "attachment": "https://example.com/file.png"
      }
      """

  Scenario: normalize blank cursor input
    Given the gateway context parameters:
      """
      {
        "profileSlug": "substack",
        "cursor": "   "
      }
      """
    And the typed gateway operation:
      """
      {
        "_tag": "Profile",
        "operation": "getProfileNotes"
      }
      """
    When I read gateway input
    Then the read gateway input should equal:
      """
      {
        "_tag": "getProfileNotes",
        "profileSlug": "substack"
      }
      """

  Scenario: delegate a request through HttpClient
    Given the gateway request:
      """
      {
        "method": "GET",
        "url": "http://localhost:5001/api/v1/me",
        "responseMode": "single"
      }
      """
    And an HttpClient service response:
      """
      {
        "ok": true
      }
      """
    When I execute the gateway request through the service
    Then the executed gateway response should equal:
      """
      {
        "ok": true
      }
      """
    And the executed gateway request should equal:
      """
      {
        "method": "GET",
        "url": "http://localhost:5001/api/v1/me",
        "urlParams": {},
        "headers": {},
        "body": null
      }
      """

  Scenario: build a live gateway client layer from n8n context
    Given the gateway request:
      """
      {
        "method": "GET",
        "url": "http://localhost:5001/api/v1/me",
        "responseMode": "single"
      }
      """
    When I execute the gateway request through the live layer
    Then the executed gateway response should equal:
      """
      {
        "ok": true
      }
      """
    And the live gateway call should equal:
      """
      {
        "credentialName": "substackGatewayApi",
        "request": {
          "json": true,
          "returnFullResponse": true,
          "method": "GET",
          "url": "http://localhost:5001/api/v1/me"
        }
      }
      """

  Scenario: serialize a note result to json items
    Given the gateway result:
      """
      {
        "_tag": "Note",
        "result": {
          "_tag": "Fetched",
          "item": {
            "id": 1,
            "body": "Hello",
            "likesCount": 3,
            "author": {
              "id": 2,
              "name": "Jakub",
              "handle": "jakub",
              "avatarUrl": "https://cdn.example/avatar.png"
            },
            "publishedAt": "2026-04-02T12:00:00.000Z"
          }
        }
      }
      """
    When I serialize the gateway result
    Then the serialized gateway items should equal:
      """
      [
        {
          "id": 1,
          "body": "Hello",
          "likesCount": 3,
          "author": {
            "id": 2,
            "name": "Jakub",
            "handle": "jakub",
            "avatarUrl": "https://cdn.example/avatar.png"
          },
          "publishedAt": "2026-04-02T12:00:00.000Z"
        }
      ]
      """
