# Cucumber JSON formatter

This extension allow you to automatically indent all the JSON in the current opened `.feature` file.

[GitHub repository](https://github.com/XavierLeTohic/cucumber-json-formatter)\
[Create an issue](https://github.com/XavierLeTohic/cucumber-json-formatter/issues/new)\
[Write a review](https://marketplace.visualstudio.com/items?itemName=xletohic.cucumber-json-formatter#review-details)

## Usage
1. Open your `.feature` file
2. Open command list: `CMD + Maj + P`
3. Select `Format JSON on the current .feature file`

## Incoming features
- [x] Indent size from editor config (.editorconfig or VScode settings)
- [ ] Command that prompt a popup to ask for a custom indent size
- [ ] Command that indent all JSON on all .feature files
- [ ] Command that indent everything on the current .feature file

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
