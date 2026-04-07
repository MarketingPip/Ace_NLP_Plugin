<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ace NLP Custom Highlighter</title>
    <style>
        body { font-family: sans-serif; margin: 20px; background: #f4f4f9; }
        #editor { 
            height: 500px; 
            width: 100%; 
            border: 1px solid #ccc; 
            border-radius: 4px;
            font-size: 14px;
        }
        /* Custom Token Styling */
        .ace_nlp-person { background: rgba(0, 120, 255, 0.2); border-bottom: 2px solid #0078ff; color: #004a9b; }
        .ace_nlp-place { background: rgba(0, 200, 80, 0.2); border-bottom: 2px solid #00c850; }
        .ace_nlp-money { color: #d91e18; font-weight: bold; text-decoration: underline; }
    </style>
</head>
<body>

    <h2>NLP-Driven Ace Highlighting</h2>
    <div id="editor">John Doe went to Paris with $50.00. 
The Eiffel Tower is beautiful in July. 
Steve Jobs lived in California.</div>

<script type="module">
    // 1. Import Ace and NLP library from esm.sh
    import ace from 'https://esm.sh/ace-builds';
    import nlp from 'https://esm.sh/compromise';

    // 2. Define the Highlighting Rules
    const { TextHighlightRules } = ace.require("ace/mode/text_highlight_rules");

    class NLPHighlightRules extends TextHighlightRules {
        constructor() {
            super();
            
            // We define basic rules. For a truly dynamic NLP feel,
            // we use regex patterns that target common NLP entities.
            this.$rules = {
                "start": [
                    {
                        token: "nlp-person", 
                        // Simplified regex for the demo; in a real app, 
                        // you could generate these from nlp(text).people().text()
                        regex: "\\b(John Doe|Steve Jobs|Alice|Bob)\\b"
                    },
                    {
                        token: "nlp-place",
                        regex: "\\b(Paris|California|London|New York)\\b"
                    },
                    {
                        token: "nlp-money",
                        regex: "\\$[0-9]+(?:\\.[0-9]{2})?\\b"
                    }
                ]
            };
        }
    }

    // 3. Define the Mode
    const { Mode: TextMode } = ace.require("ace/mode/text");
    class NLPMode extends TextMode {
        constructor() {
            super();
            this.HighlightRules = NLPHighlightRules;
        }
    }

    // 4. Initialize Editor
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    
    // Set the initial mode
    const customMode = new NLPMode();
    editor.session.setMode(customMode);

    // 5. Implementing your specific "Plugin" style
    // This function can be called to update rules based on fresh NLP analysis
    const updateHighlights = (editor, patterns) => {
        // In Ace, to change rules dynamically, we update the Rule prototype
        // or re-assign a new Mode instance.
        class DynamicRules extends TextHighlightRules {
            constructor() {
                super();
                this.$rules = {
                    "start": Object.keys(patterns).map(key => ({
                        token: `nlp-${patterns[key]}`,
                        regex: key
                    }))
                };
            }
        }
        
        const DynamicMode = new TextMode();
        DynamicMode.HighlightRules = DynamicRules;
        editor.session.setMode(DynamicMode);
    };

    // Example: Update highlights after 2 seconds to show dynamic capability
    setTimeout(() => {
        console.log("Updating highlights via NLP pattern object...");
        updateHighlights(editor, {
            "Eiffel Tower": "place",
            "July": "person" // Just to show it changing!
        });
    }, 3000);

</script>
</body>
</html>
