# Ace Editor with NLP Highlighting Plugin

This project demonstrates how to use [Ace](https://ace.c9.io/), an embeddable code editor, with NLP (Natural Language Processing) annotations. The editor highlights different types of entities (e.g., person, place, organization) using a lightweight NLP library, such as [Compromise](https://github.com/spencermountain/compromise), and custom highlighting rules.

## Features

* **Ace Editor**: Embeds the Ace code editor in the webpage.
* **NLP Entity Recognition**: Highlights entities like dates, persons, places, organizations, emails, currencies, and more.
* **Custom Highlighting**: You can define custom patterns for various types of entities.
* **Modular Imports**: Uses ES modules to import the necessary libraries and plugins.

## Live Demo

You can see a live demo of this setup by including the following snippet in your HTML:

```html
<style>
  #editor {
    height: 300px;
  }

  .ner.person {
    background-color: #e6f7d4;
  }

  .ner.place {
    background-color: #d4e6f1;
  }

  .ner.organization {
    background-color: #f8d7da;
  }

  .ner.date {
    background-color: #fff3cd;
  }

  .ner.url {
    background-color: #fff3cd;
  }

  .ner.currency {
    background-color: red;
  }

  .ner.value {
    background-color: pink;
  }

  .ner.email {
    background-color: blue;
  }

  .ner.atMention {
    background-color: yellow;
  }

  .ner {
    position: absolute;
    z-index: 20;
  }
</style>

<div id="editor">John Doe met Jane Smith at the Eiffel Tower in Paris on 2023-08-15. 
John is planning to visit his favorite restaurant, Le Gourmet Bistro, 
which is located at 123 Rue de la Paix, Paris, France. 
He booked the reservation through www.gourmetbistro.com and paid €100 for the meal.

Jane's email address is jane.smith@example.com and she is working on a new project at Tech Innovations Inc.
They both plan to attend the Global Tech Conference in New York on 2023-09-12.

During their conversation, John mentioned his favorite investment is in $5000 worth of Tesla, Inc. stocks. 
Jane said she saw a new article about Apple Inc. and plans to check it out later on her phone.

John also asked Jane if she saw the post from @TechGiant about the latest tech trends.</div>

<script type="module">
  import ace from 'https://esm.sh/ace-builds/src-noconflict/ace';
  import nlp from "https://esm.sh/compromise";
  import * as b from "https://esm.sh/gh/MarketingPip/Ace_NLP_Plugin/";

  var editor = ace.edit('editor');
  const highlightWords = ace.require('ace/plugin/yaml-validation');

  const patterns = {
    "#Date+": "date",
    "jared man": "person",
    "#Place+": "place",
    "#Organization+": "organization",
    "#Url+": "url",
    "#PhoneNumber+": "phone",
    "#AtMention+": "atMention",
    "#Email+": "email",
    "#Currency+": "currency",
    "#Value+": "value",
  };

  editor.getSession().on('change', function() {
    highlightWords(editor, patterns, nlp);
  });

  highlightWords(editor, patterns, nlp);
</script>
```

## Prerequisites

* A modern web browser (Chrome, Firefox, Safari, Edge)
* Basic understanding of HTML, JavaScript, and ES6 modules

## How It Works

1. **Ace Editor**: The Ace editor is embedded in a `div` element with the ID `editor`. It provides a lightweight and feature-rich code editor.

2. **NLP Entity Recognition**: Using the [Compromise](https://github.com/spencermountain/compromise) library, we perform natural language processing (NLP) to recognize entities like persons, places, dates, and more. These entities are highlighted based on the patterns defined in the `patterns` object.

3. **Custom Highlighting**: You can define new patterns in the `patterns` object to match various types of entities (like phone numbers, URLs, etc.). The `highlightWords` function highlights these entities in the editor.

4. **CSS Styling**: The `.ner` class and its variations (like `.ner.person`, `.ner.date`, etc.) are used to apply custom background colors to different types of entities.

5. **Live Updates**: Every time you make a change in the editor, the `change` event is triggered, and the `highlightWords` function is called to update the highlighted entities based on the current content.

## Customization

You can easily customize this setup by:

* **Modifying the Patterns**: Add, remove, or modify entity patterns in the `patterns` object.
* **Changing the Styles**: Update the CSS styles in the `<style>` tag to change how different entities are highlighted.
* **Using Other NLP Libraries**: You can replace the `compromise` library with other versions of `compromise` for your language.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
