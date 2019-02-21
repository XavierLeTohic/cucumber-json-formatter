# Cucumber JSON formatter

This extension allow you to automatically indent the JSON in your `.feature` files.

[GitHub repository](https://github.com/xletohic-thefork/cucumber-json-formatter)\
[Create an issue](https://github.com/xletohic-thefork/cucumber-json-formatter/issues/new)\
[Write a review](https://marketplace.visualstudio.com/items?itemName=xletohic.cucumber-json-formatter#review-details)

## Usage
1. Open your `.feature` file
2. Open command list: `CMD + Maj + P`
3. Select `Format JSON on the current .feature file`

## Incoming features
- [ ] Get indent size from .editorconfig
- [ ] Prompt to ask indent size
- [ ] Indent all feature file (scenarios + steps + JSON)

## Example

Before
```feature
  Scenario: Should format JSON
    Given the following JSON:
      """
      {
      "hello": "world",
      "object":{
      "john": "doe"  
      }
      }
      """
```

After
```feature
  Scenario: Should format JSON
    Given the following JSON:
      """
      {
        "hello": "world",
        "object": {
          "john": "doe"
        }
      }
      """
```
