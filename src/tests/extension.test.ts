import indentString from 'indent-string';

describe('Cucumber JSON Formatter', () => {

    const formatCucumberJson = (content: string) => {
        const regex = /"""(.*?)\"""/sg;
        return content.replace(regex, (match: string, offset: string, index: number) => {
            try {
                const json = JSON.parse(offset);
                const formattedJSON = JSON.stringify(json, null, 2);
                const [tripleQuotes] = content
                    .slice(0, index)
                    .split(/\n/g)
                    .reverse();
                const fileIndentSize = tripleQuotes.search(/\S|$/);
                return `"""\n${indentString(`${formattedJSON}\n"""`, fileIndentSize)}`;
            } catch (error) {
                return match;
            }
        });
    };

    test('should format JSON within triple quotes', () => {
        const input = `Scenario: Test JSON
    Given the following JSON:
      """
{
"hello": "world",
"object":{
"john": "doe"  
}
}
      """`;

        const expected = `Scenario: Test JSON
    Given the following JSON:
      """
      {
        "hello": "world",
        "object": {
          "john": "doe"
        }
      }
      """`;

        expect(formatCucumberJson(input)).toBe(expected);
    });

    test('should handle multiple JSON blocks', () => {
        const input = `Feature: Multiple JSONs
    Scenario: First JSON
      Given JSON one:
        """
{"first": "block"}
        """
    Scenario: Second JSON
      Given JSON two:
        """
{"second": "block"}
        """`;

        const expected = `Feature: Multiple JSONs
    Scenario: First JSON
      Given JSON one:
        """
        {
          "first": "block"
        }
        """
    Scenario: Second JSON
      Given JSON two:
        """
        {
          "second": "block"
        }
        """`;

        expect(formatCucumberJson(input)).toBe(expected);
    });

    test('should preserve non-JSON content', () => {
        const input = `Feature: Mixed Content
    Given some regular text
    And some JSON:
      """
{"key": "value"}
      """
    Then more regular text`;

        const expected = `Feature: Mixed Content
    Given some regular text
    And some JSON:
      """
      {
        "key": "value"
      }
      """
    Then more regular text`;

        expect(formatCucumberJson(input)).toBe(expected);
    });

    test('should not modify invalid JSON', () => {
        const input = `Scenario: Invalid JSON
    Given invalid JSON:
      """
{
  invalid json here
}
      """`;

        expect(formatCucumberJson(input)).toBe(input);
    });

    test('should maintain indentation based on triple quotes position', () => {
        const input = `Scenario: Indented JSON
        Given deeply indented JSON:
          """
{"test": "value"}
          """`;

        const expected = `Scenario: Indented JSON
        Given deeply indented JSON:
          """
          {
            "test": "value"
          }
          """`;

        expect(formatCucumberJson(input)).toBe(expected);
    });
});