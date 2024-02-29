(function (tinymce) {
  console.log("formaula plugin", this);
  const locale = window.$i18n.locale;
  console.log(window.$i18n.messages[locale]);
  const { modalTitle } = window.$i18n.messages[locale].tinymce.plugins.formula;
  tinymce.create("tinymce.plugins.Formula", {
    init(editor, url) {
      const options = editor.getParam("formula") || {};
      const path = options.path || url;
      editor.ui.registry.addIcon(
        "formula",
        '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24px" height="24px" viewBox="0 0 100 100" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path style="opacity:0.871" fill="#000000" d="M 50.5,5.5 C 61.143,2.99644 65.9764,6.99644 65,17.5C 62.8471,19.4439 60.3471,19.9439 57.5,19C 54.8783,15.8695 54.8783,12.7028 57.5,9.5C 52.1864,8.58526 48.6864,10.9186 47,16.5C 44.2497,22.5824 42.4164,28.9157 41.5,35.5C 45.5546,35.1758 49.5546,35.5091 53.5,36.5C 53.1667,37.1667 52.8333,37.8333 52.5,38.5C 48.2172,39.4922 43.8839,39.8256 39.5,39.5C 38.0664,56.5771 33.2331,72.5771 25,87.5C 19.6363,93.0612 13.1363,94.8945 5.5,93C 1.06984,89.2215 0.40317,84.8882 3.5,80C 11.5738,79.1484 13.5738,82.3151 9.5,89.5C 12.1878,90.7974 14.6878,90.4641 17,88.5C 18,86.5 19,84.5 20,82.5C 23.3006,68.326 26.4673,54.1593 29.5,40C 25.4592,39.8265 21.4592,39.3265 17.5,38.5C 17.8333,37.8333 18.1667,37.1667 18.5,36.5C 22.5,35.8333 26.5,35.1667 30.5,34.5C 33.4031,25.5247 37.7365,17.358 43.5,10C 45.8981,8.47576 48.2314,6.97576 50.5,5.5 Z"/></g><g><path style="opacity:0.823" fill="#000000" d="M 64.5,35.5 C 67.5184,35.3354 70.5184,35.502 73.5,36C 76.5857,39.3406 78.7524,43.1739 80,47.5C 83.6167,43.7614 87.1167,39.9281 90.5,36C 96.6667,34.1667 98.8333,36.3333 97,42.5C 94.9307,43.2638 92.764,43.7638 90.5,44C 86.7974,47.3675 83.464,51.0342 80.5,55C 81.5224,59.4212 82.8557,63.7545 84.5,68C 88.8636,68.8221 91.5303,66.9888 92.5,62.5C 94.0453,61.5481 95.712,61.2148 97.5,61.5C 95.8946,71.9458 89.8946,76.4458 79.5,75C 76.4143,71.6594 74.2476,67.8261 73,63.5C 69.3833,67.2386 65.8833,71.0719 62.5,75C 56.3333,76.8333 54.1667,74.6667 56,68.5C 63.8204,66.8496 68.9871,62.1829 71.5,54.5C 71.066,50.4877 70.066,46.6544 68.5,43C 66.8333,42.3333 65.1667,42.3333 63.5,43C 62.373,44.7533 61.373,46.5866 60.5,48.5C 58.9547,49.4519 57.288,49.7852 55.5,49.5C 56.4863,43.5247 59.4863,38.858 64.5,35.5 Z"/></g></svg>'
      );
      editor.ui.registry.addButton("formula", {
        tooltip: "Insert Formula",
        icon: "formula",
        onAction: showFormulaDialog.bind(this, editor, path),
        onPostRender() {
          const _this = this; // reference to the button itself
          editor.on("NodeChange", function (e) {
            _this.active(
              e.element.className.includes("fm-editor-equation") &&
                e.element.nodeName.toLowerCase() == "img"
            );
          });
        },
      });
    },
  });
  tinymce.PluginManager.requireLangPack("formula", "en,es,fr_FR");
  tinymce.PluginManager.add("formula", tinymce.plugins.Formula);

  function showFormulaDialog(editor, url) {
    editor.windowManager.open({
      title: modalTitle,
      width: 900,
      height: 610,
      body: {
        type: "panel",
        items: [
          {
            type: "htmlpanel",
            html: buildIFrame(editor, url),
          },
        ],
      },
      onCancel(instance) {
        instance.close();
      },
      onSubmit(instance) {
        if (
          window.frames.tinymceFormula &&
          window.frames.tinymceFormula.getData
        ) {
          window.frames.tinymceFormula.getData(function (src, mlang, equation) {
            if (src) {
              editor.insertContent(
                '<img class="fm-editor-equation" src="' +
                  src +
                  '" data-mlang="' +
                  mlang +
                  '" data-equation="' +
                  encodeURIComponent(equation) +
                  '"/>'
              );
            }
            instance.close();
          });
        } else {
          instance.close();
        }
      },
      buttons: [
        {
          type: "cancel",
          name: "customCancel",
          text: "Cancel",
        },
        {
          text: "Insert",
          primary: true,
          name: "customSubmit",
          type: "submit",
        },
      ],
    });
  }

  function buildIFrame(editor, url) {
    const currentNode = editor.selection.getNode();
    const lang = editor.getParam("language") || "en";
    let mlangParam = "";
    let equationParam = "";
    if (
      currentNode.nodeName.toLowerCase() == "img" &&
      currentNode.className.includes("fm-editor-equation")
    ) {
      if (currentNode.getAttribute("data-mlang"))
        mlangParam = "&mlang=" + currentNode.getAttribute("data-mlang");
      if (currentNode.getAttribute("data-equation"))
        equationParam =
          "&equation=" + currentNode.getAttribute("data-equation");
    }
    const html =
      '<iframe name="tinymceFormula" id="tinymceFormula" src="' +
      url +
      "/index.html" +
      "?lang=" +
      lang +
      mlangParam +
      equationParam +
      '" scrolling="no" frameborder="0"></iframe>';
    return html;
  }
})(window.tinymce);
