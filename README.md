# cucumber-json-formatter

This extension allow you to automatically indent the JSON in your `.feature` files.

## Usage
1. Open your `.feature` file
2. Open command list: `CMD + Maj + P`
3. Select `Format JSON on the current .feature file`

## Incoming features
- [x] GitHub Repo
- [ ] Indent size option

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
