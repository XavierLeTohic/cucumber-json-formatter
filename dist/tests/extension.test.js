"use strict";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module['default'];
        } : function() {
            return module;
        };
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
(()=>{
    __webpack_require__.d = function(exports1, definition) {
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
})();
var __webpack_exports__ = {};
const index_js_namespaceObject = require("../../node_modules/indent-string/index.js");
var index_js_default = /*#__PURE__*/ __webpack_require__.n(index_js_namespaceObject);
describe('Cucumber JSON Formatter', ()=>{
    const formatCucumberJson = (content)=>{
        const regex = /"""(.*?)\"""/sg;
        return content.replace(regex, (match, offset, index)=>{
            try {
                const json = JSON.parse(offset);
                const formattedJSON = JSON.stringify(json, null, 2);
                const [tripleQuotes] = content.slice(0, index).split(/\n/g).reverse();
                const fileIndentSize = tripleQuotes.search(/\S|$/);
                return `"""\n${index_js_default()(`${formattedJSON}\n"""`, fileIndentSize)}`;
            } catch (error) {
                return match;
            }
        });
    };
    test('should format JSON within triple quotes', ()=>{
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
    test('should handle multiple JSON blocks', ()=>{
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
    test('should preserve non-JSON content', ()=>{
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
    test('should not modify invalid JSON', ()=>{
        const input = `Scenario: Invalid JSON
    Given invalid JSON:
      """
{
  invalid json here
}
      """`;
        expect(formatCucumberJson(input)).toBe(input);
    });
    test('should maintain indentation based on triple quotes position', ()=>{
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
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});
